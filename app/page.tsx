import Link from "next/link";
import {
  BookOpen,
  GitBranch,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { EvolutionRoadmap } from "@/components/evolution-roadmap";
import { roadmapNodes } from "@/lib/roadmap-data";

const cards = [
  {
    href: "/evolution",
    title: "技术演进",
    desc: "从协同过滤到生成式检索与 LLM 重排的时间线。",
    icon: GitBranch,
  },
  {
    href: "/solutions",
    title: "经典方案",
    desc: "代表工作与论文链接、场景与公开指标摘要。",
    icon: BookOpen,
  },
  {
    href: "/compare",
    title: "方案对比",
    desc: "雷达图、平行坐标与可排序表格。",
    icon: Scale,
  },
  {
    href: "/trends",
    title: "趋势展望",
    desc: "当下共识、风险与团队组织层面的启示。",
    icon: TrendingUp,
  },
  {
    href: "/papers",
    title: "每日论文",
    desc: "arXiv 抓取与摘要节选（自动更新）。",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="w-full border-b border-[var(--border-subtle)] pb-12 text-left sm:pb-14">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          gr-handbook · Generative Recommendation
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
          生成式推荐-手册
        </h1>
        <p className="mt-2 font-mono text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
          gr-handbook
        </p>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          以多页面教程形式梳理技术演进、经典方案与对比视图，并提供论文聚合与扩展阅读。
          适合算法与工程团队快速建立共同语境。
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            <Icon className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16 w-full">
        <EvolutionRoadmap nodes={roadmapNodes} />
        <p className="mt-5 text-sm text-[var(--text-muted)]">
          <Link
            href="/evolution"
            className="font-medium text-[var(--link)] underline decoration-[var(--border-subtle)] underline-offset-4 hover:text-[var(--link-hover)]"
          >
            打开技术演进页，阅读阶段划分与范式说明
          </Link>
        </p>
      </section>
    </div>
  );
}
