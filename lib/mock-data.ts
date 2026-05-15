import { routeLineGenerated } from "./route-generated";
import type { Locale } from "./i18n";

export type RunnerStatus = "running" | "finished" | "dnf" | "pre-race";

export type LngLat = [number, number];

export type Checkpoint = {
  id: string;
  name: string;
  km: number;
  elevation: number;
  type: "start" | "aid" | "timing" | "finish";
  location: LngLat;
  cutoffSeconds?: number;
  services?: string[];
};

export type Runner = {
  id: string;
  bib: number;
  name: string;
  country: string;
  category: "M" | "F";
  ageGroup: string;
  club?: string;
  status: RunnerStatus;
  currentKm: number;
  elapsedSeconds: number;
  lastCheckpointId?: string;
  splits: { checkpointId: string; elapsedSeconds: number }[];
  paceSecondsPerKm: number;
};

export type ElevationPoint = { km: number; elevation: number };

export type RoutePoint = { lng: number; lat: number; km: number };

export type RaceInfo = {
  slug: string;
  name: string;
  edition: string;
  date: string;
  location: string;
  country: string;
  defaultLocale: Locale;
  center: LngLat;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  maxElevation: number;
  weather: { tempC: number; condition: string; windKmh: number };
  totalRunners: number;
  startedAt: string;
  elapsedSeconds: number;
};

export const race: RaceInfo = {
  slug: "nekrotrail-2026",
  name: "Nekrotrail",
  edition: "2026",
  date: "2026-05-15",
  location: "Østmarka, Oslo, Noruega",
  country: "NO",
  defaultLocale: "no",
  center: [10.92, 59.88],
  distance: 42,
  elevationGain: 1280,
  elevationLoss: 1270,
  maxElevation: 360,
  weather: { tempC: 9, condition: "Parcialmente nublado", windKmh: 14 },
  totalRunners: 248,
  startedAt: "08:00",
  elapsedSeconds: 4 * 3600 + 17 * 60 + 32,
};

export const checkpoints: Checkpoint[] = [
  {
    id: "start",
    name: "Sarabråten",
    km: 0,
    elevation: 120,
    type: "start",
    location: [10.823183, 59.892003],
    services: ["Cronometraje", "Baños"],
  },
  {
    id: "cp1",
    name: "Skullerudåsen",
    km: 8.4,
    elevation: 340,
    type: "timing",
    location: [10.875134, 59.918042],
    cutoffSeconds: 2 * 3600,
    services: ["Cronometraje", "Agua"],
  },
  {
    id: "cp2",
    name: "Mariholtet",
    km: 16.2,
    elevation: 200,
    type: "aid",
    location: [10.954983, 59.919754],
    cutoffSeconds: 4 * 3600 + 30 * 60,
    services: ["Avituallamiento", "Médico", "Drop bag"],
  },
  {
    id: "cp3",
    name: "Heia",
    km: 24.5,
    elevation: 360,
    type: "timing",
    location: [10.989053, 59.879579],
    cutoffSeconds: 7 * 3600,
    services: ["Cronometraje", "Agua", "Fotógrafo"],
  },
  {
    id: "cp4",
    name: "Sandbakken",
    km: 31.8,
    elevation: 180,
    type: "aid",
    location: [10.954449, 59.845608],
    cutoffSeconds: 9 * 3600,
    services: ["Avituallamiento", "Médico"],
  },
  {
    id: "cp5",
    name: "Lutvann",
    km: 37.6,
    elevation: 230,
    type: "timing",
    location: [10.869034, 59.855583],
    cutoffSeconds: 11 * 3600,
    services: ["Cronometraje", "Agua"],
  },
  {
    id: "finish",
    name: "Sarabråten · Meta",
    km: 42,
    elevation: 130,
    type: "finish",
    location: [10.823183, 59.892003],
    services: ["Cronometraje", "Avituallamiento", "Médico", "Duchas"],
  },
];

