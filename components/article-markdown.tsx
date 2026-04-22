import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

export function ArticleMarkdown({ content, className = "" }: Props) {
  return (
    <div className={`article-md max-w-[72ch] ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
