"use client";

import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import type { RoadmapNode } from "@/lib/types";

const colors = {
  milestone: "#0f766e",
  milestoneRing: "rgba(15, 118, 110, 0.25)",
  paper: "#1d4ed8",
  paperRing: "rgba(29, 78, 216, 0.22)",
  line: "rgba(15, 118, 110, 0.35)",
  labelBg: "rgba(255, 252, 247, 0.96)",
  labelBorder: "rgba(45, 55, 72, 0.14)",
  axis: "#64748b",
};

function yearValue(n: RoadmapNode) {
  return n.year + (n.month ?? 6) / 12;
}

function chartLabel(n: RoadmapNode) {
  return n.shortLabel ?? n.label;
}

/** 稳定小抖动，避免同年多点完全重叠 */
function idJitter(id: string): number {
  let s = 0;
  for (let i = 0; i < id.length; i++) {
    s = (s + id.charCodeAt(i) * (i + 3)) % 251;
  }
  return ((s % 11) - 5) / 5;
}

/**
 * 纵轴：示意「范式能力 / 工业可用性」随时间抬升，非真实评测指标。
 * 论文点随年份升高；里程碑在同年代略高于论文，形成阶梯上行感。
 */
function layoutY(
  sorted: RoadmapNode[],
  n: RoadmapNode,
): number {
  if (!sorted.length) return 50;
  const y0 = yearValue(sorted[0]);
  const y1 = yearValue(sorted[sorted.length - 1]);
  const span = Math.max(y1 - y0, 0.5);
  const t = (yearValue(n) - y0) / span;
  const runway = 22 + t * 58;
  const roleLift = n.type === "milestone" ? 14 : 0;
  const jitter = idJitter(n.id) * (n.type === "milestone" ? 2.2 : 3);
  return runway + roleLift + jitter;
}

type Props = {
  nodes: RoadmapNode[];
};

