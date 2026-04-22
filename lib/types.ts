export type PaperRef = {
  title: string;
  titleEn?: string;
  url: string;
  year?: number;
};

export type MetricEntry = {
  name: string;
  value: string;
  context?: string;
};

export type Solution = {
  id: string;
  name: string;
  nameEn?: string;
  org: string;
  orgType?: string;
  papers: PaperRef[];
  scenarios: string[];
  details: string;
  metrics?: {
    source?: string;
    items: MetricEntry[];
  };
  tags?: string[];
};

export type SolutionsFile = {
  solutions: Solution[];
};

export type CompareAxis = {
  id: string;
  label: string;
  max: number;
  description?: string;
};

export type CompareRow = {
  id: string;
  name: string;
  shortLabel?: string;
  values: Record<string, number>;
  notes?: string;
};

export type CompareFile = {
  axes: CompareAxis[];
  rows: CompareRow[];
};

export type ArxivPaperItem = {
  id: string;
  title: string;
  /** 脚本机翻标题（可选），仅供参考 */
  titleZh?: string;
  authors: string[];
  published: string;
  updated: string;
  summary: string;
  linkAbs: string;
  linkPdf: string;
  categories: string[];
};

export type PapersPayload = {
  fetchedAt: string;
  query: string;
  source: string;
  disclaimer: string;
  items: ArxivPaperItem[];
};

export type RoadmapNode = {
  id: string;
  year: number;
  month?: number;
  label: string;
  /** 图上短标签，避免文字重叠；缺省用 label */
  shortLabel?: string;
  type: "milestone" | "paper";
  description?: string;
  paperUrl?: string;
  paperTitle?: string;
  era?: string;
};
