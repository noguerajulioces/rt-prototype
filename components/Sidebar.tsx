"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, Flag, Trophy, X, Star } from "lucide-react";
import {
  checkpoints,
  rankedRunners,
  runnerKmAtTime,
  type Runner,
} from "@/lib/mock-data";
import { flagEmoji, formatDuration } from "@/lib/format";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";
import { useCourse } from "./CourseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SettingsContent } from "./SettingsContent";
import type { RailTab } from "./IconRail";
import { cn } from "@/lib/utils";

type Filters = {
  status: "all" | "running" | "finished" | "dnf";
  gender: "all" | "M" | "F";
};

const defaultFilters: Filters = { status: "all", gender: "all" };

export function Sidebar({
  tab,
  open,
  onClose,
  favourites,
  onFavouriteToggle,
  onRunnerClick,
}: {
  tab: RailTab;
  open: boolean;
  onClose: () => void;
  favourites: Set<string>;
  onFavouriteToggle: (id: string) => void;
  onRunnerClick: (r: Runner) => void;
}) {
  if (!open) return null;
  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-r border-border bg-card">
      <SidebarHeader tab={tab} onClose={onClose} />
      <Separator />
      {tab === "participants" && (
        <ParticipantsPanel
          favourites={favourites}
          onFavouriteToggle={onFavouriteToggle}
          onRunnerClick={onRunnerClick}
        />
      )}
      {tab === "stats" && <StatsPanel />}
      {tab === "history" && <HistoryPanel />}
      {tab === "settings" && <SettingsPanel />}
    </aside>
  );
}

export function SettingsPanel() {
  return (
    <ScrollArea className="flex-1">
      <div className="p-3">
        <SettingsContent />
      </div>
    </ScrollArea>
  );
}

