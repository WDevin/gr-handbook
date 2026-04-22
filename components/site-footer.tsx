export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-center text-sm leading-relaxed text-[var(--text-muted)]">
          本站内容为公开资料整理与技术讨论，不代表任何公司官方观点。
          <br />
          论文列表由程序抓取，仅供参考，请结合原文甄别。
        </p>
      </div>
    </footer>
  );
}
