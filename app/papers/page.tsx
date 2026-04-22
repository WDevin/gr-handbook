import { PageShell } from "@/components/page-shell";
import { PapersRefreshButton } from "@/components/papers-refresh-button";
import { loadPapersPayload } from "@/lib/load-content";
import type { ArxivPaperItem } from "@/lib/types";
import { CalendarDays, ExternalLink } from "lucide-react";

function summarize(text: string, max = 280) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/** 公布日期：中文本地化 + 拆成「年 / 月日」便于排版强调 */
function formatPublishedZh(iso: string) {
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

function PaperCard({ item }: { item: ArxivPaperItem }) {
  const { line1, line2 } = formatPublishedZh(item.published);

  return (
    <li className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-wrap items-start gap-4 sm:flex-nowrap">
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
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 pr-2">
              <h2 className="text-lg font-semibold leading-snug text-[var(--text-primary)] sm:text-xl">
                {item.title}
              </h2>
              {item.titleZh ? (
                <p className="mt-2 border-l-2 border-[var(--border-subtle)] pl-3 text-sm font-normal leading-relaxed text-[var(--text-muted)]">
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

export default function PapersPage() {
  const payload = loadPapersPayload();

  return (
    <PageShell
      title="每日论文与摘要"
      subtitle="数据由脚本调用 arXiv API 生成；摘要为官方 abstract 节选。英文题名下方中文为机翻辅助阅读，请以原文标题为准。"
      headerActions={<PapersRefreshButton />}
    >
      {!payload ? (
        <p className="text-[var(--text-secondary)]">
          未找到 <code className="font-mono text-sm">public/data/papers-latest.json</code>
          。请在项目根目录执行{" "}
          <code className="font-mono text-sm">npm run fetch-papers</code>
          （将尝试机翻标题；外网不可用时可设{" "}
          <code className="font-mono text-sm">SKIP_TRANSLATE=1</code>）后刷新。
        </p>
      ) : (
        <>
          <div className="mb-8 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium text-[var(--text-primary)]">抓取时间：</span>
              {payload.fetchedAt}
            </p>
            <p className="mt-1">
              <span className="font-medium text-[var(--text-primary)]">查询：</span>
              <code className="font-mono text-xs text-[var(--text-muted)]">{payload.query}</code>
            </p>
            <p className="mt-2 text-[var(--text-muted)]">{payload.disclaimer}</p>
          </div>

          <ul className="space-y-6">
            {payload.items.map((item) => (
              <PaperCard key={item.id} item={item} />
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
