type Props = {
  title: string;
  subtitle?: string;
  /** 标题区域右侧操作（例如「每日论文」页的更新按钮） */
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({ title, subtitle, headerActions, children }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-lg leading-relaxed text-[var(--text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:pt-1">
            {headerActions}
          </div>
        ) : null}
      </header>
      {children}
    </div>
  );
}
