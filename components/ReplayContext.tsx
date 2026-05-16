"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { maxRunnerTime, race } from "@/lib/mock-data";

type ReplayState = {
  raceTime: number;
  setRaceTime: (t: number) => void;
  playing: boolean;
  togglePlay: () => void;
  goLive: () => void;
  isLive: boolean;
  maxTime: number;
  speed: number;
  setSpeed: (s: number) => void;
  followedRunner: string | null;
  setFollowedRunner: (id: string | null) => void;
};

const ReplayCtx = createContext<ReplayState | null>(null);

export function ReplayProvider({ children }: { children: React.ReactNode }) {
  const [raceTime, setRaceTimeState] = useState<number>(race.elapsedSeconds);
  const [playing, setPlaying] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [followedRunner, setFollowedRunner] = useState<string | null>(null);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  const setRaceTime = useCallback((t: number) => {
    setLiveMode(false);
    setRaceTimeState(Math.min(Math.max(t, 0), maxRunnerTime));
  }, []);

  const togglePlay = useCallback(() => {
    setLiveMode(false);
    setPlaying((p) => !p);
  }, []);

  const goLive = useCallback(() => {
    setPlaying(false);
    setLiveMode(true);
    setRaceTimeState(race.elapsedSeconds);
  }, []);

  const running = playing || liveMode;
  const effectiveSpeed = liveMode ? 1 : speed;

  useEffect(() => {
    if (!running) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (last.current === null) last.current = ts;
      const dt = (ts - last.current) / 1000;
      last.current = ts;
      setRaceTimeState((prev) => {
        const next = prev + dt * effectiveSpeed;
        if (next >= maxRunnerTime) {
          setPlaying(false);
          setLiveMode(false);
          return maxRunnerTime;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
    };
  }, [running, effectiveSpeed]);

  const value = useMemo<ReplayState>(
    () => ({
      raceTime,
      setRaceTime,
      playing,
      togglePlay,
      goLive,
      isLive: liveMode,
      maxTime: maxRunnerTime,
      speed,
      setSpeed,
      followedRunner,
      setFollowedRunner,
    }),
    [
      raceTime,
      setRaceTime,
      playing,
      togglePlay,
      goLive,
      liveMode,
      speed,
      followedRunner,
    ],
  );

  return <ReplayCtx.Provider value={value}>{children}</ReplayCtx.Provider>;
}

export function useReplay() {
  const ctx = useContext(ReplayCtx);
  if (!ctx) throw new Error("useReplay must be used within ReplayProvider");
  return ctx;
}
