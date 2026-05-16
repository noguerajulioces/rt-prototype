"use client";

import { ChevronDown, Check, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCourse } from "./CourseContext";
import { useT } from "./LocaleContext";
import { cn } from "@/lib/utils";

export function CoursePicker({ className }: { className?: string }) {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse } =
    useCourse();
  const { t } = useT();
  if (courses.length === 0) return null;

  const label =
    selectedCourse?.shortName ?? selectedCourse?.name ?? t("course.allShort");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("course.select")}
          title={label}
          className={cn(
            "rt-press h-8 gap-1.5 rounded-full border-line-soft bg-bg2 px-2 text-[12px] font-semibold tracking-tight sm:px-3",
            className,
          )}
        >
          <Route className="h-3.5 w-3.5 text-fg3" />
          <span className="hidden sm:inline">{label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[14rem]">
        <DropdownMenuLabel className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-fg3">
          {t("course.title")}
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setSelectedCourseId(null)}
          className={cn(
            "flex items-center justify-between",
            !selectedCourseId && "font-semibold",
          )}
        >
          <span>{t("course.all")}</span>
          {!selectedCourseId && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {courses.map((c) => {
          const active = selectedCourseId === c.id;
          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={cn(
                "flex items-center justify-between",
                active && "font-semibold",
              )}
            >
              <span className="flex flex-col">
                <span>{c.name}</span>
                <span className="rt-mono text-[10.5px] tabular text-fg3">
                  {c.distance} km · {c.elevationGain} m D+
                </span>
              </span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
