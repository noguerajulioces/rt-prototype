"use client";

import { useEffect, useId } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMap } from "@/components/ui/map";

const ICON_ID = "rt-route-arrow";

/* Renders chevron arrows along the route line at regular spacing, indicating
   race direction. Listens to the same route source already on the map. */
export function RouteDirectionArrows({
  coordinates,
  /* Distance in screen pixels between consecutive arrows. Higher = sparser. */
  spacing = 100,
  /* Solid fill of the arrowhead. Contrasts with the blue route line. */
  color = "#ffffff",
  /* Dark halo behind the arrowhead so it stays visible on light tiles too. */
  haloColor = "#0a1226",
  size = 1,
}: {
  coordinates: [number, number][];
  spacing?: number;
  color?: string;
  haloColor?: string;
  size?: number;
}) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `route-dir-source-${id}`;
  const layerId = `route-dir-layer-${id}`;

  /* Generate the chevron sprite once and add it to the map. The icon is
     drawn as a white triangle pointing right; the symbol layer rotates it
     along the line, so the visual result is an arrow following direction. */
  useEffect(() => {
    if (!isLoaded || !map) return;
    if (map.hasImage(ICON_ID)) map.removeImage(ICON_ID);

    /* Render at 2× the visual size for retina sharpness, then declare
       pixelRatio: 2 so maplibre treats the bitmap as that smaller logical size. */
    const SIZE = 48;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    /* Dark halo chevron (slightly thicker) drawn first. */
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(14, 10);
    ctx.lineTo(34, 24);
    ctx.lineTo(14, 38);
    ctx.stroke();

    /* Bright chevron on top. */
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(14, 10);
    ctx.lineTo(34, 24);
    ctx.lineTo(14, 38);
    ctx.stroke();

    const data = ctx.getImageData(0, 0, SIZE, SIZE);
    map.addImage(ICON_ID, data, { pixelRatio: 2 });
  }, [isLoaded, map, color, haloColor]);

  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });
    }
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": spacing,
          "icon-image": ICON_ID,
          "icon-size": size,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-rotation-alignment": "map",
          "icon-pitch-alignment": "map",
        },
      });
    }

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  /* Keep source coordinates in sync if the route changes. */
  useEffect(() => {
    if (!isLoaded || !map) return;
    const src = map.getSource(sourceId) as GeoJSONSource | undefined;
    if (!src) return;
    src.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    });
  }, [isLoaded, map, coordinates, sourceId]);

  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) return;
    map.setLayoutProperty(layerId, "symbol-spacing", spacing);
    map.setLayoutProperty(layerId, "icon-size", size);
  }, [isLoaded, map, layerId, spacing, size]);

  return null;
}
