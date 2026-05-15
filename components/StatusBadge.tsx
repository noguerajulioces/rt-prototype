"use client";

import type { RunnerStatus } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useT } from "./LocaleContext";

const config: Record<
  RunnerStatus,
  { tKey: string; className: string; dot?: string }
> = {
  running: {
    tKey: "status.running",
    className: "border-success/40 bg-success/15 text-success",
    dot: "bg-success",
  },
  finished: {
    tKey: "status.finished",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  dnf: {
    tKey: "status.dnf",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
  "pre-race": {
    tKey: "status.preRace",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
};

export function StatusBadge({ status }: { status: RunnerStatus }) {
  const { t } = useT();
  const c = config[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5", c.className)}>
      {c.dot && (
        <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", c.dot)} />
      )}
      {t(c.tKey)}
    </Badge>
  );
}
