"use client";

import { useEffect, useState } from "react";
import { useMap } from "@/components/ui/map";
import {
  elevationAtKm,
  gradeAtKm,
  routeLine,
  type RoutePoint,
} from "@/lib/mock-data";

/* Show only when the cursor is within this many screen px of the route. */
const HIT_RADIUS_PX = 18;

type HoverState = {
  x: number;
  y: number;
  km: number;
};

export function RouteHoverInfo() {
  const { map, isLoaded } = useMap();
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    if (!isLoaded || !map) return;

    /* Pre-project the route line. Re-project on zoomend / moveend so the
       lookup stays accurate as the map transforms. */
    let projected: { x: number; y: number; km: number }[] = [];
    const project = () => {
      projected = routeLine.map((p: RoutePoint) => {
        const pt = map.project([p.lng, p.lat]);
        return { x: pt.x, y: pt.y, km: p.km };
      });
    };
    project();

    const onMove = (e: maplibregl.MapMouseEvent) => {
      const { x, y } = e.point;
      let bestI = -1;
      let bestD2 = Infinity;
      for (let i = 0; i < projected.length; i++) {
        const dx = projected[i].x - x;
        const dy = projected[i].y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) {
          bestD2 = d2;
          bestI = i;
        }
      }
      if (bestI === -1 || Math.sqrt(bestD2) > HIT_RADIUS_PX) {
        setHover(null);
        return;
      }
      setHover({ x, y, km: projected[bestI].km });
    };

    const onLeave = () => setHover(null);

    map.on("mousemove", onMove);
    map.on("mouseout", onLeave);
    map.on("moveend", project);
    map.on("zoomend", project);
    return () => {
      map.off("mousemove", onMove);
      map.off("mouseout", onLeave);
      map.off("moveend", project);
      map.off("zoomend", project);
    };
  }, [isLoaded, map]);

  if (!hover) return null;

  const elev = Math.round(elevationAtKm(hover.km));
  const grade = Math.round(gradeAtKm(hover.km));

  return (
    <div
      role="tooltip"
      className="rt-mono pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full rounded-lg border border-line-soft bg-bg2/95 px-2.5 py-1.5 text-[11px] tabular text-foreground shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55)] backdrop-blur"
      style={{ left: hover.x, top: hover.y - 12 }}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold">km {hover.km.toFixed(2)}</span>
        <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-fg3/60" />
        <span className="text-fg2">{elev} m</span>
        <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-fg3/60" />
        <span
          className={
            grade > 1
              ? "text-[color:var(--running)]"
              : grade < -1
                ? "text-[color:var(--danger)]"
                : "text-fg2"
          }
        >
          {grade > 0 ? "+" : ""}
          {grade}°
        </span>
      </div>
    </div>
  );
}
