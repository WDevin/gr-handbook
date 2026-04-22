# 生成式推荐-手册（gr-handbook）

<p align="center">
  <img src="https://raw.githubusercontent.com/WDevin/gr-handbook/main/docs/assets/gr-handbook-logo.svg" alt="gr-handbook（生成式推荐-手册）" width="440" height="72">
</p>

<p align="center">
  <strong>多页面在线手册</strong> · 技术演进 · 方案对比 · 论文聚合
</p>

<p align="center">
  <a href="https://github.com/WDevin/gr-handbook/blob/main/package.json"><img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://echarts.apache.org/"><img src="https://img.shields.io/badge/Apache%20ECharts-6-AA3440?style=for-the-badge" alt="Apache ECharts"></a>
</p>

<p align="center">
  <a href="https://github.com/WDevin/gr-handbook/actions/workflows/update-papers.yml"><img src="https://github.com/WDevin/gr-handbook/actions/workflows/update-papers.yml/badge.svg" alt="Update arXiv papers"></a>
  <a href="https://github.com/WDevin/gr-handbook"><img src="https://img.shields.io/github/stars/WDevin/gr-handbook?style=flat-square&logo=github&label=Stars" alt="GitHub stars"></a>
</p>

**gr-handbook（生成式推荐-手册）** 是一个用 [Next.js](https://nextjs.org/)（App Router）搭建的静态内容站点，面向算法与工程团队：用时间线、图表和可维护的 YAML/Markdown 把「生成式推荐」相关脉络讲清楚，并附带 arXiv 论文列表的抓取与展示。

---

## 目录

- [能做什么](#能做什么)
- [页面与路由](#页面与路由)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [内容怎么改](#内容怎么改)
- [每日论文流水线](#每日论文流水线)
- [技术栈](#技术栈)
- [版本与变更](#版本与变更)
- [免责声明](#免责声明)

---

## 能做什么

| | |
| :--- | :--- |
| 📈 **技术演进** | 可缩放路线图（ECharts），纵轴示意范式随时间抬升，节点来自可编辑数据。 |
| 📚 **经典方案** | 从 YAML 生成方案卡片与叙事 Markdown，便于扩展新工作。 |
| ⚖️ **方案对比** | 雷达图、平行坐标与可排序明细表，支持图例批量开/关。 |
| 🔭 **趋势展望** | 结构化长文 + 图表辅助阅读。 |
| 📄 **每日论文** | 脚本拉取 arXiv，可选标题机翻；GitHub Actions 可定时写回仓库。 |
| 📖 **术语表** | 统一词汇与扩展阅读入口。 |

适合作为团队内部 **handbook** 或对外 **知识库** 的起点；部署方式与寻常 Next.js 站点相同（如 Vercel、自有 Node、静态导出等，按你的基础设施选择）。

---

## 页面与路由

| 路由 | 说明 |
| :--- | :--- |
| `/` | 首页：导航入口、演进图预览与站内引导 |
| `/evolution` | 技术演进全文与路线图 |
| `/solutions` | 经典方案 |
| `/compare` | 多维对比图表与表格 |
| `/trends` | 趋势展望 |
| `/papers` | 每日论文列表（数据见 `public/data/papers-latest.json`） |
| `/glossary` | 术语表 |

---

## 快速开始

**环境**：建议使用 **Node.js 20+**（CI 中论文脚本使用 Node 22）。

```bash
git clone https://github.com/WDevin/gr-handbook.git
cd gr-handbook
npm install
```

拉取论文数据（需网络；首次可跳过，页面会依赖已有 JSON 或空状态）：

```bash
npm run fetch-papers
```

启动开发服务：

```bash
npm run dev
```

浏览器打开 **<http://localhost:3000>**（若端口占用，Next 会提示改用其他端口）。

---

## 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `npm run dev` | 本地开发（热更新） |
| `npm run build` | 生产构建 |
| `npm start` | 启动生产服务器（需先 `build`） |
| `npm run lint` | ESLint |
| `npm run fetch-papers` | 抓取 arXiv 并写入 `public/data/papers-latest.json` |

---

## 内容怎么改

| 类型 | 位置 |
| :--- | :--- |
| 叙事章节 | `content/*.md`（Markdown） |
| 方案列表与元数据 | `content/solutions.yaml` |
| 对比维度与分值 | `content/compare.yaml` |
| 演进图节点数据 | `lib/roadmap-data.ts` |

修改后保存即可在 `npm run dev` 下立即预览；上线前执行 `npm run build` 做完整校验。

---

## 每日论文流水线

- **脚本**：`scripts/fetch-papers.mjs` — 检索逻辑（如关键词）可在文件内调整 `SEARCH` 等常量。
- **标题中文**：默认通过 MyMemory 接口机翻英文题目为 `titleZh`；失败或额度不足时字段可省略。本地可设 `SKIP_TRANSLATE=1` 跳过翻译。
- **自动化**：`.github/workflows/update-papers.yml` — 定时 `workflow_dispatch` + cron；需在仓库设置中允许 Actions 写入内容以提交 JSON 更新。

---

## 技术栈

- **框架**：Next.js 16（App Router）、React 19、TypeScript
- **样式**：Tailwind CSS v4
- **图表**：Apache ECharts、`echarts-for-react`
- **内容**：`react-markdown`、YAML
- **抓取**：`fast-xml-parser`（arXiv API）

---

## 版本与变更

- **当前版本**：`1.0.0`（`package.json`）
- **变更日志**：[CHANGELOG.md](./CHANGELOG.md)

---

## 免责声明

本站内容为公开资料整理；论文列表由脚本自动抓取，**不代表任何机构或公司的官方观点**。引用请以原始论文与官方发布为准。

---

<p align="center">
  <sub>仓库：<a href="https://github.com/WDevin/gr-handbook">github.com/WDevin/gr-handbook</a></sub>
</p>
