"use client";

import { Play, Pause, Rewind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";
import { race } from "@/lib/mock-data";
import { formatDuration } from "@/lib/format";

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

  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-t border-border bg-card px-3">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={togglePlay}
        aria-label={playing ? t("replay.pause") : t("replay.play")}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <Button
        variant={isLive ? "default" : "outline"}
        size="sm"
        onClick={goLive}
        className="h-8 gap-1.5"
      >
        {!isLive && <Rewind className="h-3.5 w-3.5" />}
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        {t("replay.live")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 font-mono tabular">
            {speed}×
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {speeds.map((s) => (
            <DropdownMenuItem key={s} onClick={() => setSpeed(s)}>
              {s}×
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-1 items-center gap-3">
        <span className="font-mono text-[11px] tabular text-muted-foreground">
          {formatDuration(0)}
        </span>
        <Slider
          value={[raceTime]}
          onValueChange={(v) => setRaceTime(v[0])}
          min={0}
          max={maxTime}
          step={1}
          className="flex-1"
        />
        <span className="font-mono text-[11px] tabular text-muted-foreground">
          {formatDuration(maxTime)}
        </span>
      </div>

      <div className="flex flex-col items-end leading-tight">
        <span className="font-mono text-[11px] tabular text-muted-foreground">
          {timeOfDay(raceTime)}
        </span>
        <span className="font-mono text-xs tabular font-semibold">
          {formatDuration(raceTime)}
        </span>
      </div>
    </div>
  );
}
