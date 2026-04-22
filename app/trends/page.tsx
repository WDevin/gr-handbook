import { PageShell } from "@/components/page-shell";
import { ArticleMarkdown } from "@/components/article-markdown";
import { TrendsBarChart } from "@/components/trends-chart";
import { loadMarkdown } from "@/lib/load-content";

export default function TrendsPage() {
  const md = loadMarkdown("trends.md");

  return (
    <PageShell
      title="技术趋势与未来方向"
      subtitle="定性判断为主；示意图仅用于表达相对关注度，非市场调研数据。"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ArticleMarkdown content={md} />
        <TrendsBarChart />
      </div>
    </PageShell>
  );
}
