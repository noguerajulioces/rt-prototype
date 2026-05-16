"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Course } from "@/lib/mock-data";

const ALL = "all";

type CourseCtx = {
  /* The current selection — null means "Todos los cursos" (all). */
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  courses: Course[];
  selectedCourse: Course | null;
};

const Ctx = createContext<CourseCtx | null>(null);

export function CourseProvider({
  courses,
  children,
}: {
  courses?: Course[];
  children: React.ReactNode;
}) {
  const list = courses ?? [];
  const [selectedCourseId, setSelectedCourseIdState] = useState<string | null>(
    null,
  );

  const setSelectedCourseId = useCallback((id: string | null) => {
    setSelectedCourseIdState(id === ALL ? null : id);
  }, []);

  const value = useMemo<CourseCtx>(() => {
    const selectedCourse = selectedCourseId
      ? (list.find((c) => c.id === selectedCourseId) ?? null)
      : null;
    return {
      selectedCourseId,
      setSelectedCourseId,
      courses: list,
      selectedCourse,
    };
  }, [selectedCourseId, setSelectedCourseId, list]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCourse(): CourseCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    /* When the provider is not mounted (e.g. home page) return inert defaults
       so consumers don't need to gate every call. */
    return {
      selectedCourseId: null,
      setSelectedCourseId: () => {},
      courses: [],
      selectedCourse: null,
    };
  }
  return ctx;
}
