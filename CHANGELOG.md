# Changelog

本文档记录 **gr-handbook（生成式推荐-手册）** 的版本变更。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.3.0] - 2026-04-22

### 变更

- **arXiv 拉取**（`scripts/fetch-papers.mjs`）：检索改为以 **推荐系统 / recsys** 为核心（`recommender` 与 `user`/`item` 同现、`recsys`、协同过滤、序列表征、或 LLM/生成式 与 recsys+user|item 同现），**生成式推荐**作为子类，避免临床指南/ RAG 等因词干与宽泛 OR 误命中；`max_results` 提至 80；对 429/502/503 增加退避重试。写入 JSON 的 `mergePolicy` / `disclaimer` 与上述策略一致。
- **机翻**：对历史条目中仍缺 `titleZh` 的英文题在写入前 **补译**（backfill），减少列表中英混排。
- **每日论文页**（`/papers`）：合并为一段可读的 arXiv 与合并策略说明，不再在页内展示整段 API URL 与重复 disclaimer。
- **布局**：`html` / `body` 增加 `suppressHydrationWarning`，抑制主题或扩展导致的 hydration 告警噪声。
- **数据**：`public/data/papers-latest.json` 在收紧检索后 **清空重抓**（经机构/会议启发式后当前收录条数以文件为准）。

## [1.0.0] - 2026-04-22

首个对外可用的稳定版本。

### 新增

- **站点与品牌**：项目标识 `gr-handbook`，中文名「生成式推荐-手册」；全站 `metadata`、顶栏与首页主标题统一展示。
- **首页**：能力入口卡片、与技术演进页一致的 **ECharts 演进路线图**（可缩放时间轴、示意性纵轴迭代层级、节点悬停摘要与论文链接）。
- **技术演进**（`/evolution`）：路线图 + Markdown 长文（阶段划分、范式梳理、与调研材料对照说明）。
- **经典方案**（`/solutions`）：由 `content/solutions.yaml` 驱动的方案卡片（论文链接、场景、细节、指标说明）；覆盖 TIGER、HSTU、OneRec、RankMixer、OneTrans、融合式与 LLM 侧路等工业向条目。
- **方案对比**（`/compare`）：
  - 多方案 **雷达图**；
  - **平行坐标**（每方案独立系列，图例可点选显隐）；
  - **图例快捷**：「全部选中 / 全部隐藏」（基于 `onChartReady` 与 `setOption(legend.selected)`）；
  - **明细表**：可排序表头；维度分值以 **彩色横条**（15px 高）展示，长度随分值变化，**悬停图柱**显示分数与维度说明。
- **趋势展望**（`/trends`）：Markdown + 示意柱状图。
- **每日论文**（`/papers`）：`fetch-papers` 拉取 arXiv；**公布日期**徽章强调；英文标题下可选 **机翻中文标题**；摘要节选。
- **术语表**（`/glossary`）：核心概念速查。
- **自动化**：`npm run fetch-papers`；GitHub Actions 定时更新 `papers-latest.json`（可选）。
- **设计与工程**：Noto Sans SC、主题 CSS 变量、响应式顶栏与移动端菜单、页脚免责声明。

### 说明

- 分值与纵轴层级均为 **示意性** 表达，便于对比讨论，非严格复现某篇论文的绝对指标。
- 论文机翻依赖第三方免费接口，仅供参考。
