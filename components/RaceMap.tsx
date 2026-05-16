"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Flag, Trophy, Droplets, Timer } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  MapRoute,
  MapControls,
  useMap,
} from "@/components/ui/map";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  kartverketStyle,
  kartverketGreyStyle,
  osmStyle,
} from "@/lib/map-sources";
import {
  checkpoints,
  race,
  rankedRunners,
  routeLine,
  runnerKmAtTime,
  runnerLngLat,
  runners,
  type Checkpoint,
  type Runner,
} from "@/lib/mock-data";
import { useReplay } from "./ReplayContext";
import { useSettings } from "./SettingsContext";
import { useT } from "./LocaleContext";
import { useCourse } from "./CourseContext";
import { RunnerPopup } from "./RunnerPopup";
import { RouteHoverInfo } from "./RouteHoverInfo";
import { RouteDirectionArrows } from "./RouteDirectionArrows";

type LayerKey = "topo" | "grey" | "osm";

const layerStyles = {
  topo: kartverketStyle,
  grey: kartverketGreyStyle,
  osm: osmStyle,
};

const ROUTE_COLOR_LIGHT = "#0033a0";
const ROUTE_COLOR_DARK = "#3d6fe5";

export function RaceMap({
  favourites,
  onRunnerDetails,
}: {
  favourites: Set<string>;
  onRunnerDetails: (r: Runner) => void;
}) {
  const [layer, setLayer] = useState<LayerKey>(
    race.country === "NO" ? "topo" : "osm",
  );
  const { resolvedTheme } = useTheme();
  const { showRouteDirection } = useSettings();

  const styles = useMemo(
    () => ({ light: layerStyles[layer], dark: layerStyles[layer] }),
    [layer],
  );
  const routeCoords = useMemo<[number, number][]>(
    () => routeLine.map((p) => [p.lng, p.lat]),
    [],
  );
  const routeColor =
    resolvedTheme === "dark" ? ROUTE_COLOR_DARK : ROUTE_COLOR_LIGHT;

  return (
    <div className="absolute inset-0">
      <Map
        styles={styles}
        center={race.center}
        zoom={11}
        className="h-full w-full"
      >
        <FitToRoute />
        <FollowCamera />

        <MapRoute
          coordinates={routeCoords}
          color="#ffffff"
          width={9}
          opacity={0.9}
          interactive={false}
        />
        <MapRoute
          coordinates={routeCoords}
          color={routeColor}
          width={4}
          opacity={1}
          interactive={false}
        />

        {showRouteDirection && (
          <RouteDirectionArrows coordinates={routeCoords} />
        )}

        {checkpoints.map((cp) => (
          <MapMarker
            key={cp.id}
            longitude={cp.location[0]}
            latitude={cp.location[1]}
            anchor="center"
          >
            <MarkerContent className="cursor-pointer">
              <CheckpointPin cp={cp} />
            </MarkerContent>
            <MarkerTooltip offset={14}>
              <CheckpointTooltip cp={cp} />
            </MarkerTooltip>
          </MapMarker>
        ))}

        <RunnerMarkers
          favourites={favourites}
          onRunnerDetails={onRunnerDetails}
        />

        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        <RouteHoverInfo />
      </Map>

      <div className="absolute right-3 top-3 z-10">
        <Tabs value={layer} onValueChange={(v) => setLayer(v as LayerKey)}>
          <TabsList className="h-8 rounded-full border border-line-soft bg-bg2/90 p-1 backdrop-blur shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)]">
            <TabsTrigger
              value="topo"
              className="rounded-full px-3 text-[11px] font-semibold tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Topo
            </TabsTrigger>
            <TabsTrigger
              value="grey"
              className="rounded-full px-3 text-[11px] font-semibold tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Gris
            </TabsTrigger>
            <TabsTrigger
              value="osm"
              className="rounded-full px-3 text-[11px] font-semibold tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              OSM
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function RunnerMarkers({
  favourites,
  onRunnerDetails,
}: {
  favourites: Set<string>;
  onRunnerDetails: (r: Runner) => void;
}) {
  const { raceTime } = useReplay();
  const { showAllNames, showBib, showLeader } = useSettings();
  const { selectedCourseId } = useCourse();

  const visibleRunners = useMemo(
    () =>
      selectedCourseId
        ? runners.filter((r) => r.courseId === selectedCourseId)
        : runners,
    [selectedCourseId],
  );

  const leaderId = useMemo(() => {
    if (!showLeader) return null;
    const ranked = rankedRunners(selectedCourseId ?? undefined);
    const liveLeader = ranked.find((r) => r.status === "running");
    return (liveLeader ?? ranked[0])?.id ?? null;
  }, [showLeader, selectedCourseId]);

  return (
    <>
      {visibleRunners.map((r) => {
        const km = runnerKmAtTime(r, raceTime);
        if (km === null) return null;
        const [lng, lat] = runnerLngLat(km);
        const isLeader = r.id === leaderId;
        return (
          <MapMarker key={r.id} longitude={lng} latitude={lat}>
            <MarkerContent>
              <RunnerDot
                runner={r}
                isFav={favourites.has(r.id)}
                isLeader={isLeader}
                showBib={showBib}
              />
              {(showAllNames || isLeader) && (
                <RunnerLabel
                  runner={r}
                  isLeader={isLeader}
                />
              )}
            </MarkerContent>
            <MarkerPopup
              offset={14}
              closeButton
              className="max-w-none"
            >
              <RunnerPopup runner={r} onDetails={() => onRunnerDetails(r)} />
            </MarkerPopup>
          </MapMarker>
        );
      })}
    </>
  );
}

function RunnerLabel({
  runner,
  isLeader,
}: {
  runner: Runner;
  isLeader: boolean;
}) {
  const { t } = useT();
  return (
    <MarkerLabel
      position="top"
      className={cn(
        "mb-0.5 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold tracking-tight shadow-[0_2px_6px_-2px_rgba(0,0,0,0.5)]",
        isLeader
          ? "border-[color:var(--running)] bg-[color-mix(in_oklch,var(--running),transparent_75%)] text-foreground"
          : "border-line-soft bg-bg2/90 text-foreground backdrop-blur",
      )}
    >
      {isLeader ? t("map.leaderBadge", { name: runner.name }) : runner.name}
    </MarkerLabel>
  );
}

function FitToRoute() {
  const { map, isLoaded } = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!isLoaded || !map || fitted.current) return;
    const first: [number, number] = [routeLine[0].lng, routeLine[0].lat];
    const bounds = routeLine.reduce(
      (b, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds(first, first),
    );
    map.fitBounds(bounds, { padding: 60, duration: 0 });
    fitted.current = true;
  }, [isLoaded, map]);

  return null;
}

