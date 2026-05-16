"use client";

import { Cloud, Wind } from "lucide-react";
import { checkpoints, race, rankedRunners } from "@/lib/mock-data";
import { useCourse } from "./CourseContext";

export function MapOverlays() {
  const { selectedCourseId } = useCourse();
  const ranked = rankedRunners(selectedCourseId ?? undefined);
  const leader = ranked.find((r) => r.status === "running") ?? ranked[0];
  const lastCp = leader?.lastCheckpointId
    ? checkpoints.find((c) => c.id === leader.lastCheckpointId)
    : null;

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2">
      <div className="rt-mono pointer-events-auto inline-flex items-center gap-2 rounded-full border border-line-soft bg-bg2/90 px-3 py-1.5 text-[11px] font-semibold text-fg2 tabular shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] backdrop-blur">
        <Cloud className="h-3.5 w-3.5" />
        <span>{race.weather.tempC}°</span>
        <span
          aria-hidden
          className="inline-block h-[3px] w-[3px] rounded-full bg-fg3/60"
        />
        <Wind className="h-3 w-3" />
        <span>{race.weather.windKmh} km/h</span>
        <span
          aria-hidden
          className="inline-block h-[3px] w-[3px] rounded-full bg-fg3/60"
        />
        <span className="font-sans font-medium normal-case">
          {race.weather.condition}
        </span>
      </div>

      {leader && (
        <div className="pointer-events-auto min-w-[140px] rounded-xl border border-line-soft bg-bg2/95 px-3 py-2 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-fg3">
            Líder en
          </div>
          <div className="mt-0.5 text-[13px] font-semibold tracking-tight">
            {lastCp?.name ?? "—"}
          </div>
          <div className="rt-mono mt-0.5 text-[10.5px] tabular text-primary">
            km {leader.currentKm.toFixed(1)}
          </div>
        </div>
      )}
    </div>
  );
}
