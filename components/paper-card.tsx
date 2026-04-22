import { getOrgTagsForPaper } from "@/lib/paper-org-tags";
import type { ArxivPaperItem } from "@/lib/types";
import { CalendarDays, ExternalLink } from "lucide-react";

export function summarize(text: string, max = 280) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/** 公布日期：中文本地化 + 拆成「年 / 月日」便于排版强调 */
export function formatPublishedZh(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return { line1: iso, line2: "" };
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return {
    line1: `${y}年`,
    line2: `${m}月${day}日`,
  };
}

export function PaperCard({ item }: { item: ArxivPaperItem }) {
  const { line1, line2 } = formatPublishedZh(item.published);
  const orgTags = getOrgTagsForPaper(item);

  return (
    <li className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-3 sm:items-start">
          <div
            className="flex min-w-[5.5rem] flex-col items-center justify-center rounded-[var(--radius-md)] border border-[var(--accent)]/25 bg-[var(--accent-muted)] px-3 py-2.5 text-center shadow-sm"
            title={`arXiv 公布日期：${item.published}`}
          >
            <span className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              <CalendarDays className="h-3 w-3" aria-hidden />
              公布
            </span>
            <time
              dateTime={item.published}
              className="text-[var(--text-primary)]"
            >
              <span className="block text-xs font-semibold leading-tight text-[var(--accent-hover)] sm:text-sm">
                {line1}
              </span>
              <span className="mt-0.5 block text-base font-bold leading-none tracking-tight sm:text-lg">
                {line2}
              </span>
            </time>
          </div>
          {orgTags.length > 0 ? (
            <ul className="flex w-full max-w-[12rem] flex-col gap-1.5 sm:max-w-[10.5rem]">
              {orgTags.map((label) => (
                <li key={label} className="w-full">
                  <span className="block w-full rounded-full border border-[var(--accent)]/20 bg-[var(--accent-muted)]/35 px-2.5 py-1 text-center text-[11px] font-medium leading-snug text-[var(--accent-hover)] sm:text-xs">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 pr-2">
              <h2 className="text-lg font-semibold leading-snug sm:text-xl">
                <a
                  href={item.linkAbs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-primary)] no-underline transition-colors hover:text-[var(--link)] hover:underline hover:decoration-2 hover:underline-offset-2"
                >
                  {item.title}
                </a>
              </h2>
              {item.titleZh ? (
                <p className="mt-2.5 border-l-[3px] border-[var(--accent)]/40 pl-3 text-base font-medium leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                  {item.titleZh}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={item.linkAbs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--link)] hover:bg-[var(--accent-muted)]/30"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                摘要页
              </a>
              <a
                href={item.linkPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--link)] hover:bg-[var(--accent-muted)]/30"
              >
                PDF
              </a>
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {item.authors.slice(0, 5).join(", ")}
            {item.authors.length > 5 ? " 等" : ""}
            {item.categories.length ? ` · ${item.categories.join(", ")}` : ""}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {summarize(item.summary)}
          </p>
        </div>
      </div>
    </li>
  );
}