function FollowCamera() {
  const { map, isLoaded } = useMap();
  const { raceTime, followedRunner } = useReplay();
  const lastFollowed = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !map || !followedRunner) return;
    const r = runners.find((x) => x.id === followedRunner);
    if (!r) return;
    const km = runnerKmAtTime(r, raceTime);
    if (km === null) return;
    const lngLat = runnerLngLat(km);
    const firstFollow = lastFollowed.current !== followedRunner;
    lastFollowed.current = followedRunner;
    map.easeTo({
      center: lngLat,
      zoom: firstFollow ? Math.max(map.getZoom(), 13) : map.getZoom(),
      duration: firstFollow ? 800 : 250,
    });
  }, [isLoaded, map, raceTime, followedRunner]);

  return null;
}

function checkpointMeta(type: Checkpoint["type"]) {
  switch (type) {
    case "start":
      return { Icon: Flag, label: "Salida" };
    case "finish":
      return { Icon: Trophy, label: "Meta" };
    case "aid":
      return { Icon: Droplets, label: "Avituallamiento" };
    case "timing":
      return { Icon: Timer, label: "Cronometraje" };
  }
}

function CheckpointPin({ cp }: { cp: Checkpoint }) {
  const isTerminal = cp.type === "start" || cp.type === "finish";
  const { Icon } = checkpointMeta(cp.type);
  return (
    <div
      aria-hidden
      className={cn(
        "rt-press relative inline-flex h-7 w-7 select-none items-center justify-center border-2 border-background bg-primary text-primary-foreground shadow-[0_2px_6px_rgba(0,0,0,0.55)]",
        isTerminal ? "rounded-md" : "rounded-full",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
    </div>
  );
}

function CheckpointTooltip({ cp }: { cp: Checkpoint }) {
  const { Icon, label } = checkpointMeta(cp.type);
  return (
    <div className="min-w-[180px] rounded-xl border border-line-soft bg-popover px-3 py-2.5 text-popover-foreground shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--accent-color),transparent_82%)] text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight tracking-tight">
            {cp.name}
          </div>
          <div className="rt-mono mt-0.5 text-[10.5px] tabular text-fg3">
            km {cp.km} · {cp.elevation} m
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-line-soft pt-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-fg3">
          {label}
        </span>
        {cp.services && cp.services.length > 0 && (
          <span className="text-[10.5px] text-fg2">
            · {cp.services.slice(0, 3).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}

function RunnerDot({
  runner,
  isFav,
  isLeader,
  showBib,
}: {
  runner: Runner;
  isFav: boolean;
  isLeader: boolean;
  showBib: boolean;
}) {
  const finished = runner.status === "finished";
  const dnf = runner.status === "dnf";
  const ring = isLeader
    ? "ring-[color:var(--running)]"
    : isFav
      ? "ring-primary"
      : "ring-background";
  const color = dnf
    ? "bg-[color:var(--dnf)]"
    : finished
      ? "bg-[color:var(--finish)]"
      : "bg-[color:var(--running)]";
  /* Bigger when the bib is rendered inside; leader gets a small bump. */
  const size = showBib
    ? isLeader
      ? "h-[28px] w-[28px] text-[11.5px]"
      : "h-6 w-6 text-[10.5px]"
    : isLeader
      ? "h-5 w-5"
      : "h-[18px] w-[18px]";
  return (
    <div className="relative">
      <div
        title={`${runner.name} · #${runner.bib}`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-bold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.55)] ring-2",
          color,
          ring,
          size,
        )}
      >
        {showBib && (
          <span className="rt-mono tabular drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {runner.bib}
          </span>
        )}
        {isLeader && (
          <span
            aria-hidden
            className="absolute -inset-1.5 rounded-full ring-2 ring-[color:var(--running)] opacity-50 rt-pulse"
          />
        )}
      </div>
    </div>
  );
}
