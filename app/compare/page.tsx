import { PageShell } from "@/components/page-shell";
import { CompareParallel, CompareRadar } from "@/components/compare-charts";
import { CompareTable } from "@/components/compare-table";
import { loadCompare } from "@/lib/load-content";

export default function ComparePage() {
  const data = loadCompare();

  return (
    <PageShell
      title="不同技术方案对比"
      subtitle="雷达与平行坐标使用同一份 YAML 数据；分值为示意性专家标注，用于讨论维度而非排名。"
    >
      <div className="space-y-10">
        <CompareRadar data={data} />
        <CompareParallel data={data} />
        <div>
          <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
            明细表
          </h2>
          <CompareTable data={data} />
        </div>
      </div>
    </PageShell>
  );
}
