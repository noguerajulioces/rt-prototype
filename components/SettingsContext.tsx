"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Settings = {
  showLeader: boolean;
  showBib: boolean;
  predictive: boolean;
  showFavTracks: boolean;
  imperial: boolean;
  showAllNames: boolean;
  showRunnersOnProfile: boolean;
  showElevation: boolean;
  showRouteDirection: boolean;
};

type SettingsCtx = Settings & {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const defaultSettings: Settings = {
  showLeader: true,
  showBib: true,
  predictive: false,
  showFavTracks: true,
  imperial: false,
  showAllNames: false,
  showRunnersOnProfile: false,
  showElevation: false,
  showRouteDirection: true,
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Settings>(defaultSettings);

  const set = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setState((s) => ({ ...s, [key]: value }));
    },
    [],
  );

  const value = useMemo<SettingsCtx>(() => ({ ...state, set }), [state, set]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
