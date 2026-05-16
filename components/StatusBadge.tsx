"use client";

import type { RunnerStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useT } from "./LocaleContext";

type Tone = {
  tKey: string;
  /* Color token name from globals.css */
  color: string;
  dot: boolean;
  animateDot: boolean;
};

const tones: Record<RunnerStatus, Tone> = {
  running:    { tKey: "status.running",  color: "var(--running)", dot: true, animateDot: true },
  finished:   { tKey: "status.finished", color: "var(--finish)",  dot: true, animateDot: false },
  dnf:        { tKey: "status.dnf",      color: "var(--danger)",  dot: true, animateDot: false },
  "pre-race": { tKey: "status.preRace",  color: "var(--fg3)",     dot: true, animateDot: false },
};

export function StatusBadge({
  status,
  className,
}: {
  status: RunnerStatus;
  className?: string;
}) {
  const { t } = useT();
  const c = tones[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.08em]",
        className,
      )}
      style={{
        color: c.color,
        background: `color-mix(in oklch, ${c.color}, transparent 85%)`,
        borderColor: `color-mix(in oklch, ${c.color}, transparent 65%)`,
      }}
    >
      {c.dot && (
        <span
          aria-hidden
          className={cn(
            "inline-block h-[5px] w-[5px] rounded-full",
            c.animateDot && "rt-blink",
          )}
          style={{ background: c.color }}
        />
      )}
      {t(c.tKey)}
    </span>
  );
}