export const elevationProfile: ElevationPoint[] = [
  { km: 0, elevation: 120 },
  { km: 2, elevation: 180 },
  { km: 4, elevation: 240 },
  { km: 6, elevation: 290 },
  { km: 8.4, elevation: 340 },
  { km: 10, elevation: 310 },
  { km: 12, elevation: 270 },
  { km: 14, elevation: 230 },
  { km: 16.2, elevation: 200 },
  { km: 18, elevation: 250 },
  { km: 20, elevation: 310 },
  { km: 22, elevation: 340 },
  { km: 24.5, elevation: 360 },
  { km: 26, elevation: 320 },
  { km: 28, elevation: 270 },
  { km: 30, elevation: 220 },
  { km: 31.8, elevation: 180 },
  { km: 34, elevation: 220 },
  { km: 36, elevation: 250 },
  { km: 37.6, elevation: 230 },
  { km: 39, elevation: 190 },
  { km: 40.5, elevation: 150 },
  { km: 42, elevation: 130 },
];

export const routeLine: RoutePoint[] = routeLineGenerated;

export function runnerLngLat(km: number): LngLat {
  for (let i = 0; i < routeLine.length - 1; i++) {
    const a = routeLine[i];
    const b = routeLine[i + 1];
    if (km >= a.km && km <= b.km) {
      const span = b.km - a.km;
      const t = span === 0 ? 0 : (km - a.km) / span;
      return [a.lng + (b.lng - a.lng) * t, a.lat + (b.lat - a.lat) * t];
    }
  }
  const last = routeLine[routeLine.length - 1];
  return [last.lng, last.lat];
}

