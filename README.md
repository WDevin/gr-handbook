# 生成式推荐-手册（gr-handbook）

基于 Next.js（App Router）、Tailwind CSS 与 ECharts 的在线手册站点：技术演进、经典方案、多维对比、趋势展望、每日论文与术语表。

- **项目名**：`gr-handbook`
- **中文名**：生成式推荐-手册
- **当前版本**：1.0.0（见 [CHANGELOG.md](./CHANGELOG.md)）

## 本地开发

```bash
npm install
npm run fetch-papers   # 生成 public/data/papers-latest.json（需网络）
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 构建

```bash
npm run build
npm start
```

## 内容维护

- 叙事与章节：`content/*.md`（Markdown）
- 方案卡片：`content/solutions.yaml`
- 对比维度与分值：`content/compare.yaml`
- 演进路线节点（图表数据）：`lib/roadmap-data.ts`

## 论文抓取

- 脚本：`scripts/fetch-papers.mjs`，默认检索 `recommendation` 与 `generative` 关键词交集，可按需修改 `SEARCH` 常量。
- 标题中文：默认通过 MyMemory 免费接口机翻英文题目写入 `titleZh`；额度或网络失败时该项省略。可设 `SKIP_TRANSLATE=1` 跳过翻译。
- 定时更新：见 `.github/workflows/update-papers.yml`（需仓库开启 GitHub Actions 写权限）。

## 免责声明

本站内容为公开资料整理，论文列表为自动抓取，不代表任何公司官方观点。
