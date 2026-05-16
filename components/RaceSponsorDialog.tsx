"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
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
import { RaceTrackerMark } from "./RaceTrackerLogo";
import type { RaceInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const dismissKey = (slug: string) => `racetracker:sponsor-seen:${slug}`;

export function RaceSponsorDialog({ race }: { race: RaceInfo }) {
  const sponsor = race.sponsor;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sponsor) return;
    try {
      if (sessionStorage.getItem(dismissKey(race.slug))) return;
    } catch {
      /* sessionStorage unavailable — fall through and open. */
    }
    setOpen(true);
  }, [race.slug, sponsor]);

  if (!sponsor) return null;

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(dismissKey(race.slug), "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
        else setOpen(true);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[520px] overflow-hidden border-line-soft bg-bg2 p-0"
      >
        <div
          className={cn(
            "relative h-[260px] overflow-hidden bg-bg3",
            sponsor.imageUrl && "bg-cover bg-center",
          )}
          style={
            sponsor.imageUrl
              ? { backgroundImage: `url(${sponsor.imageUrl})` }
              : undefined
          }
        >
          {!sponsor.imageUrl && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--accent-color),transparent_82%),transparent_70%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg2 via-bg2/40 to-transparent" />

          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <RaceTrackerMark className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              RaceTracker
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-center gap-2">
              <span className="rt-mono inline-flex items-center rounded-full border border-[color-mix(in_oklch,var(--accent-color),transparent_55%)] bg-[color-mix(in_oklch,var(--accent-color),transparent_82%)] px-2 py-[2px] text-[9.5px] font-bold uppercase tracking-[0.16em] text-primary">
                Sponsor
              </span>
              <span className="rt-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
                {sponsor.name}
              </span>
            </div>
            <DialogTitle className="mt-2 text-[26px] font-bold leading-[1.05] tracking-tight">
              {race.name}{" "}
              <span className="rt-mono text-fg2 font-semibold">
                {race.edition}
              </span>
            </DialogTitle>
            {sponsor.tagline && (
              <DialogDescription className="mt-1 text-[13px] text-fg2">
                {sponsor.tagline}
              </DialogDescription>
            )}
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>
            {race.name} {race.edition} · {sponsor.name}
          </DialogTitle>
          <DialogDescription>
            {sponsor.tagline ?? race.location}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 px-5 pt-4">
          <Stat label="Distancia" value={`${race.distance} km`} />
          <Stat label="D+" value={`${race.elevationGain} m`} />
          <Stat label="Inscriptos" value={race.totalRunners.toLocaleString()} />
        </div>

        <DialogFooter className="gap-2 px-5 pb-5 pt-4 sm:justify-between">
          {sponsor.websiteUrl ? (
            <a
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rt-press inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {sponsor.websiteLabel ?? sponsor.websiteUrl}
            </a>
          ) : (
            <span />
          )}
          <DialogClose asChild>
            <Button onClick={close} className="rt-press h-9 rounded-xl px-5">
              Empezar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line-soft bg-bg3/60 px-3 py-2">
      <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-fg3">
        {label}
      </div>
      <div className="rt-mono mt-0.5 text-[15px] font-semibold tabular text-foreground">
        {value}
      </div>
    </div>
  );
}
