"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GrLogo } from "@/components/gr-logo";

const nav = [
  { href: "/", label: "首页" },
  { href: "/evolution", label: "技术演进" },
  { href: "/solutions", label: "经典方案" },
  { href: "/compare", label: "方案对比" },
  { href: "/trends", label: "趋势展望" },
  { href: "/papers", label: "每日论文" },
  { href: "/glossary", label: "术语表" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 pl-0.5 pr-3 transition-colors hover:bg-[var(--accent-muted)]/35 md:flex-none md:pr-2"
          aria-label="生成式推荐-手册，返回首页"
        >
          <GrLogo
            size={36}
            className="shadow-[0_2px_8px_rgba(15,118,110,0.25)] transition-transform duration-200 group-hover:scale-[1.04]"
          />
          <span className="flex min-w-0 flex-col gap-0.5 leading-none">
            <span className="truncate text-[0.9375rem] font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)]">
              生成式推荐-手册
            </span>
            <span className="truncate font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
              gr-handbook
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--accent-muted)]/50 hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-[var(--text-secondary)] md:hidden"
          aria-expanded={open}
          aria-label="菜单"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-muted)]/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