export const runners: Runner[] = [
  {
    id: "r-001",
    bib: 14,
    name: "Sigrid Halvorsen",
    country: "NO",
    category: "F",
    ageGroup: "F30-39",
    club: "Bergen Trail Club",
    status: "running",
    currentKm: 38.2,
    elapsedSeconds: 4 * 3600 + 8 * 60 + 12,
    lastCheckpointId: "cp5",
    paceSecondsPerKm: 388,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 52 * 60 + 14 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 48 * 60 + 22 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 41 * 60 + 8 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 24 * 60 + 51 },
      { checkpointId: "cp5", elapsedSeconds: 4 * 3600 + 1 * 60 + 30 },
    ],
  },
  {
    id: "r-002",
    bib: 7,
    name: "Magnus Eriksen",
    country: "NO",
    category: "M",
    ageGroup: "M30-39",
    club: "Oslo Skyrunners",
    status: "running",
    currentKm: 36.8,
    elapsedSeconds: 4 * 3600 + 9 * 60 + 4,
    lastCheckpointId: "cp4",
    paceSecondsPerKm: 396,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 50 * 60 + 8 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 46 * 60 + 12 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 42 * 60 + 55 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 28 * 60 + 14 },
    ],
  },
  {
    id: "r-003",
    bib: 22,
    name: "Anders Lund",
    country: "NO",
    category: "M",
    ageGroup: "M40-49",
    club: "Trondheim Fjell",
    status: "running",
    currentKm: 35.4,
    elapsedSeconds: 4 * 3600 + 9 * 60 + 50,
    lastCheckpointId: "cp4",
    paceSecondsPerKm: 401,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 53 * 60 + 41 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 51 * 60 + 5 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 48 * 60 + 18 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 32 * 60 + 40 },
    ],
  },
  {
    id: "r-004",
    bib: 41,
    name: "Emma Lindqvist",
    country: "SE",
    category: "F",
    ageGroup: "F20-29",
    club: "Stockholm Trail",
    status: "running",
    currentKm: 33.1,
    elapsedSeconds: 4 * 3600 + 10 * 60 + 22,
    lastCheckpointId: "cp4",
    paceSecondsPerKm: 419,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 56 * 60 + 2 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 56 * 60 + 18 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 58 * 60 + 41 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 41 * 60 + 12 },
    ],
  },
  {
    id: "r-005",
    bib: 3,
    name: "Lars Sundby",
    country: "NO",
    category: "M",
    ageGroup: "M30-39",
    status: "finished",
    currentKm: 42,
    elapsedSeconds: 3 * 3600 + 58 * 60 + 14,
    lastCheckpointId: "finish",
    paceSecondsPerKm: 340,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 47 * 60 + 50 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 40 * 60 + 5 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 28 * 60 + 18 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 9 * 60 + 41 },
      { checkpointId: "cp5", elapsedSeconds: 3 * 3600 + 42 * 60 + 12 },
      { checkpointId: "finish", elapsedSeconds: 3 * 3600 + 58 * 60 + 14 },
    ],
  },
  {
    id: "r-006",
    bib: 88,
    name: "Ingrid Solberg",
    country: "NO",
    category: "F",
    ageGroup: "F40-49",
    club: "Bergen Trail Club",
    status: "running",
    currentKm: 30.4,
    elapsedSeconds: 4 * 3600 + 11 * 60 + 8,
    lastCheckpointId: "cp3",
    paceSecondsPerKm: 432,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 58 * 60 + 12 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 1 * 60 + 8 },
      { checkpointId: "cp3", elapsedSeconds: 3 * 3600 + 4 * 60 + 21 },
    ],
  },
  {
    id: "r-007",
    bib: 56,
    name: "Tobias Berg",
    country: "DK",
    category: "M",
    ageGroup: "M20-29",
    status: "running",
    currentKm: 28.7,
    elapsedSeconds: 4 * 3600 + 12 * 60 + 1,
    lastCheckpointId: "cp3",
    paceSecondsPerKm: 442,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 59 * 60 + 30 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 3 * 60 + 18 },
      { checkpointId: "cp3", elapsedSeconds: 3 * 3600 + 7 * 60 + 50 },
    ],
  },
  {
    id: "r-008",
    bib: 102,
    name: "Maria Kowalski",
    country: "PL",
    category: "F",
    ageGroup: "F30-39",
    status: "running",
    currentKm: 26.3,
    elapsedSeconds: 4 * 3600 + 13 * 60 + 14,
    lastCheckpointId: "cp3",
    paceSecondsPerKm: 458,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 2 * 60 + 18 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 8 * 60 + 41 },
      { checkpointId: "cp3", elapsedSeconds: 3 * 3600 + 14 * 60 + 22 },
    ],
  },
  {
    id: "r-009",
    bib: 31,
    name: "Henrik Storm",
    country: "NO",
    category: "M",
    ageGroup: "M50-59",
    club: "Tromsø Trail Veterans",
    status: "running",
    currentKm: 23.1,
    elapsedSeconds: 4 * 3600 + 14 * 60 + 30,
    lastCheckpointId: "cp2",
    paceSecondsPerKm: 471,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 4 * 60 + 8 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 14 * 60 + 50 },
    ],
  },
  {
    id: "r-010",
    bib: 19,
    name: "Sofia Andersson",
    country: "SE",
    category: "F",
    ageGroup: "F30-39",
    status: "dnf",
    currentKm: 16.2,
    elapsedSeconds: 1 * 3600 + 58 * 60 + 41,
    lastCheckpointId: "cp2",
    paceSecondsPerKm: 0,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 1 * 60 + 8 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 58 * 60 + 41 },
    ],
  },
  {
    id: "r-011",
    bib: 64,
    name: "Karl Bjørnstad",
    country: "NO",
    category: "M",
    ageGroup: "M40-49",
    status: "running",
    currentKm: 20.5,
    elapsedSeconds: 4 * 3600 + 15 * 60 + 12,
    lastCheckpointId: "cp2",
    paceSecondsPerKm: 482,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 5 * 60 + 41 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 18 * 60 + 22 },
    ],
  },
  {
    id: "r-012",
    bib: 77,
    name: "Linn Mathisen",
    country: "NO",
    category: "F",
    ageGroup: "F20-29",
    status: "running",
    currentKm: 18.4,
    elapsedSeconds: 4 * 3600 + 15 * 60 + 50,
    lastCheckpointId: "cp2",
    paceSecondsPerKm: 491,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 7 * 60 + 18 },
      { checkpointId: "cp2", elapsedSeconds: 2 * 3600 + 22 * 60 + 5 },
    ],
  },
  {
    id: "r-013",
    bib: 5,
    name: "Erik Vinter",
    country: "NO",
    category: "M",
    ageGroup: "M30-39",
    status: "finished",
    currentKm: 42,
    elapsedSeconds: 4 * 3600 + 1 * 60 + 8,
    lastCheckpointId: "finish",
    paceSecondsPerKm: 344,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 48 * 60 + 22 },
      { checkpointId: "cp2", elapsedSeconds: 1 * 3600 + 41 * 60 + 18 },
      { checkpointId: "cp3", elapsedSeconds: 2 * 3600 + 30 * 60 + 5 },
      { checkpointId: "cp4", elapsedSeconds: 3 * 3600 + 11 * 60 + 41 },
      { checkpointId: "cp5", elapsedSeconds: 3 * 3600 + 44 * 60 + 18 },
      { checkpointId: "finish", elapsedSeconds: 4 * 3600 + 1 * 60 + 8 },
    ],
  },
  {
    id: "r-014",
    bib: 111,
    name: "Pia Nyström",
    country: "FI",
    category: "F",
    ageGroup: "F30-39",
    status: "running",
    currentKm: 14.7,
    elapsedSeconds: 4 * 3600 + 16 * 60 + 22,
    lastCheckpointId: "cp1",
    paceSecondsPerKm: 514,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 10 * 60 + 5 },
    ],
  },
  {
    id: "r-015",
    bib: 48,
    name: "Johan Dahl",
    country: "NO",
    category: "M",
    ageGroup: "M50-59",
    status: "running",
    currentKm: 11.8,
    elapsedSeconds: 4 * 3600 + 16 * 60 + 55,
    lastCheckpointId: "cp1",
    paceSecondsPerKm: 528,
    splits: [
      { checkpointId: "cp1", elapsedSeconds: 1 * 3600 + 12 * 60 + 41 },
    ],
  },
];

