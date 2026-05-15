"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Crown } from "lucide-react";
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
import { RunnerPopup } from "./RunnerPopup";

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

        {checkpoints.map((cp) => (
          <MapMarker
            key={cp.id}
            longitude={cp.location[0]}
            latitude={cp.location[1]}
            anchor="bottom"
          >
            <MarkerContent className="cursor-default">
              <CheckpointPin cp={cp} />
            </MarkerContent>
            <MarkerTooltip offset={8}>
              <span className="font-semibold">{cp.name}</span>
              <span className="ml-1 font-mono tabular opacity-70">
                · {cp.km} km
              </span>
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
      </Map>

      <div className="absolute right-3 top-3 z-10">
        <Tabs value={layer} onValueChange={(v) => setLayer(v as LayerKey)}>
          <TabsList className="h-8 bg-background/95 backdrop-blur shadow-sm">
            <TabsTrigger value="topo" className="text-xs">
              Topo
            </TabsTrigger>
            <TabsTrigger value="grey" className="text-xs">
              Gris
            </TabsTrigger>
            <TabsTrigger value="osm" className="text-xs">
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

  const leaderId = useMemo(() => {
    if (!showLeader) return null;
    const ranked = rankedRunners();
    const liveLeader = ranked.find((r) => r.status === "running");
    return (liveLeader ?? ranked[0])?.id ?? null;
  }, [showLeader]);

  return (
    <>
      {runners.map((r) => {
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
        "rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm border whitespace-nowrap",
        isLeader
          ? "bg-warning text-white border-warning"
          : "bg-card text-card-foreground border-border",
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

function CheckpointPin({ cp }: { cp: Checkpoint }) {
  const isTerminal = cp.type === "start" || cp.type === "finish";
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-[3px] ring-white">
        {isTerminal ? (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="h-2 w-2 -mt-1 rotate-45 bg-primary shadow-sm ring-[3px] ring-white" />
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
  const bg = dnf
    ? "bg-muted-foreground"
    : finished
      ? "bg-primary"
      : "bg-success";
  return (
    <div className="relative">
      {isLeader && (
        <Crown
          aria-hidden="true"
          fill="currentColor"
          className="absolute -top-3.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 text-warning drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        />
      )}
      <div
        title={`${runner.name} · #${runner.bib}`}
        className={cn(
          "relative flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-mono font-bold tabular shadow-md ring-2",
          bg,
          isLeader
            ? "ring-warning shadow-warning/40"
            : isFav
              ? "ring-warning"
              : "ring-white",
        )}
      >
        {showBib ? runner.bib : ""}
      </div>
    </div>
  );
}
