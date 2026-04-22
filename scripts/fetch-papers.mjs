/**
 * 抓取 arXiv 后与本地 papers-latest.json 合并：仅追加新篇、按 id 去重，
 * 新篇需通过 scripts/paper-quality.mjs 的机构/顶会启发式筛选；全量按发布时间降序排序。
 * Run: node scripts/fetch-papers.mjs
 * 可选：SKIP_TRANSLATE=1 跳过标题中译
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import { matchesAffiliationHeuristic } from "./paper-quality.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "data");
const outFile = path.join(outDir, "papers-latest.json");

const MAX_FETCH = 70;
const SEARCH = `search_query=all:recommendation+AND+all:generative&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_FETCH}`;
const API = `http://export.arxiv.org/api/query?${SEARCH}`;

function asArray(x) {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}

function normSpace(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeId(id) {
  return String(id)
    .replace(/v\d+$/i, "")
    .trim();
}

function looksMostlyChinese(s) {
  const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk / Math.max(s.length, 1) > 0.35;
}

async function translateTitleEnToZh(text, delayMs) {
  if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  const q = text.slice(0, 480);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|zh-CN`;
  const res = await fetch(url, {
    headers: { "User-Agent": "gr-handbook-fetch-papers/1.0 (educational)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out || typeof out !== "string") return null;
  const trimmed = normSpace(out);
  if (!trimmed || trimmed === normSpace(text)) return null;
  if (/MYMEMORY\s+WARNING/i.test(trimmed)) return null;
  return trimmed;
}

function parseEntry(entry) {
  const id = normSpace(entry.id);
  const shortId = id.split("/abs/").pop()?.replace(/v\d+$/i, "") ?? id;
  const title = normSpace(entry.title);
  const published = normSpace(entry.published).slice(0, 10);
  const updated = normSpace(entry.updated).slice(0, 10);
  const summary = normSpace(entry.summary);
  const authors = asArray(entry.author).map((a) => normSpace(a.name));
  const categories = asArray(entry.category).map((c) => c["@_term"] ?? "").filter(Boolean);
  const arxivComment = normSpace(entry["arxiv:comment"] ?? "");
  const arxivDoi = normSpace(entry["arxiv:doi"] ?? "");
  const arxivJournalRef = normSpace(entry["arxiv:journal_ref"] ?? "");

  const links = asArray(entry.link);
  const pdfLink = links.find((l) => l["@_title"] === "pdf" || l["@_type"] === "application/pdf");
  const linkAbs = id;
  let linkPdf = pdfLink?.["@_href"];
  if (!linkPdf && linkAbs.includes("/abs/")) {
    linkPdf = linkAbs.replace("/abs/", "/pdf/") + ".pdf";
  }
  if (!linkPdf) linkPdf = linkAbs;

  return {
    id: shortId,
    title,
    authors,
    published,
    updated,
    summary,
    linkAbs,
    linkPdf,
    categories,
    arxivComment,
    arxivDoi,
    arxivJournalRef,
  };
}

function stripArxivMeta(item) {
  const { arxivComment, arxivDoi, arxivJournalRef, ...rest } = item;
  return rest;
}

function sortByPublishedDesc(items) {
  return [...items].sort((a, b) => {
    const c = b.published.localeCompare(a.published);
    if (c !== 0) return c;
    return b.updated.localeCompare(a.updated);
  });
}

function loadExistingItems() {
  if (!fs.existsSync(outFile)) return [];
  try {
    const prev = JSON.parse(fs.readFileSync(outFile, "utf8"));
    if (!Array.isArray(prev.items)) return [];
    return prev.items;
  } catch (e) {
    console.warn("Ignoring unreadable papers-latest.json:", e.message);
    return [];
  }
}

async function main() {
  const existingItems = loadExistingItems();
  const byId = new Map();
  for (const item of existingItems) {
    byId.set(normalizeId(item.id), item);
  }
  const countBefore = byId.size;

  const res = await fetch(API);
  if (!res.ok) throw new Error(`arXiv HTTP ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });
  const doc = parser.parse(xml);
  const rawEntries = asArray(doc.feed?.entry);
  const parsed = rawEntries.map(parseEntry);

  let skippedFilter = 0;
  let skippedDup = 0;
  const toAdd = [];
  for (const item of parsed) {
    const nid = normalizeId(item.id);
    if (byId.has(nid)) {
      skippedDup += 1;
      continue;
    }
    if (!matchesAffiliationHeuristic(item)) {
      skippedFilter += 1;
      continue;
    }
    toAdd.push(item);
  }

  const skipTranslate = process.env.SKIP_TRANSLATE === "1";
  const enrichedNew = [];
  let i = 0;
  for (const item of toAdd) {
    let titleZh;
    if (!skipTranslate && !looksMostlyChinese(item.title)) {
      try {
        titleZh = await translateTitleEnToZh(item.title, i === 0 ? 0 : 400);
      } catch (e) {
        console.warn("translate skip:", item.id, e?.message ?? e);
      }
    }
    const core = stripArxivMeta(item);
    enrichedNew.push(titleZh ? { ...core, titleZh } : { ...core });
    i += 1;
  }

  for (const item of enrichedNew) {
    byId.set(normalizeId(item.id), item);
  }

  const merged = sortByPublishedDesc([...byId.values()]);
  const countAfter = merged.length;

  const payload = {
    fetchedAt: new Date().toISOString(),
    query: API,
    source: "arXiv Atom API",
    mergePolicy:
      "append-only：仅追加通过机构/顶会启发式的新篇，按 arXiv id 去重；历史条目保留。新篇按标题/摘要/作者及 DOI 等文本匹配知名企业与院校关键词，非完整 affiliation，会有漏检与误判。",
    disclaimer:
      "本列表由程序自动抓取与合并，不保证与「生成式推荐」主题完全相关；筛选规则不能代替人工判断，请阅读原文并自行甄别。英文标题中文译名为机器翻译，仅供参考。",
    items: merged,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf8");

  console.log(
    `arXiv candidates: ${parsed.length}, skipped (filter): ${skippedFilter}, skipped (dup): ${skippedDup}, ` +
      `new added: ${enrichedNew.length}, total in file: ${countAfter} (was ${countBefore})` +
      (skipTranslate ? " (SKIP_TRANSLATE)" : ""),
  );
  console.log(`Wrote ${path.relative(root, outFile)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
