import { PageShell } from "@/components/page-shell";
import { ArticleMarkdown } from "@/components/article-markdown";
import { EvolutionRoadmap } from "@/components/evolution-roadmap";
import { loadMarkdown } from "@/lib/load-content";
import { roadmapNodes } from "@/lib/roadmap-data";

export default function EvolutionPage() {
  const md = loadMarkdown("evolution.md");

  return (
    <PageShell
      title="技术发展与演进路线"
      subtitle="下图覆盖从判别式级联到语义 ID 生成式检索、再到大规模排序骨干与端到端落地的关键节点；正文补充阶段划分、范式梳理与工业引用。"
    >
      <div className="mb-12 w-full">
        <EvolutionRoadmap nodes={roadmapNodes} />
      </div>
      <ArticleMarkdown content={md} className="max-w-none" />
    </PageShell>
  );
}