type Trajectory = { km: number; t: number }[];

function buildTrajectory(r: Runner): Trajectory {
  const path: Trajectory = [{ km: 0, t: 0 }];
  for (const s of r.splits) {
    const cp = checkpoints.find((c) => c.id === s.checkpointId);
    if (cp) path.push({ km: cp.km, t: s.elapsedSeconds });
  }
  const lastKm = path[path.length - 1]?.km ?? 0;
  if (r.status === "running" && r.currentKm > lastKm) {
    path.push({ km: r.currentKm, t: race.elapsedSeconds });
  }
  return path;
}

const trajectoryCache = new globalThis.Map<string, Trajectory>();
function getTrajectory(r: Runner): Trajectory {
  const cached = trajectoryCache.get(r.id);
  if (cached) return cached;
  const t = buildTrajectory(r);
  trajectoryCache.set(r.id, t);
  return t;
}

export function runnerKmAtTime(r: Runner, t: number): number | null {
  if (t < 0) return null;
  const path = getTrajectory(r);
  if (path.length === 0) return null;
  if (t < path[0].t) return null;
  for (let i = 0; i < path.length - 1; i++) {
    if (t <= path[i + 1].t) {
      const span = path[i + 1].t - path[i].t;
      const u = span === 0 ? 0 : (t - path[i].t) / span;
      return path[i].km + (path[i + 1].km - path[i].km) * u;
    }
  }
  return path[path.length - 1].km;
}

export const maxRunnerTime: number = (() => {
  let m = race.elapsedSeconds;
  for (const r of runners) {
    const last = r.splits[r.splits.length - 1]?.elapsedSeconds ?? 0;
    if (last > m) m = last;
  }
  return Math.max(m, race.elapsedSeconds) + 30 * 60;
})();

export function elevationAtKm(km: number): number {
  if (km <= 0) return elevationProfile[0].elevation;
  const last = elevationProfile[elevationProfile.length - 1];
  if (km >= last.km) return last.elevation;
  for (let i = 0; i < elevationProfile.length - 1; i++) {
    const a = elevationProfile[i];
    const b = elevationProfile[i + 1];
    if (km >= a.km && km <= b.km) {
      const span = b.km - a.km;
      const t = span === 0 ? 0 : (km - a.km) / span;
      return a.elevation + (b.elevation - a.elevation) * t;
    }
  }
  return last.elevation;
}

export function gradeAtKm(km: number): number {
  const delta = 0.1;
  const e1 = elevationAtKm(km - delta);
  const e2 = elevationAtKm(km + delta);
  const dHoriz = 2 * delta * 1000;
  return (Math.atan2(e2 - e1, dHoriz) * 180) / Math.PI;
}

export const races: RaceInfo[] = [race];

export function getRace(slug: string): RaceInfo | undefined {
  return races.find((r) => r.slug === slug);
}

export function getRunner(id: string): Runner | undefined {
  return runners.find((r) => r.id === id);
}

export function getRunnerByBib(bib: number): Runner | undefined {
  return runners.find((r) => r.bib === bib);
}

export function getCheckpoint(id: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.id === id);
}

export function rankedRunners(): Runner[] {
  return [...runners].sort((a, b) => {
    const rank = (r: Runner) => {
      if (r.status === "finished") return 0;
      if (r.status === "running") return 1;
      if (r.status === "dnf") return 2;
      return 3;
    };
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (a.status === "finished") return a.elapsedSeconds - b.elapsedSeconds;
    if (a.status === "running") return b.currentKm - a.currentKm;
    return a.bib - b.bib;
  });
}
