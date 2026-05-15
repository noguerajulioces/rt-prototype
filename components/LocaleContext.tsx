"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { locales, translator, type Locale } from "@/lib/i18n";

type Vars = Record<string, string | number>;

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Vars) => string;
};

const STORAGE_KEY = "racetracker:locale";
const Ctx = createContext<LocaleCtx | null>(null);

function isLocale(v: string | null): v is Locale {
  return v !== null && (locales as readonly string[]).includes(v);
}

export function LocaleProvider({
  defaultLocale,
  children,
}: {
  defaultLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // ignore — non-fatal (private mode, etc.)
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LocaleCtx>(
    () => ({ locale, setLocale, t: translator(locale) }),
    [locale, setLocale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used within LocaleProvider");
  return ctx;
}
