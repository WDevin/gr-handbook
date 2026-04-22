"use client";

import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

/** 定性趋势示意：非真实业务数据 */
export function TrendsBarChart() {
  const option = useMemo(
    () => ({
      grid: { top: 32, bottom: 40, left: 48, right: 24 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["判别式精排", "序列编码器", "语义ID生成检索", "LLM侧路重排", "多模态统一索引"],
        axisLabel: { interval: 0, rotate: 22, fontSize: 11, color: "#4a5568" },
      },
      yAxis: {
        type: "value",
        name: "关注度（示意）",
        max: 100,
        axisLabel: { color: "#718096" },
        splitLine: { lineStyle: { type: "dashed", opacity: 0.35 } },
      },
      series: [
        {
          type: "bar",
          data: [92, 88, 72, 68, 76],
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#2c7a7b" },
                { offset: 1, color: "#3182ce" },
              ],
            },
          },
          barWidth: "55%",
        },
      ],
    }),
    [],
  );

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-soft)]">
      <h2 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
        社区与文献关注度（示意）
      </h2>
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        仅用于版面示例，不构成市场调研结论。
      </p>
      <ReactECharts option={option} style={{ height: 320, width: "100%" }} />
    </div>
  );
}
