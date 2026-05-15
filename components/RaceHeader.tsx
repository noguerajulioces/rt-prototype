"use client";

import type { RaceInfo } from "@/lib/mock-data";
import { useT } from "./LocaleContext";
import { RaceTrackerLogo } from "./RaceTrackerLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function RaceHeader({ race }: { race: RaceInfo }) {
  const { t } = useT();
  return (
    <header className="flex h-12 shrink-0 items-center justify-between bg-header text-header-foreground px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">
          {race.name} {race.edition}
        </h1>
        <span className="hidden text-[11px] text-header-foreground/60 sm:inline">
          {race.location}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-header-foreground/80">
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {t("header.live")}
        </span>
        <LanguageSwitcher className="text-header-foreground hover:bg-header-foreground/10 hover:text-header-foreground" />
        <span className="mx-1 hidden h-4 w-px bg-header-foreground/20 sm:inline-block" />
        <RaceTrackerLogo className="text-header-foreground" />
      </div>
    </header>
  );
}
