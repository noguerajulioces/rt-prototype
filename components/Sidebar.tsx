"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, Filter, X } from "lucide-react";
import {
  checkpoints,
  rankedRunners,
  runnerKmAtTime,
  runners,
  type Runner,
} from "@/lib/mock-data";
import { flagEmoji, formatDuration } from "@/lib/format";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const activeFilters =
    (filters.status !== "all" ? 1 : 0) + (filters.gender !== "all" ? 1 : 0);

  const list = useMemo(() => {
    return rankedRunners().filter((r) => {
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
  }, [search, filters]);

  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("sidebar.search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              {t("sidebar.filter")}
              {activeFilters > 0 && (
                <Badge
                  variant="default"
                  className="ml-1 h-4 min-w-4 rounded-full px-1 text-[10px]"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-60 p-3">
            <FilterGroup
              label={t("filter.status")}
              value={filters.status}
              onChange={(v) =>
                setFilters((f) => ({ ...f, status: v as Filters["status"] }))
              }
              options={[
                { key: "all", label: t("filter.all") },
                { key: "running", label: t("filter.running") },
                { key: "finished", label: t("filter.finished") },
                { key: "dnf", label: t("filter.dnf") },
              ]}
            />
            <div className="mt-3" />
            <FilterGroup
              label={t("filter.gender")}
              value={filters.gender}
              onChange={(v) =>
                setFilters((f) => ({ ...f, gender: v as Filters["gender"] }))
              }
              options={[
                { key: "all", label: t("filter.all") },
                { key: "M", label: t("filter.male") },
                { key: "F", label: t("filter.female") },
              ]}
            />
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 h-7 w-full text-xs text-muted-foreground"
                onClick={() => setFilters(defaultFilters)}
              >
                <X className="mr-1 h-3 w-3" /> {t("sidebar.clearFilters")}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-[28px_36px_1fr_auto_56px] items-center gap-2 border-y border-border bg-muted/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span />
        <span>{t("sidebar.cols.pos")}</span>
        <span>{t("sidebar.cols.name")}</span>
        <span className="text-right">{t("sidebar.cols.km")}</span>
        <span className="text-right">{t("sidebar.cols.time")}</span>
      </div>
      <ScrollArea className="flex-1">
        <ul className="divide-y divide-border">
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
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t("sidebar.empty")}
            </li>
          )}
        </ul>
      </ScrollArea>
      <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        {t("sidebar.count", { n: list.length, total: runners.length })}
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
  return (
    <li
      className={cn(
        "grid grid-cols-[28px_36px_1fr_auto_56px] items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent/40",
        isFavourite && "bg-accent/30",
      )}
    >
      <Checkbox
        checked={isFavourite}
        onCheckedChange={onFavouriteToggle}
        aria-label={t("sidebar.follow", { name: runner.name })}
      />
      <span className="font-mono text-xs font-semibold tabular text-muted-foreground">
        {runner.status === "dnf" ? "—" : position}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-col items-start text-left hover:underline"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-base leading-none">{flagEmoji(runner.country)}</span>
          <span className="truncate font-medium">{runner.name}</span>
        </span>
        <span className="text-[10px] text-muted-foreground tabular">
          #{runner.bib} · {runner.category} · {runner.ageGroup}
        </span>
      </button>
      <span className="text-right font-mono text-xs tabular text-muted-foreground">
        {km === null ? "—" : km.toFixed(1)}
      </span>
      <span className="text-right font-mono text-[11px] tabular">
        {formatDuration(runner.elapsedSeconds)}
      </span>
    </li>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string }[];
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {options.map((o) => (
          <Button
            key={o.key}
            variant={value === o.key ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onChange(o.key)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function StatsPanel() {
  const { t } = useT();
  const ranked = rankedRunners();
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

export function HistoryPanel() {
  const { t } = useT();
  const events = [
    { at: "4:01:30", text: t("history.event.crossesCp", { name: "Sigrid Halvorsen", cp: "CP5 Lutvann" }) },
    { at: "3:58:14", text: t("history.event.finishes", { name: "Lars Sundby", rank: 1 }) },
    { at: "3:44:18", text: t("history.event.crossesCp", { name: "Erik Vinter", cp: "CP5 Lutvann" }) },
    { at: "3:32:40", text: t("history.event.crossesCp", { name: "Anders Lund", cp: "CP4 Sandbakken" }) },
    { at: "3:28:14", text: t("history.event.crossesCp", { name: "Magnus Eriksen", cp: "CP4 Sandbakken" }) },
    { at: "3:14:22", text: t("history.event.crossesCp", { name: "Maria Kowalski", cp: "CP3 Heia" }) },
    { at: "3:07:50", text: t("history.event.crossesCp", { name: "Tobias Berg", cp: "CP3 Heia" }) },
    { at: "2:22:05", text: t("history.event.crossesCp", { name: "Linn Mathisen", cp: "CP2 Mariholtet" }) },
    { at: "1:58:41", text: t("history.event.dnf", { name: "Sofia Andersson", cp: "CP2 Mariholtet" }) },
    { at: "1:12:41", text: t("history.event.crossesCp", { name: "Johan Dahl", cp: "CP1 Skullerudåsen" }) },
  ];
  return (
    <ScrollArea className="flex-1">
      <ol className="space-y-2 p-3">
        {events.map((e, i) => (
          <li
            key={i}
            className="grid grid-cols-[64px_1fr] items-baseline gap-2 text-sm"
          >
            <span className="font-mono text-[11px] tabular text-muted-foreground">
              {e.at}
            </span>
            <span>{e.text}</span>
          </li>
        ))}
      </ol>
    </ScrollArea>
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
