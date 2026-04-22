import type { ArxivPaperItem } from "@/lib/types";
import signals from "@/lib/paper-org-signals.json";

type SignalFile = {
  phrases: { m: string; l: string }[];
  words: { r: string; l: string }[];
};

const { phrases, words } = signals as SignalFile;

const wordRes = words.map((w) => ({
  re: new RegExp(w.r, "i"),
  l: w.l,
}));

function buildBlobParts(item: {
  title: string;
  summary: string;
  authors: string[];
  arxivComment?: string;
  arxivDoi?: string;
  arxivJournalRef?: string;
}) {
  return [
    item.title,
    item.summary,
    ...item.authors,
    item.arxivComment ?? "",
    item.arxivDoi ?? "",
    item.arxivJournalRef ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** 与抓取脚本相同的文本范围；用于展示「可能来源」标签（启发式，非官方 affiliation） */
export function getOrgTagsForPaper(item: ArxivPaperItem): string[] {
  const blob = buildBlobParts(item);
  const padded = ` ${blob} `;
  const tags = new Set<string>();

  for (const { m, l } of phrases) {
    if (padded.includes(m)) tags.add(l);
  }
  for (const { re, l } of wordRes) {
    if (re.test(blob)) tags.add(l);
  }

  return [...tags].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}
