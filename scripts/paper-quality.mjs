/**
 * 基于 lib/paper-org-signals.json 的机构 / 顶会信号匹配（与站点展示标签同源）。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const signals = JSON.parse(
  fs.readFileSync(path.join(root, "lib", "paper-org-signals.json"), "utf8"),
);

const wordRes = signals.words.map((w) => ({
  re: new RegExp(w.r, "i"),
  l: w.l,
}));

function buildBlob(entry) {
  return [
    entry.title,
    entry.summary,
    ...(entry.authors ?? []),
    entry.arxivComment ?? "",
    entry.arxivDoi ?? "",
    entry.arxivJournalRef ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function collectOrgTags(entry) {
  const blob = buildBlob(entry);
  const padded = ` ${blob} `;
  const tags = new Set();
  for (const { m, l } of signals.phrases) {
    if (padded.includes(m)) tags.add(l);
  }
  for (const { re, l } of wordRes) {
    if (re.test(blob)) tags.add(l);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

export function matchesAffiliationHeuristic(entry) {
  const blob = buildBlob(entry);
  const padded = ` ${blob} `;
  for (const { m } of signals.phrases) {
    if (padded.includes(m)) return true;
  }
  for (const { re } of wordRes) {
    if (re.test(blob)) return true;
  }
  return false;
}