function SidebarHeader({
  tab,
  onClose,
}: {
  tab: RailTab;
  onClose: () => void;
}) {
  const { t } = useT();
  const titles: Record<RailTab, string> = {
    participants: t("rail.participants"),
    stats: t("rail.stats"),
    history: t("rail.history"),
    settings: t("rail.settings"),
  };
  return (
    <div className="flex h-10 shrink-0 items-center justify-between px-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {titles[tab]}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("rail.closePanel")}
        className="h-7 w-7"
        onClick={onClose}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ParticipantsPanel({
  favourites,
  onFavouriteToggle,
  onRunnerClick,
}: {
  favourites: Set<string>;
  onFavouriteToggle: (id: string) => void;
  onRunnerClick: (r: Runner) => void;
}) {
  const { raceTime } = useReplay();
  const { t } = useT();
  const { selectedCourseId } = useCourse();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const allRanked = useMemo(
    () => rankedRunners(selectedCourseId ?? undefined),
    [selectedCourseId],
  );

  const list = useMemo(() => {
    return allRanked.filter((r) => {
      if (filters.status === "running" && r.status !== "running") return false;
      if (filters.status === "finished" && r.status !== "finished")
        return false;
      if (filters.status === "dnf" && r.status !== "dnf") return false;
      if (filters.gender !== "all" && r.category !== filters.gender)
        return false;
      if (
        search &&
        !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.bib.toString().includes(search)
      )
        return false;
      return true;
    });
  }, [allRanked, search, filters]);

  const counts = {
    all: allRanked.length,
    running: allRanked.filter((r) => r.status === "running").length,
    finished: allRanked.filter((r) => r.status === "finished").length,
    dnf: allRanked.filter((r) => r.status === "dnf").length,
  };

  const statusFilters: { key: Filters["status"]; label: string }[] = [
    { key: "all", label: t("filter.all") },
    { key: "running", label: t("filter.running") },
    { key: "finished", label: t("filter.finished") },
    { key: "dnf", label: t("filter.dnf") },
  ];

  return (
    <>
      <div className="border-b border-line-soft px-3 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-line-soft bg-bg2 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-fg3" />
            <Input
              type="search"
              placeholder={t("sidebar.search.placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-auto flex-1 border-0 bg-transparent p-0 text-[13px] shadow-none focus-visible:ring-0"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={t("sidebar.clearFilters")}
                className="rt-press text-fg3 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-2 flex gap-1.5 overflow-x-auto"
          role="tablist"
          aria-label={t("filter.status")}
        >
          {statusFilters.map((s) => {
            const active = filters.status === s.key;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() =>
                  setFilters((f) => ({ ...f, status: s.key }))
                }
                className={cn(
                  "rt-press inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-line-soft bg-bg2 text-fg2 hover:text-foreground",
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "rt-mono inline-flex min-w-[1.25rem] justify-center rounded-full px-1 text-[10px] tabular",
                    active
                      ? "bg-black/20 text-primary-foreground"
                      : "bg-bg3 text-fg3",
                  )}
                >
                  {counts[s.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div
            className="inline-flex rounded-xl border border-line-soft bg-bg2 p-0.5"
            role="tablist"
            aria-label={t("filter.gender")}
          >
            {([
              { key: "all", label: t("filter.all") },
              { key: "M", label: t("filter.male") },
              { key: "F", label: t("filter.female") },
            ] as const).map((g) => {
              const active = filters.gender === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      gender: g.key as Filters["gender"],
                    }))
                  }
                  className={cn(
                    "rt-press rounded-lg px-2.5 py-1 text-[11.5px] font-semibold",
                    active ? "bg-bg4 text-foreground" : "text-fg3",
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          <span className="flex-1" />
          <span className="rt-mono text-[11px] tabular text-fg3">
            {list.length}/{allRanked.length}
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <ul className="px-2 pb-2">
          {list.map((r, i) => (
            <ParticipantRow
              key={r.id}
              runner={r}
              position={i + 1}
              isFavourite={favourites.has(r.id)}
              onFavouriteToggle={() => onFavouriteToggle(r.id)}
              onClick={() => onRunnerClick(r)}
              raceTime={raceTime}
            />
          ))}
          {list.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-fg3">
              {t("sidebar.empty")}
            </li>
          )}
        </ul>
      </ScrollArea>
      <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        {t("sidebar.count", { n: list.length, total: allRanked.length })}
      </div>
    </>
  );
}

function ParticipantRow({
  runner,
  position,
  isFavourite,
  onFavouriteToggle,
  onClick,
  raceTime,
}: {
  runner: Runner;
  position: number;
  isFavourite: boolean;
  onFavouriteToggle: () => void;
  onClick: () => void;
  raceTime: number;
}) {
  const { t } = useT();
  const km = runnerKmAtTime(runner, raceTime);
  const dotColor =
    runner.status === "running"
      ? "var(--running)"
      : runner.status === "finished"
        ? "var(--finish)"
        : runner.status === "dnf"
          ? "var(--danger)"
          : "var(--fg3)";
  const isLeader = position === 1 && runner.status !== "dnf";

  return (
    <li>
      <div
        className={cn(
          "rt-press group relative my-0.5 grid grid-cols-[26px_38px_1fr_auto_30px] items-center gap-2.5 rounded-xl border px-2 py-2.5 text-sm",
          isFavourite
            ? "border-[color-mix(in_oklch,var(--accent-color),transparent_70%)] bg-[color-mix(in_oklch,var(--accent-color),transparent_92%)]"
            : "border-transparent hover:bg-bg2",
        )}
      >
        <span
          className={cn(
            "rt-mono text-center text-[12px] font-bold tabular",
            isLeader ? "text-primary" : position <= 3 ? "text-fg" : "text-fg3",
          )}
        >
          {runner.status === "dnf" ? "—" : position}
        </span>

        <span aria-hidden className="rt-bib rt-bib--sm">
          {runner.bib}
        </span>

        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-col items-start text-left"
        >
          <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-foreground">
            <span aria-hidden className="text-[12px] leading-none">
              {flagEmoji(runner.country)}
            </span>
            <span className="max-w-[160px] truncate">{runner.name}</span>
          </span>
          <span className="rt-mono mt-0.5 flex items-center gap-1.5 text-[10.5px] text-fg3">
            <span
              aria-hidden
              className={cn(
                "inline-block h-[5px] w-[5px] rounded-full",
                runner.status === "running" && "rt-blink",
              )}
              style={{ background: dotColor }}
            />
            #{runner.bib} · {runner.category} {runner.ageGroup.slice(1)}
            {runner.club ? ` · ${runner.club}` : ""}
          </span>
        </button>

        <div className="flex flex-col items-end gap-px">
          <span className="rt-mono text-[12px] font-semibold tabular text-foreground">
            {formatDuration(runner.elapsedSeconds)}
          </span>
          <span className="rt-mono text-[10px] tabular text-fg3">
            km {km === null ? "—" : km.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          onClick={onFavouriteToggle}
          className={cn(
            "rt-press inline-flex h-7 w-7 items-center justify-center rounded-full",
            isFavourite ? "text-primary" : "text-fg3 hover:text-foreground",
          )}
          aria-label={t("sidebar.follow", { name: runner.name })}
          aria-pressed={isFavourite}
        >
          <Star className={cn("h-4 w-4", isFavourite && "fill-current")} />
        </button>
      </div>
    </li>
  );
}

export function StatsPanel() {
  const { t } = useT();
  const { selectedCourseId } = useCourse();
  const ranked = rankedRunners(selectedCourseId ?? undefined);
  const running = ranked.filter((r) => r.status === "running").length;
  const finished = ranked.filter((r) => r.status === "finished").length;
  const dnf = ranked.filter((r) => r.status === "dnf").length;
  const leader = ranked.find((r) => r.status === "running") ?? ranked[0];

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label={t("stats.running")} value={running.toString()} tone="success" />
          <Stat
            label={t("stats.finished")}
            value={finished.toString()}
            tone="primary"
          />
          <Stat label={t("stats.dnf")} value={dnf.toString()} tone="muted" />
        </div>
        {leader && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("stats.currentLeader")}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg">{flagEmoji(leader.country)}</span>
              <span className="text-sm font-semibold">{leader.name}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground tabular">
              #{leader.bib} · km {leader.currentKm.toFixed(1)} ·{" "}
              {formatDuration(leader.elapsedSeconds)}
            </div>
          </div>
        )}
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("stats.distribution")}
          </div>
          <div className="space-y-1.5">
            {checkpoints.map((cp) => {
              const count = ranked.filter((r) =>
                r.splits.some((s) => s.checkpointId === cp.id),
              ).length;
              const pct = (count / ranked.length) * 100;
              return (
                <div key={cp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{cp.name}</span>
                    <span className="font-mono tabular text-muted-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

type HistoryEvent = {
  at: string;
  text: string;
  kind: "flag" | "trophy" | "dnf";
};

export function HistoryPanel() {
  const { t } = useT();
  const events: HistoryEvent[] = [
    { at: "4:01:30", text: t("history.event.crossesCp", { name: "Sigrid Halvorsen", cp: "CP5 Lutvann" }), kind: "flag" },
    { at: "3:58:14", text: t("history.event.finishes", { name: "Lars Sundby", rank: 1 }), kind: "trophy" },
    { at: "3:44:18", text: t("history.event.crossesCp", { name: "Erik Vinter", cp: "CP5 Lutvann" }), kind: "flag" },
    { at: "3:32:40", text: t("history.event.crossesCp", { name: "Anders Lund", cp: "CP4 Sandbakken" }), kind: "flag" },
    { at: "3:28:14", text: t("history.event.crossesCp", { name: "Magnus Eriksen", cp: "CP4 Sandbakken" }), kind: "flag" },
    { at: "3:14:22", text: t("history.event.crossesCp", { name: "Maria Kowalski", cp: "CP3 Heia" }), kind: "flag" },
    { at: "3:07:50", text: t("history.event.crossesCp", { name: "Tobias Berg", cp: "CP3 Heia" }), kind: "flag" },
    { at: "2:22:05", text: t("history.event.crossesCp", { name: "Linn Mathisen", cp: "CP2 Mariholtet" }), kind: "flag" },
    { at: "1:58:41", text: t("history.event.dnf", { name: "Sofia Andersson", cp: "CP2 Mariholtet" }), kind: "dnf" },
    { at: "1:12:41", text: t("history.event.crossesCp", { name: "Johan Dahl", cp: "CP1 Skullerudåsen" }), kind: "flag" },
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="px-3 py-3">
        <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.1em] text-fg3">
          Últimos eventos
        </div>
        <ol className="relative m-0 list-none p-0">
          <span
            aria-hidden
            className="absolute bottom-1.5 left-[17px] top-1.5 w-px bg-line-soft"
          />
          {events.map((e, i) => (
            <HistoryItem key={`${e.at}-${i}`} event={e} index={i} />
          ))}
        </ol>
      </div>
    </ScrollArea>
  );
}

function HistoryItem({
  event,
  index,
}: {
  event: HistoryEvent;
  index: number;
}) {
  const color =
    event.kind === "dnf"
      ? "var(--danger)"
      : event.kind === "trophy"
        ? "var(--accent-color)"
        : "var(--running)";
  const Icon = event.kind === "dnf" ? X : event.kind === "trophy" ? Trophy : Flag;
  return (
    <li
      className="rt-fade-in relative grid grid-cols-[34px_1fr] gap-3 py-1.5"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className="z-[1] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border"
        style={{
          color,
          background: `color-mix(in oklch, ${color}, transparent 80%)`,
          borderColor: `color-mix(in oklch, ${color}, transparent 60%)`,
        }}
      >
        <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
      </div>
      <div className="min-w-0 pt-[5px]">
        <div className="text-[13px] leading-[1.35] text-foreground">
          {event.text}
        </div>
        <div className="rt-mono mt-0.5 text-[10.5px] tabular text-fg3">
          T+{event.at}
        </div>
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "primary" | "muted";
}) {
  const toneCls = {
    success: "text-success",
    primary: "text-primary",
    muted: "text-muted-foreground",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-0.5 text-xl font-semibold tabular", toneCls)}>
        {value}
      </div>
    </div>
  );
}
