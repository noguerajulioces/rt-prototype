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
      <div className="flex items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:h-9 sm:w-9"
          >
            <RaceTrackerMark className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight md:inline">
            RaceTracker
          </span>
          <span
            aria-hidden
            className="hidden h-5 w-px shrink-0 bg-line-soft md:block"
          />
          <div className="min-w-0 flex-1">
            {/* Mobile: LIVE pill stacked above title */}
            <div className="flex items-center gap-2 md:hidden">
              <span className="rt-live-pill">
                <span className="rt-live-dot" />
                {t("header.live")}
              </span>
              <span className="rt-mono text-[11px] tabular text-fg3">
                T+ {formatDuration(race.elapsedSeconds)}
              </span>
            </div>
            <h1 className="mt-0.5 truncate text-[14px] font-semibold leading-tight tracking-tight md:mt-0 md:text-[15.5px]">
              {race.name}{" "}
              <span className="rt-mono font-medium text-fg3">
                {race.edition}
              </span>
            </h1>
            <div className="mt-0.5 truncate text-[11px] text-fg3">
              <span>{race.location}</span>
              <span aria-hidden className="mx-1.5 inline-block h-[3px] w-[3px] translate-y-[-2px] rounded-full bg-fg3/60 align-middle" />
              <span className="rt-mono tabular">{race.distance} km</span>
              <span aria-hidden className="mx-1.5 inline-block h-[3px] w-[3px] translate-y-[-2px] rounded-full bg-fg3/60 align-middle" />
              <span className="rt-mono tabular">{race.elevationGain} m D+</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <CoursePicker />
          {/* Desktop: LIVE pill on the right */}
          <span className="rt-live-pill hidden md:inline-flex">
            <span className="rt-live-dot" />
            {t("header.live")} ·{" "}
            <span className="rt-mono ml-0.5 normal-case tracking-normal">
              T+ {formatDuration(race.elapsedSeconds)}
            </span>
          </span>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ShareButton title={`${race.name} ${race.edition} · RaceTracker`} />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
