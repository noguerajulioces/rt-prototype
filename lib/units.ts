export const KM_TO_MI = 0.621371;
export const M_TO_FT = 3.28084;

export function distanceValue(km: number, imperial: boolean): number {
  return imperial ? km * KM_TO_MI : km;
}

export function elevationValue(m: number, imperial: boolean): number {
  return imperial ? m * M_TO_FT : m;
}

export function distanceUnit(imperial: boolean): "mi" | "km" {
  return imperial ? "mi" : "km";
}

export function elevationUnit(imperial: boolean): "ft" | "m" {
  return imperial ? "ft" : "m";
}

export function formatDistance(
  km: number,
  imperial: boolean,
  fractionDigits = 1,
): string {
  return `${distanceValue(km, imperial).toFixed(fractionDigits)} ${distanceUnit(imperial)}`;
}

export function formatElevation(m: number, imperial: boolean): string {
  return `${Math.round(elevationValue(m, imperial))} ${elevationUnit(imperial)}`;
}
