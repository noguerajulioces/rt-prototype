import type { StyleSpecification } from "maplibre-gl";

const kartverketTiles = [
  "https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png",
];

const kartverketGreyTiles = [
  "https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/{z}/{y}/{x}.png",
];

const osmTiles = [
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
];

export const kartverketStyle: StyleSpecification = {
  version: 8,
  sources: {
    kartverket: {
      type: "raster",
      tiles: kartverketTiles,
      tileSize: 256,
      attribution: '© <a href="https://www.kartverket.no/">Kartverket</a>',
      maxzoom: 18,
    },
  },
  layers: [
    {
      id: "kartverket",
      type: "raster",
      source: "kartverket",
    },
  ],
};

export const kartverketGreyStyle: StyleSpecification = {
  ...kartverketStyle,
  sources: {
    kartverket: {
      type: "raster",
      tiles: kartverketGreyTiles,
      tileSize: 256,
      attribution: '© <a href="https://www.kartverket.no/">Kartverket</a>',
      maxzoom: 18,
    },
  },
};

export const osmStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: osmTiles,
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export function pickStyle(country: string): StyleSpecification {
  return country === "NO" ? kartverketStyle : osmStyle;
}
