"use client";

import { Play, Pause, Rewind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";
import { race } from "@/lib/mock-data";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

function timeOfDay(elapsedSeconds: number): string {
  const [hh, mm] = race.startedAt.split(":").map((s) => parseInt(s, 10));
  const startSec = hh * 3600 + mm * 60;
  const totalSec = startSec + elapsedSeconds;
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const speeds = [10, 30, 60, 120, 300];

export function ReplayTimeline() {
  const {
    raceTime,
    setRaceTime,
    playing,
    togglePlay,
    goLive,
    isLive,
    maxTime,
    speed,
    setSpeed,
  } = useReplay();
  const { t } = useT();

  const cycleSpeed = () => {
    const i = speeds.indexOf(speed);
    setSpeed(speeds[(i + 1) % speeds.length]);
  };

  return (
    <div className="shrink-0 border-t border-line-soft bg-background px-3 py-2">
      <div className="flex items-center gap-2.5 rounded-2xl border border-line-soft bg-bg2 px-2 py-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t("replay.pause") : t("replay.play")}
          className="rt-press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </button>

        <button
          type="button"
          onClick={cycleSpeed}
          className="rt-press rt-mono inline-flex h-8 shrink-0 items-center rounded-lg border border-line-soft bg-bg3 px-2.5 text-[11px] font-semibold text-fg2 tabular"
        >
          {speed}×
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1 px-1">
          <Slider
            value={[raceTime]}
            onValueChange={(v) => setRaceTime(v[0])}
            min={0}
            max={maxTime}
            step={1}
          />
          <div className="flex items-center justify-between">
            <span className="rt-mono text-[10px] tabular text-fg3">
              {formatDuration(raceTime)}
            </span>
            <span className="rt-mono text-[10px] tabular text-fg3">
              {timeOfDay(raceTime)} · max {formatDuration(maxTime)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={goLive}
          aria-pressed={isLive}
          className={cn(
            "rt-press inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[10px] font-bold uppercase tracking-[0.08em]",
            isLive
              ? "border-[color-mix(in_oklch,var(--running),transparent_60%)] bg-[color-mix(in_oklch,var(--running),transparent_80%)] text-[color:var(--running)]"
              : "border-line-soft bg-bg3 text-fg2",
          )}
        >
          {!isLive && <Rewind className="h-3 w-3" />}
          <span
            aria-hidden
            className={cn(
              "inline-block h-[5px] w-[5px] rounded-full",
              isLive && "rt-blink",
            )}
            style={{ background: isLive ? "var(--running)" : "var(--fg3)" }}
          />
          {t("replay.live")}
        </button>
      </div>
    </div>
  );
}
