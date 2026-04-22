"use client";

import ReactECharts from "echarts-for-react";
import type { ECharts } from "echarts";
import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import type { CompareFile } from "@/lib/types";

type Props = {
  data: CompareFile;
};

const palette = [
  "#2c7a7b",
  "#3182ce",
  "#805ad5",
  "#dd6b20",
  "#d53f8c",
  "#38a169",
  "#0d9488",
  "#64748b",
  "#ca8a04",
  "#dc2626",
];

const btnClass =
  "rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/45 hover:bg-[var(--accent-muted)]/25 hover:text-[var(--text-primary)]";

function LegendBulkButtons({
  legendNames,
  instanceRef,
}: {
  legendNames: string[];
  instanceRef: RefObject<ECharts | null>;
}) {
  const setAll = useCallback(
    (selected: boolean) => {
      const chart = instanceRef.current;
      if (!chart) return;
      const selectedMap: Record<string, boolean> = {};
      for (const name of legendNames) {
        selectedMap[name] = selected;
      }
      chart.setOption({ legend: { selected: selectedMap } });
    },
    [instanceRef, legendNames],
  );

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="text-xs text-[var(--text-muted)]">图例快捷</span>
      <button type="button" className={btnClass} onClick={() => setAll(true)}>
        全部选中
      </button>
      <button type="button" className={btnClass} onClick={() => setAll(false)}>
        全部隐藏
      </button>
    </div>
  );
}

export function CompareRadar({ data }: Props) {
  const echartsRef = useRef<ECharts | null>(null);
  const legendNames = useMemo(
    () => data.rows.map((r) => r.shortLabel ?? r.name),
    [data.rows],
  );

  useEffect(() => {
    return () => {
      echartsRef.current = null;
    };
  }, []);

  const option = useMemo(() => {
    const indicators = data.axes.map((a) => ({
      name: a.label,
      max: a.max,
    }));

    const radarData = data.rows.map((row, i) => ({
      value: data.axes.map((ax) => row.values[ax.id] ?? 0),
      name: row.shortLabel ?? row.name,
      lineStyle: { width: 2, color: palette[i % palette.length] },
      itemStyle: { color: palette[i % palette.length] },
      areaStyle: {
        opacity: 0.07,
        color: palette[i % palette.length],
      },
    }));

    return {
      color: palette,
      tooltip: {
        trigger: "item",
      },
      legend: {
        type: "scroll",
        bottom: 0,
        data: legendNames,
      },
      radar: {
        indicator: indicators,
        radius: "62%",
        splitNumber: 5,
        axisName: {
          color: "#4a5568",
        },
      },
      series: [
        {
          type: "radar",
          symbol: "circle",
          data: radarData,
        },
      ],
    };
  }, [data, legendNames]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-soft)]">
      <h2 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
        多方案雷达对比
      </h2>
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        分值为 1–5 的示意性标注，突出相对优劣势而非绝对精度。可用下方按钮一键全选/隐藏图例。
      </p>
      <LegendBulkButtons legendNames={legendNames} instanceRef={echartsRef} />
      <ReactECharts
        option={option}
        style={{ height: 440, width: "100%" }}
        onChartReady={(instance) => {
          echartsRef.current = instance;
        }}
      />
    </div>
  );
}

export function CompareParallel({ data }: Props) {
  const echartsRef = useRef<ECharts | null>(null);
  const legendNames = useMemo(
    () => data.rows.map((r) => r.shortLabel ?? r.name),
    [data.rows],
  );

  useEffect(() => {
    return () => {
      echartsRef.current = null;
    };
  }, []);

  const option = useMemo(() => {
    const parallelAxis = data.axes.map((a, idx) => ({
      dim: idx,
      name: a.label,
      max: a.max,
      min: 0,
      nameTextStyle: { fontSize: 11, color: "#4a5568" },
    }));

    const series = data.rows.map((row, i) => {
      const color = palette[i % palette.length];
      const line = data.axes.map((ax) => row.values[ax.id] ?? 0);
      return {
        type: "parallel" as const,
        name: legendNames[i],
        smooth: true,
        lineStyle: {
          width: 2.5,
          color,
          opacity: 0.92,
        },
        emphasis: {
          lineStyle: { width: 4, opacity: 1, shadowBlur: 6 },
        },
        data: [line],
      };
    });

    return {
      color: palette,
      tooltip: { trigger: "item" },
      legend: {
        type: "scroll",
        bottom: 0,
        data: legendNames,
        selectedMode: true,
        itemGap: 12,
        textStyle: { fontSize: 12, color: "#4a5568" },
      },
      parallelAxis,
      series,
    };
  }, [data, legendNames]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-soft)]">
      <h2 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
        平行坐标视图
      </h2>
      <p className="mb-3 text-sm text-[var(--text-muted)]">
        每个方案一条折线，颜色与雷达图一致；点击底部图例可显隐对应模型。可用下方按钮一键全选/隐藏。
      </p>
      <LegendBulkButtons legendNames={legendNames} instanceRef={echartsRef} />
      <ReactECharts
        option={option}
        style={{ height: 380, width: "100%" }}
        onChartReady={(instance) => {
          echartsRef.current = instance;
        }}
      />
    </div>
  );
}
