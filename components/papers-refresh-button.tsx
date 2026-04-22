"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type ApiOk = { ok: true; stdout?: string; stderr?: string };
type ApiErr = { ok: false; error?: string; stderr?: string };

export function PapersRefreshButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/refresh-papers", { method: "POST" });
      const data = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok || !data.ok) {
        const err = data as ApiErr;
        setStatus("err");
        setMessage(err.error ?? err.stderr ?? `请求失败（${res.status}）`);
        return;
      }
      setStatus("ok");
      setMessage("已更新，正在刷新页面…");
      router.refresh();
      window.setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 2500);
    } catch (e) {
      setStatus("err");
      setMessage(e instanceof Error ? e.message : "网络错误");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={onClick}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--accent)]/40 bg-[var(--accent-muted)] px-4 py-2 text-sm font-medium text-[var(--accent-hover)] shadow-sm transition hover:bg-[var(--accent-muted)]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`}
          aria-hidden
        />
        {status === "loading" ? "正在抓取…" : "更新论文列表"}
      </button>
      {message ? (
        <p
          className={`max-w-xs text-right text-xs sm:max-w-sm ${
            status === "err" ? "text-red-600 dark:text-red-400" : "text-[var(--text-muted)]"
          }`}
          role={status === "err" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
