"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  elevationAtKm,
  gradeAtKm,
  rankedRunners,
  runnerKmAtTime,
  type Runner,
} from "@/lib/mock-data";
import { flagEmoji, formatPace } from "@/lib/format";
import { useReplay } from "./ReplayContext";
import { useT } from "./LocaleContext";

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
    <div className="w-56 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 pr-5 font-semibold">
          <span>{runner.name}</span>
        </div>
        <span className="text-lg leading-none">{flagEmoji(runner.country)}</span>
      </div>
      <Separator />
      <dl className="space-y-1 text-xs">
        <Row label={t("popup.bib")} value={`#${runner.bib}`} mono />
        <Row
          label={t("popup.rank")}
          value={runner.status === "dnf" ? "DNF" : (rank?.toString() ?? "—")}
          mono
        />
        <Row label={t("popup.distance")} value={`${km.toFixed(2)} km`} mono />
        <Row label={t("popup.pace")} value={formatPace(runner.paceSecondsPerKm)} mono />
        <Row label={t("popup.elevation")} value={`${elevation} m`} mono />
        <Row
          label={t("popup.grade")}
          value={`${grade > 0 ? "+" : ""}${grade}°`}
          mono
        />
        <Row label={t("popup.lastUpdate")} value={t("popup.lastUpdate.ago", { mins: 2 })} />
      </dl>
      <Separator />
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor={`follow-${runner.id}`}
          className="flex cursor-pointer items-center gap-2 text-xs font-normal"
        >
          <Checkbox
            id={`follow-${runner.id}`}
            checked={isFollowed}
            onCheckedChange={(v) =>
              setFollowedRunner(v ? runner.id : null)
            }
          />
          {t("popup.follow")}
        </Label>
      </div>
      <Button size="sm" className="w-full" onClick={onDetails}>
        {t("popup.details")}
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono tabular" : ""}>{value}</dd>
    </div>
  );
}
