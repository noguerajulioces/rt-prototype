"use client";

import type { RaceInfo } from "@/lib/mock-data";
import { formatDuration } from "@/lib/format";
import { useT } from "./LocaleContext";
import { RaceTrackerMark } from "./RaceTrackerLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { CoursePicker } from "./CoursePicker";
import { ShareButton } from "./ShareButton";

export function RaceHeader({ race }: { race: RaceInfo }) {
  const { t } = useT();
  return (
    <header className="relative z-10 shrink-0 border-b border-line-soft bg-background">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            <RaceTrackerMark className="h-5 w-5" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight md:inline">
            RaceTracker
          </span>
          <span
            aria-hidden
            className="hidden h-5 w-px shrink-0 bg-line-soft md:block"
          />
          <div className="min-w-0">
            {/* Mobile: LIVE pill stacked above title */}
            <div className="flex items-center gap-2 md:hidden">
              <span className="rt-live-pill">
                <span className="rt-live-dot" />
                {t("header.live")}
              </span>
              <span className="rt-mono text-[11px] text-fg3">
                T+ {formatDuration(race.elapsedSeconds)}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2 md:mt-0">
              <h1 className="text-[15px] font-semibold leading-tight tracking-tight md:text-[15.5px]">
                {race.name}{" "}
                <span className="rt-mono text-fg3 font-medium">
                  {race.edition}
                </span>
              </h1>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-fg3">
              <span className="truncate">{race.location}</span>
              <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-fg3/60" />
              <span className="rt-mono">{race.distance} km</span>
              <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-fg3/60" />
              <span className="rt-mono">{race.elevationGain} m D+</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CoursePicker />
          {/* Desktop: LIVE pill on the right */}
          <span className="rt-live-pill hidden md:inline-flex">
            <span className="rt-live-dot" />
            {t("header.live")} ·{" "}
            <span className="rt-mono ml-0.5 normal-case tracking-normal">
              T+ {formatDuration(race.elapsedSeconds)}
            </span>
          </span>
          <LanguageSwitcher />
          <ShareButton title={`${race.name} ${race.edition} · RaceTracker`} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
