import { PageShell } from "@/components/page-shell";
import { ArticleMarkdown } from "@/components/article-markdown";
import { loadMarkdown } from "@/lib/load-content";

export default function GlossaryPage() {
  const md = loadMarkdown("glossary.md");

  return (
    <PageShell title="术语表" subtitle="跨页面出现的核心概念速查。">
      <ArticleMarkdown content={md} />
    </PageShell>
  );
}
