import { PageShell } from "@/components/page-shell";
import { SolutionCards } from "@/components/solution-cards";
import { loadSolutions } from "@/lib/load-content";

export default function SolutionsPage() {
  const { solutions } = loadSolutions();

  return (
    <PageShell
      title="经典技术方案"
      subtitle="覆盖学术界与工业界公开讨论较多的路线；指标以论文或公开材料为准，避免未证实数字。"
    >
      <SolutionCards solutions={solutions} />
    </PageShell>
  );
}
