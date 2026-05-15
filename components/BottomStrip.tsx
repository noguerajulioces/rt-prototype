"use client";

import { ElevationProfile } from "./ElevationProfile";
import { ReplayTimeline } from "./ReplayTimeline";
import { useSettings } from "./SettingsContext";

export function BottomStrip() {
  const { showElevation } = useSettings();
  return (
    <div className="shrink-0">
      {showElevation && (
        <div className="relative h-[150px] border-t border-border bg-card">
          <ElevationProfile />
        </div>
      )}
      <ReplayTimeline />
    </div>
  );
}
