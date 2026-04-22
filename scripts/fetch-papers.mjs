/**
 * Fetches recent arXiv papers and writes public/data/papers-latest.json
 * Run: node scripts/fetch-papers.mjs
 * 可选：SKIP_TRANSLATE=1 跳过标题中译（避免外网或额度问题）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "data");
const outFile = path.join(outDir, "papers-latest.json");

const SEARCH =
  "search_query=all:recommendation+AND+all:generative&sortBy=submittedDate&sortOrder=descending&max_results=25";
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

function looksMostlyChinese(s) {
  const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk / Math.max(s.length, 1) > 0.35;
}

/**
 * MyMemory 免费接口；失败或额度用尽时返回 null
 */
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
  const shortId = id.split("/abs/").pop()?.replace(/v\d+$/, "") ?? id;
  const title = normSpace(entry.title);
  const published = normSpace(entry.published).slice(0, 10);
  const updated = normSpace(entry.updated).slice(0, 10);
  const summary = normSpace(entry.summary);
  const authors = asArray(entry.author).map((a) => normSpace(a.name));
  const categories = asArray(entry.category).map((c) => c["@_term"] ?? "").filter(Boolean);

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
  };
}

async function main() {
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
  const items = rawEntries.map(parseEntry);

  const skipTranslate = process.env.SKIP_TRANSLATE === "1";
  const enriched = [];
  let i = 0;
  for (const item of items) {
    let titleZh;
    if (!skipTranslate && !looksMostlyChinese(item.title)) {
      try {
        titleZh = await translateTitleEnToZh(item.title, i === 0 ? 0 : 400);
      } catch (e) {
        console.warn("translate skip:", item.id, e?.message ?? e);
      }
    }
    enriched.push(titleZh ? { ...item, titleZh } : { ...item });
    i += 1;
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    query: API,
    source: "arXiv Atom API",
    disclaimer:
      "本列表由程序自动抓取，不保证与「生成式推荐」主题完全相关；请阅读原文并自行甄别。英文标题中文译名为机器翻译，仅供参考。",
    items: enriched,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf8");
  console.log(
    `Wrote ${enriched.length} papers to ${path.relative(root, outFile)}` +
      (skipTranslate ? " (SKIP_TRANSLATE)" : ""),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
