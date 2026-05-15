"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import {
  checkpoints,
  elevationAtKm,
  elevationProfile,
  race,
  runnerKmAtTime,
  runners,
} from "@/lib/mock-data";
import {
  KM_TO_MI,
  M_TO_FT,
  distanceUnit as duFn,
  elevationUnit as euFn,
} from "@/lib/units";
import { useReplay } from "./ReplayContext";
import { useSettings } from "./SettingsContext";
import { useT } from "./LocaleContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const W = 1200;
const H = 150;
const PAD_LEFT = 38;
const PAD_RIGHT = 12;
const PAD_TOP = 14;
const PAD_BOTTOM = 36;

export function ElevationProfile() {
  const { raceTime, maxTime } = useReplay();
  const { imperial, showRunnersOnProfile, set } = useSettings();
  const { t } = useT();

  const distanceUnit = duFn(imperial);
  const elevationUnit = euFn(imperial);
  const xFactor = imperial ? KM_TO_MI : 1;
  const yFactor = imperial ? M_TO_FT : 1;

  const {
    linePath,
    areaPath,
    xScale,
    yScale,
    minElev,
    maxElev,
    maxKm,
    xTicks,
    yTicks,
  } = useMemo(() => {
    const maxKm = elevationProfile[elevationProfile.length - 1].km;
    const minElev = Math.min(...elevationProfile.map((p) => p.elevation));
    const maxElev = Math.max(...elevationProfile.map((p) => p.elevation));
    const range = maxElev - minElev || 1;

    const xScale = (km: number) =>
      PAD_LEFT + (km / maxKm) * (W - PAD_LEFT - PAD_RIGHT);
    const yScale = (elev: number) =>
      H - PAD_BOTTOM - ((elev - minElev) / range) * (H - PAD_TOP - PAD_BOTTOM);

    const linePath =
      "M " +
      elevationProfile
        .map((p) => `${xScale(p.km)} ${yScale(p.elevation)}`)
        .join(" L ");
    const areaPath = `${linePath} L ${xScale(maxKm)} ${H - PAD_BOTTOM} L ${PAD_LEFT} ${H - PAD_BOTTOM} Z`;

    const xStep = 5;
    const maxKmDisplay = imperial ? maxKm * KM_TO_MI : maxKm;
    const xTicks: { value: number; km: number }[] = [];
    for (let i = 0; i <= Math.floor(maxKmDisplay); i += xStep) {
      const km = imperial ? i / KM_TO_MI : i;
      xTicks.push({ value: i, km });
    }

    const yStep = imperial ? 200 : 50;
    const minDisp = imperial ? minElev * M_TO_FT : minElev;
    const maxDisp = imperial ? maxElev * M_TO_FT : maxElev;
    const yTicks: { value: number; m: number }[] = [];
    const firstTick = Math.ceil(minDisp / yStep) * yStep;
    for (let i = firstTick; i <= maxDisp; i += yStep) {
      const m = imperial ? i / M_TO_FT : i;
      yTicks.push({ value: i, m });
    }

    return {
      linePath,
      areaPath,
      xScale,
      yScale,
      minElev,
      maxElev,
      maxKm,
      xTicks,
      yTicks,
    };
  }, [imperial]);

  const liveKm = (race.elapsedSeconds / maxTime) * maxKm;
  const replayKm = (raceTime / maxTime) * maxKm;

  const liveRunners = useMemo(
    () =>
      runners
        .filter((r) => r.status !== "dnf")
        .map((r) => {
          const km = runnerKmAtTime(r, raceTime);
          if (km === null) return null;
          return {
            id: r.id,
            firstName: r.name.split(" ")[0],
            km,
            elev: elevationAtKm(km),
            finished: r.status === "finished",
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [raceTime],
  );

  return (
    <div className="relative h-full w-full">
      <div className="absolute right-2 top-2 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showRunnersOnProfile ? "default" : "outline"}
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                set("showRunnersOnProfile", !showRunnersOnProfile)
              }
              aria-pressed={showRunnersOnProfile}
              aria-label={t("settings.runnersOnProfile")}
            >
              <Users className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {t("settings.runnersOnProfile")}
          </TooltipContent>
        </Tooltip>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        style={{ overflow: "visible" as const }}
      >
        <defs>
          <linearGradient id="elev-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = yScale(tick.m);
          return (
            <g key={`y-${tick.value}`}>
              <line
                x1={PAD_LEFT}
                x2={W - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="2 4"
                className="text-border"
              />
              <text
                x={PAD_LEFT - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[9px] tabular"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {tick.value}
              </text>
            </g>
          );
        })}

        <text
          x={4}
          y={PAD_TOP + 4}
          className="fill-muted-foreground text-[9px] tabular"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {elevationUnit}
        </text>

        {xTicks.map((tick) => {
          const x = xScale(tick.km);
          return (
            <g key={`x-${tick.value}`}>
              <line
                x1={x}
                x2={x}
                y1={H - PAD_BOTTOM}
                y2={H - PAD_BOTTOM + 4}
                stroke="currentColor"
                strokeWidth="0.6"
                className="text-border"
              />
              <text
                x={x}
                y={H - PAD_BOTTOM + 14}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] tabular"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {tick.value} {distanceUnit}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#elev-grad)" className="text-primary" />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          className="text-primary"
        />

        {checkpoints.map((cp) => {
          const x = xScale(cp.km);
          const y = yScale(cp.elevation);
          return (
            <g key={cp.id}>
              <line
                x1={x}
                x2={x}
                y1={y}
                y2={H - PAD_BOTTOM}
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="2 3"
                className="text-muted-foreground"
              />
              <circle
                cx={x}
                cy={y}
                r="3"
                className="fill-card stroke-primary"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {showRunnersOnProfile &&
          liveRunners.map((r, i) => {
            const x = xScale(r.km);
            const y = yScale(r.elev);
            const charW = 5;
            const labelW = r.firstName.length * charW + 8;
            const labelH = 12;
            const labelGap = 6;
            const labelY = y + labelGap;
            const stagger = i % 2 === 0 ? 0 : labelH + 2;
            return (
              <g key={r.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  className={cn(
                    "stroke-card",
                    r.finished ? "fill-primary" : "fill-success",
                  )}
                  strokeWidth="1.5"
                />
                <g transform={`translate(${x - labelW / 2}, ${labelY + stagger})`}>
                  <rect
                    width={labelW}
                    height={labelH}
                    rx="2"
                    className="fill-card stroke-border"
                    strokeWidth="0.5"
                  />
                  <text
                    x={labelW / 2}
                    y={labelH - 3}
                    textAnchor="middle"
                    className="fill-foreground text-[9px] font-semibold"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {r.firstName}
                  </text>
                </g>
              </g>
            );
          })}

        <line
          x1={xScale(liveKm)}
          x2={xScale(liveKm)}
          y1={PAD_TOP - 2}
          y2={H - PAD_BOTTOM}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="text-success opacity-70"
        />
        <line
          x1={xScale(replayKm)}
          x2={xScale(replayKm)}
          y1={PAD_TOP - 2}
          y2={H - PAD_BOTTOM}
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-foreground"
        />
      </svg>
    </div>
  );
}
