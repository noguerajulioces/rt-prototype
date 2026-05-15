"use client";

import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { useT } from "./LocaleContext";
import { checkpoints, race, type Runner } from "@/lib/mock-data";
import { flagEmoji, formatDuration } from "@/lib/format";

function timeOfDay(elapsedSeconds: number): string {
  const [hh, mm] = race.startedAt.split(":").map((s) => parseInt(s, 10));
  const startSec = hh * 3600 + mm * 60;
  const totalSec = startSec + elapsedSeconds;
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function RunnerDialog({
  runner,
  open,
  onOpenChange,
}: {
  runner: Runner | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { t } = useT();
  if (!runner) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl leading-none">{flagEmoji(runner.country)}</span>
                <span>{runner.name}</span>
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                #{runner.bib} ·{" "}
                {t(runner.category === "M" ? "category.M" : "category.F")} ·{" "}
                {runner.ageGroup}
              </DialogDescription>
            </div>
            <StatusBadge status={runner.status} />
          </div>
        </DialogHeader>
        <Separator />
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dialog.splits")}
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-1.5 font-medium">{t("dialog.col.point")}</th>
                  <th className="px-3 py-1.5 text-right font-medium">{t("dialog.col.time")}</th>
                  <th className="px-3 py-1.5 text-right font-medium">{t("dialog.col.timeOfDay")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <TimeRow label={t("dialog.start")} elapsed={0} />
                {checkpoints
                  .filter((c) => c.type !== "start")
                  .map((cp) => {
                    const split = runner.splits.find(
                      (s) => s.checkpointId === cp.id,
                    );
                    return (
                      <TimeRow
                        key={cp.id}
                        label={cp.id === "finish" ? t("dialog.finish") : cp.name}
                        elapsed={split?.elapsedSeconds}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/races/${race.slug}/corredor/${runner.id}`}>
              <LinkIcon className="h-3.5 w-3.5" />
              {t("dialog.runnerPage")}
            </Link>
          </Button>
          <DialogClose asChild>
            <Button size="sm">{t("dialog.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TimeRow({ label, elapsed }: { label: string; elapsed?: number }) {
  const passed = elapsed !== undefined;
  return (
    <tr className={passed ? undefined : "opacity-40"}>
      <td className="px-3 py-1.5 font-medium">{label}</td>
      <td className="px-3 py-1.5 text-right font-mono tabular">
        {passed ? formatDuration(elapsed) : "—"}
      </td>
      <td className="px-3 py-1.5 text-right font-mono tabular text-muted-foreground">
        {passed ? timeOfDay(elapsed) : "—"}
      </td>
    </tr>
  );
}
