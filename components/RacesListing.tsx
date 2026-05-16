"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import type { RaceInfo, RaceStatus } from "@/lib/mock-data";
import { flagEmoji, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

function statusOf(r: RaceInfo): RaceStatus {
  return r.status ?? "live";
}

export function RacesListing({ races }: { races: RaceInfo[] }) {
  const live = races.filter((r) => statusOf(r) === "live");
  const upcoming = races
    .filter((r) => statusOf(r) === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = races
    .filter((r) => statusOf(r) === "past")
    .sort((a, b) => b.date.localeCompare(a.date));

  const pastByYear = useMemo(() => {
    const groups = new Map<string, RaceInfo[]>();
    for (const r of past) {
      const y = r.date.slice(0, 4);
      const arr = groups.get(y) ?? [];
      arr.push(r);
      groups.set(y, arr);
    }
    return Array.from(groups.entries()).sort((a, b) =>
      b[0].localeCompare(a[0]),
    );
  }, [past]);

  return (
    <div>
      {live.length > 0 && (
        <SectionDivider label="Live right now" tone="live" />
      )}
      {live.length > 0 && (
        <div className="-mt-px divide-y divide-line-soft border-y border-line-soft">
          {live.map((r) => (
            <LiveRow key={r.slug} race={r} />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="h-12" />
          <SectionDivider label="Upcoming" />
          <div className="-mt-px divide-y divide-line-soft border-y border-line-soft">
            {upcoming.map((r) => (
              <UpcomingRow key={r.slug} race={r} />
            ))}
          </div>
        </>
      )}

      {pastByYear.map(([year, list]) => (
        <div key={year}>
          <div className="h-12" />
          <SectionDivider label={`Archive · ${year}`} />
          <div className="-mt-px divide-y divide-line-soft border-y border-line-soft">
            {list.map((r) => (
              <PastRow key={r.slug} race={r} />
            ))}
          </div>
        </div>
      ))}

      {live.length === 0 && upcoming.length === 0 && past.length === 0 && (
        <div className="rounded-2xl border border-line-soft bg-bg2 px-6 py-12 text-center text-sm text-fg3">
          No races yet.
        </div>
      )}
    </div>
  );
}

function SectionDivider({
  label,
  tone,
}: {
  label: string;
  tone?: "live";
}) {
  const isLive = tone === "live";
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className={cn(
          "rt-mono inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em]",
          isLive ? "text-[color:var(--running)]" : "text-fg3",
        )}
      >
        {isLive && (
          <span
            aria-hidden
            className="rt-blink inline-block h-[6px] w-[6px] rounded-full"
            style={{ background: "var(--running)" }}
          />
        )}
        {label}
      </span>
      <span aria-hidden className="h-px flex-1 bg-line-soft" />
    </div>
  );
}

function RowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rt-press group block px-1 transition-colors hover:bg-bg2/60"
    >
      {children}
    </Link>
  );
}

function LiveRow({ race }: { race: RaceInfo }) {
  return (
    <RowLink href={`/races/${race.slug}`}>
      <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[80px_1fr_auto] sm:gap-6 sm:py-5">
        <div className="flex flex-col items-start gap-1">
          <span className="rt-live-pill">
            <span className="rt-live-dot" />
            LIVE
          </span>
          <span className="rt-mono text-[10.5px] tabular text-fg3 sm:text-[11px]">
            T+ {formatDuration(race.elapsedSeconds)}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="text-[20px] font-semibold leading-tight tracking-tight sm:text-[26px]">
              {race.name}
            </h3>
            <span className="rt-mono text-[13px] font-medium text-fg3 sm:text-[15px]">
              {race.edition}
            </span>
            <span aria-hidden className="text-[14px] leading-none sm:text-[15px]">
              {flagEmoji(race.country)}
            </span>
          </div>
          <div className="mt-1 text-[12.5px] text-fg2 sm:text-[13px]">{race.location}</div>
          <div className="rt-mono mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] tabular text-fg3">
            <span className="text-fg2">{race.distance} km</span>
            <Dot />
            <span>{race.elevationGain} m D+</span>
            <Dot />
            <span>{race.totalRunners} runners</span>
          </div>
        </div>

        <div className="hidden items-center gap-3 text-right md:flex">
          <div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-fg3">
              Leader
            </div>
            <div className="rt-mono mt-0.5 text-[12px] tabular text-foreground">
              {race.totalRunners > 0 ? "km 38.2" : "—"}
            </div>
          </div>
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-fg3 transition-colors group-hover:border-primary group-hover:text-primary"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </RowLink>
  );
}

function UpcomingRow({ race }: { race: RaceInfo }) {
  return (
    <RowLink href={`/races/${race.slug}`}>
      <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-3.5 sm:grid-cols-[80px_1fr_auto] sm:gap-6 sm:py-4">
        <DateBlock iso={race.date} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="text-[16px] font-semibold leading-tight tracking-tight sm:text-[18px]">
              {race.name}
            </h3>
            <span className="rt-mono text-[12px] font-medium text-fg3">
              {race.edition}
            </span>
          </div>
          <div className="mt-0.5 text-[12px] text-fg2">{race.location}</div>
          <div className="rt-mono mt-1 text-[11px] tabular text-fg3 md:hidden">
            <span className="text-fg2">{race.distance} km</span> ·{" "}
            {race.elevationGain} m D+
          </div>
        </div>
        <div className="rt-mono hidden text-right text-[11.5px] tabular text-fg2 md:block">
          <div>
            <span className="text-foreground">{race.distance} km</span> ·{" "}
            {race.elevationGain} m D+
          </div>
          <div className="mt-0.5 text-fg3">
            {race.totalRunners} runners signed up
          </div>
        </div>
      </div>
    </RowLink>
  );
}

function PastRow({ race }: { race: RaceInfo }) {
  return (
    <RowLink href={`/races/${race.slug}`}>
      <div className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-3.5 sm:grid-cols-[80px_1fr_auto] sm:gap-6 sm:py-4">
        <DateBlock iso={race.date} muted />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="text-[15px] font-semibold leading-tight tracking-tight sm:text-[17px]">
              {race.name}
            </h3>
            <span className="rt-mono text-[12px] font-medium text-fg3">
              {race.edition}
            </span>
          </div>
          <div className="mt-0.5 text-[12px] text-fg2">{race.location}</div>
          {race.winner && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-fg3">
              <Trophy className="h-3 w-3 shrink-0 text-primary" />
              <span className="text-fg2">{race.winner.name}</span>
              <span aria-hidden>{flagEmoji(race.winner.country)}</span>
              <span className="rt-mono tabular">
                · {formatDuration(race.winner.time)}
              </span>
            </div>
          )}
        </div>
        <div className="rt-mono hidden text-right text-[11px] tabular text-fg3 md:block">
          <div>
            <span className="text-fg2">{race.distance} km</span> ·{" "}
            {race.elevationGain} m D+
          </div>
          <div className="mt-0.5">
            {race.finishers ?? race.totalRunners} finishers
          </div>
        </div>
      </div>
    </RowLink>
  );
}

function DateBlock({ iso, muted }: { iso: string; muted?: boolean }) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleDateString("en", { month: "short" }).toUpperCase();
  return (
    <div
      className={cn(
        "rt-mono leading-[1] tabular",
        muted ? "text-fg3" : "text-foreground",
      )}
    >
      <div className="text-[22px] font-bold tracking-tight sm:text-[26px]">{day}</div>
      <div className="mt-1 text-[10px] font-semibold tracking-[0.1em] sm:text-[10.5px]">
        {month}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span aria-hidden className="inline-block h-[3px] w-[3px] rounded-full bg-fg3/60" />
  );
}
