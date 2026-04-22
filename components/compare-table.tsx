"use client";

import { useMemo, useState } from "react";
import type { CompareAxis, CompareFile } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  data: CompareFile;
};

type SortKey = "name" | string;
type Dir = "asc" | "desc";

/** 与雷达/平行坐标协调的维度配色 */
const axisBarColors = [
  "#2c7a7b",
  "#3182ce",
  "#805ad5",
  "#dd6b20",
  "#d53f8c",
  "#38a169",
  "#0d9488",
  "#64748b",
];

function ScoreBarCell({
  value,
  axis,
  color,
}: {
  value: number;
  axis: CompareAxis;
  color: string;
}) {
  const max = Math.max(axis.max, 1);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const tip = `${axis.label}：${value} / ${axis.max}${axis.description ? ` · ${axis.description}` : ""}`;

  return (
    <div className="min-w-[6.5rem] max-w-[11rem]">
      <span className="sr-only">
        {axis.label} {value} 分，满分 {axis.max}
      </span>
      <div
        className="h-[15px] min-w-0 overflow-hidden rounded-full bg-[var(--border-subtle)]/45"
        title={tip}
      >
        <div
          className="h-full min-w-0 rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22)`,
          }}
          title={tip}
        />
      </div>
    </div>
  );
}

export function CompareTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [dir, setDir] = useState<Dir>("asc");

  const columns = useMemo(
    () => [{ id: "name", label: "方案" }, ...data.axes.map((a) => ({ id: a.id, label: a.label }))],
    [data.axes],
  );

  const axisColorById = useMemo(() => {
    const map: Record<string, string> = {};
    data.axes.forEach((ax, i) => {
      map[ax.id] = axisBarColors[i % axisBarColors.length];
    });
    return map;
  }, [data.axes]);

  const sortedRows = useMemo(() => {
    const rows = [...data.rows];
    rows.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "name") {
        av = a.name;
        bv = b.name;
      } else {
        av = a.values[sortKey] ?? 0;
        bv = b.values[sortKey] ?? 0;
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [data.rows, sortKey, dir]);

  function toggle(col: SortKey) {
    if (sortKey === col) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(col);
      setDir(col === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--accent-muted)]/40 text-[var(--text-secondary)]">
          <tr>
            {columns.map((c) => (
              <th key={c.id} className="px-4 py-3 font-medium align-bottom">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-[var(--accent)]"
                  onClick={() => toggle(c.id)}
                >
                  {c.label}
                  {sortKey === c.id ? (
                    dir === "asc" ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )
                  ) : null}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-medium align-bottom">备注</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-[var(--border-subtle)] hover:bg-[var(--accent-muted)]/15"
            >
              <td className="px-4 py-3 align-middle font-medium text-[var(--text-primary)]">
                {row.name}
              </td>
              {data.axes.map((ax) => {
                const raw = row.values[ax.id];
                const color = axisColorById[ax.id] ?? axisBarColors[0];
                return (
                  <td key={ax.id} className="px-4 py-3 align-middle">
                    {raw == null ? (
                      <span className="text-[var(--text-muted)]">—</span>
                    ) : (
                      <ScoreBarCell value={raw} axis={ax} color={color} />
                    )}
                  </td>
                );
              })}
              <td className="max-w-[14rem] px-4 py-3 align-middle text-[var(--text-muted)]">
                {row.notes ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-[var(--border-subtle)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
        色条长度 = 得分占该列满分的比例；鼠标悬停图柱可查看分值与维度说明。
      </p>
    </div>
  );
}
