import { PageShell } from "@/components/page-shell";
import { PapersList } from "@/components/papers-list";
import { PapersRefreshButton } from "@/components/papers-refresh-button";
import { loadPapersPayload } from "@/lib/load-content";

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
              <span className="font-medium text-[var(--text-primary)]">最近抓取时间：</span>
              {payload.fetchedAt}
            </p>
            <p className="mt-1">
              <span className="font-medium text-[var(--text-primary)]">当前收录：</span>
              共 {payload.items.length} 篇（列表按公布日期从新到旧；首屏 20 篇，下滑自动分批加载）
            </p>
            <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
              论文来自 arXiv 自动检索（生成式推荐、推荐系统与 LLM 等相关方向）；列表为增量合并、按 id
              去重，新稿会经简易机构/会议信号过滤。检索与筛选均有疏漏，中文题名为机翻辅助，请以原文为准并自行判断相关性。
            </p>
          </div>

          <PapersList key={payload.fetchedAt} items={payload.items} />
        </>
      )}
    </PageShell>
  );
}
