import type { Solution } from "@/lib/types";
import { ExternalLink } from "lucide-react";

export function SolutionCards({ solutions }: { solutions: Solution[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {solutions.map((s) => (
        <article
          key={s.id}
          className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {s.name}
              </h2>
              {s.nameEn ? (
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">{s.nameEn}</p>
              ) : null}
            </div>
            <span className="rounded-full bg-[var(--accent-muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
              {s.org}
            </span>
          </div>

          {s.tags?.length ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mb-3">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              论文与资料
            </h3>
            <ul className="space-y-1.5">
              {s.papers.map((p) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-1 text-sm text-[var(--link)] hover:text-[var(--link-hover)]"
                  >
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                    <span>
                      {p.title}
                      {p.year ? (
                        <span className="text-[var(--text-muted)]">（{p.year}）</span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              适用场景
            </h3>
            <ul className="list-inside list-disc text-sm leading-relaxed text-[var(--text-secondary)]">
              {s.scenarios.map((sc) => (
                <li key={sc}>{sc}</li>
              ))}
            </ul>
          </div>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
            {s.details.trim()}
          </p>

          {s.metrics?.items?.length ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                指标与来源
                {s.metrics.source ? (
                  <span className="ml-2 font-normal normal-case text-[var(--text-muted)]">
                    · {s.metrics.source}
                  </span>
                ) : null}
              </h3>
              <dl className="space-y-2 text-sm">
                {s.metrics.items.map((m) => (
                  <div key={m.name}>
                    <dt className="font-medium text-[var(--text-primary)]">{m.name}</dt>
                    <dd className="text-[var(--text-secondary)]">
                      {m.value}
                      {m.context ? (
                        <span className="text-[var(--text-muted)]"> — {m.context}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
