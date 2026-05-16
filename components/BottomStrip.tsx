"use client";

import { ElevationProfile } from "./ElevationProfile";
import { ReplayTimeline } from "./ReplayTimeline";
import { useSettings } from "./SettingsContext";
import { race } from "@/lib/mock-data";

export function BottomStrip() {
  const { showElevation } = useSettings();
  return (
    <div className="shrink-0">
      {showElevation && (
        <div className="border-t border-line-soft bg-background px-4 pb-2 pt-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-fg3">
              Perfil de elevación
            </span>
            <span className="rt-mono text-[11px] tabular text-fg3">
              <span className="text-fg2">D+ {race.elevationGain}m</span> · D−{" "}
              {race.elevationLoss}m · máx {race.maxElevation}m
            </span>
          </div>
          <div className="relative h-[140px] -mx-1 mt-1">
            <ElevationProfile />
          </div>
        </div>
      )}
      <ReplayTimeline />
    </div>
  );
}
