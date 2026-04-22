type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function PageShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-lg leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
