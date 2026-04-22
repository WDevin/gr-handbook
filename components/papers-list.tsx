"use client";

import { PaperCard } from "@/components/paper-card";
import type { ArxivPaperItem } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 20;

export function PapersList({ items }: { items: ArxivPaperItem[] }) {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length),
  );
  const shown = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const remaining = items.length - visibleCount;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount((prev) => Math.min(prev, items.length));
  }, [items.length]);

  const loadMore = useCallback(() => {
    setVisibleCount((n) => Math.min(n + PAGE_SIZE, items.length));
  }, [items.length]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || remaining <= 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [remaining, loadMore]);

  return (
    <div className="space-y-6">
      <ul className="space-y-6">
        {shown.map((item) => (
          <PaperCard key={item.id} item={item} />
        ))}
      </ul>
      {remaining > 0 ? (
        <>
          <div
            ref={sentinelRef}
            className="h-px w-full shrink-0"
            aria-hidden
          />
          <div className="flex flex-col items-center gap-2 pt-2">
            <p className="text-center text-xs text-[var(--text-muted)]">
              接近列表底部时将自动加载更多（还可手动加载）
            </p>
            <button
              type="button"
              onClick={loadMore}
              className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-sm transition hover:bg-[var(--accent-muted)]/40"
            >
              加载更多（还剩 {remaining} 篇）
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
