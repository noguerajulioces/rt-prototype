"use client";

import { useMemo } from "react";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import {
  elevationAtKm,
  gradeAtKm,
  rankedRunners,
  runnerKmAtTime,
  type Runner,
} from "@/lib/mock-data";
import { flagEmoji, formatDuration, formatPace } from "@/lib/format";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";
import { cn } from "@/lib/utils";

export function RunnerPopup({
  runner,
  onDetails,
}: {
  runner: Runner;
  onDetails: () => void;
}) {
  const { raceTime, followedRunner, setFollowedRunner } = useReplay();
  const { t } = useT();
  const isFollowed = followedRunner === runner.id;

  const rank = useMemo(() => {
    const list = rankedRunners();
    const idx = list.findIndex((r) => r.id === runner.id);
    return idx >= 0 ? idx + 1 : null;
  }, [runner.id]);

  const km = runnerKmAtTime(runner, raceTime) ?? 0;
  const elevation = Math.round(elevationAtKm(km));
  const grade = Math.round(gradeAtKm(km));

  return (
    <div className="w-64 overflow-hidden rounded-2xl border border-line-soft bg-popover text-popover-foreground shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 px-3 pt-3">
        <span aria-hidden className="rt-bib rt-bib--md">
          {runner.bib}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="text-[13px] leading-none">
              {flagEmoji(runner.country)}
            </span>
            <span className="truncate text-[14px] font-semibold tracking-tight">
              {runner.name}
            </span>
          </div>
          <div className="rt-mono mt-0.5 text-[10.5px] tabular text-fg3">
            #{runner.bib} · {runner.category} {runner.ageGroup}
            {rank ? ` · #${rank}` : ""}
          </div>
          <div className="mt-1.5">
            <StatusBadge status={runner.status} />
          </div>
        </div>
      </div>

      <Separator className="mt-3 bg-line-soft" />

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 px-3 py-3 text-xs">
        <Cell label={t("popup.distance")} value={`${km.toFixed(2)} km`} />
        <Cell label={t("popup.pace")} value={formatPace(runner.paceSecondsPerKm)} />
        <Cell label={t("popup.elevation")} value={`${elevation} m`} />
        <Cell label={t("popup.grade")} value={`${grade > 0 ? "+" : ""}${grade}°`} />
        <Cell
          label="T+"
          value={formatDuration(runner.elapsedSeconds)}
          highlight
        />
        <Cell label={t("popup.rank")} value={runner.status === "dnf" ? "DNF" : (rank?.toString() ?? "—")} highlight />
      </dl>

      <div className="flex gap-2 border-t border-line-soft p-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFollowedRunner(isFollowed ? null : runner.id)}
          aria-pressed={isFollowed}
          className={cn(
            "rt-press flex-1 h-9 gap-1.5",
            isFollowed && "text-primary",
          )}
        >
          <Heart
            className={cn("h-4 w-4", isFollowed && "fill-current")}
          />
          {t("popup.follow")}
        </Button>
        <Button
          size="sm"
          onClick={onDetails}
          className="rt-press h-9 flex-1 gap-1.5"
        >
          <MapPin className="h-4 w-4" />
          {t("popup.details")}
        </Button>
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-fg3">
        {label}
      </dt>
      <dd
        className={cn(
          "rt-mono mt-0.5 text-[13px] tabular font-semibold",
          highlight ? "text-foreground" : "text-fg2",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