export function EvolutionRoadmap({ nodes }: Props) {
  const sorted = useMemo(
    () => [...nodes].sort((a, b) => yearValue(a) - yearValue(b)),
    [nodes],
  );

  const option = useMemo(() => {
    const milestoneData = sorted
      .filter((n) => n.type === "milestone")
      .map((n) => ({
        name: chartLabel(n),
        value: [yearValue(n), layoutY(sorted, n)],
        symbolSize: n.id === "mf" ? 28 : 24,
        node: n,
      }));

    const paperData = sorted
      .filter((n) => n.type === "paper")
      .map((n) => ({
        name: chartLabel(n),
        value: [yearValue(n), layoutY(sorted, n)],
        symbolSize: 20,
        node: n,
      }));

    const lineData = sorted.map((n) => [
      yearValue(n),
      layoutY(sorted, n),
    ]);

    const labelCommon = {
      show: true,
      fontSize: 12,
      color: "#1e293b",
      fontWeight: 500,
      backgroundColor: colors.labelBg,
      borderColor: colors.labelBorder,
      borderWidth: 1,
      borderRadius: 6,
      padding: [5, 8],
      shadowBlur: 6,
      shadowColor: "rgba(15, 23, 42, 0.06)",
    };

    return {
      animationDuration: 900,
      grid: { top: 56, bottom: 104, left: 72, right: 40 },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "none",
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          height: 22,
          bottom: 18,
          borderColor: "transparent",
          backgroundColor: "rgba(148, 163, 184, 0.15)",
          fillerColor: "rgba(15, 118, 110, 0.22)",
          handleStyle: { color: "#0f766e", borderColor: "#0f766e" },
          textStyle: { color: colors.axis, fontSize: 11 },
          moveHandleSize: 6,
        },
      ],
      tooltip: {
        trigger: "item",
        enterable: true,
        confine: true,
        backgroundColor: colors.labelBg,
        borderColor: colors.labelBorder,
        borderWidth: 1,
        textStyle: { color: "#1e293b", fontSize: 12 },
        extraCssText: "max-width:360px;white-space:normal;line-height:1.5;",
        formatter: (params: {
          data: { node?: RoadmapNode; name?: string };
        }) => {
          const n = params.data?.node;
          if (!n) return params.data?.name ?? "";
          const title = n.label;
          const lines = [
            `<div style="font-weight:700;margin-bottom:6px;font-size:13px">${title}</div>`,
            n.era
              ? `<div style="opacity:.88;margin-bottom:4px">阶段：<span style="font-weight:600">${n.era}</span></div>`
              : "",
            `<div style="margin:6px 0;font-size:11px;color:#64748b">纵轴为<strong>示意性迭代层级</strong>（随时间抬升），不代表真实离线指标数值。</div>`,
            n.description
              ? `<div style="margin-top:6px;color:#334155">${n.description}</div>`
              : "",
            n.paperTitle
              ? `<div style="margin-top:8px;font-size:11px;color:#475569">论文：${n.paperTitle}</div>`
              : "",
            n.paperUrl
              ? `<div style="margin-top:8px"><a href="${n.paperUrl}" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8">打开论文/页面 →</a></div>`
              : "",
          ];
          return lines.filter(Boolean).join("");
        },
      },
      xAxis: {
        type: "value",
        name: "年份",
        nameGap: 28,
        nameTextStyle: { color: colors.axis, fontSize: 12 },
        min: 2007.5,
        max: 2026.5,
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: "rgba(100,116,139,0.25)" },
        },
        axisLine: { lineStyle: { color: "rgba(100,116,139,0.35)" } },
        axisLabel: {
          color: colors.axis,
          formatter: (v: number) => Math.round(v).toString(),
        },
      },
      yAxis: {
        type: "value",
        name: "迭代层级（示意）",
        nameGap: 36,
        min: 12,
        max: 98,
        nameTextStyle: { color: colors.axis, fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { type: "dashed", color: "rgba(100,116,139,0.2)" },
        },
        axisLabel: {
          color: colors.axis,
          fontSize: 11,
          formatter: (v: number) => {
            if (v <= 30) return "早期";
            if (v <= 55) return "发展";
            if (v <= 75) return "加速";
            return "深化";
          },
        },
      },
      series: [
        {
          name: "演进脉络",
          type: "lines",
          coordinateSystem: "cartesian2d",
          polyline: true,
          data: [{ coords: lineData }],
          lineStyle: { color: colors.line, width: 2.5, cap: "round" },
          symbol: ["none", "none"],
          silent: true,
          z: 1,
        },
        {
          name: "里程碑",
          type: "scatter",
          data: milestoneData,
          itemStyle: {
            color: colors.milestone,
            borderColor: "#ffffff",
            borderWidth: 2,
            shadowBlur: 14,
            shadowColor: colors.milestoneRing,
          },
          label: {
            ...labelCommon,
            position: "top",
            distance: 12,
            formatter: (p: { data: { node: RoadmapNode } }) =>
              chartLabel(p.data.node),
          },
          labelLayout: { hideOverlap: true, moveOverlap: "shiftY" },
          emphasis: {
            scale: 1.12,
            itemStyle: { shadowBlur: 22 },
          },
          z: 3,
        },
        {
          name: "论文节点",
          type: "scatter",
          data: paperData,
          itemStyle: {
            color: colors.paper,
            borderColor: "#ffffff",
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: colors.paperRing,
          },
          label: {
            ...labelCommon,
            position: "top",
            distance: 10,
            formatter: (p: { data: { node: RoadmapNode } }) =>
              chartLabel(p.data.node),
          },
          labelLayout: { hideOverlap: true, moveOverlap: "shiftY" },
          emphasis: {
            scale: 1.1,
            itemStyle: { shadowBlur: 20 },
          },
          z: 3,
        },
      ],
    };
  }, [sorted]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            技术演进路线图
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">
            纵轴为<strong>示意性迭代层级</strong>：越靠上表示范式与工程成熟度随时间抬升；里程碑略高于同时期论文点，折线整体呈上行趋势。
            可拖动底部时间轴或触控板横向缩放，悬停查看全文与链接。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: colors.milestone }}
            />
            里程碑
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: colors.paper }}
            />
            论文节点
          </span>
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 640, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
