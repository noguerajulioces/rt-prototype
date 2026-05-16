"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { RaceHeader } from "./RaceHeader";
import { IconRail, type RailTab } from "./IconRail";
import { Sidebar } from "./Sidebar";
import { RaceMap } from "./RaceMap";
import { BottomStrip } from "./BottomStrip";
import { RunnerDialog } from "./RunnerDialog";
import { MobileLayout } from "./MobileLayout";
import { MapOverlays } from "./MapOverlays";
import { RaceSponsorDialog } from "./RaceSponsorDialog";
import { Button } from "@/components/ui/button";
import { useT } from "./LocaleContext";
import { useReplay } from "./ReplayContext";
import { useIsMobile } from "@/lib/useMediaQuery";
import { getRunnerByBib, race, type Runner } from "@/lib/mock-data";

export function AppShell() {
  const isMobile = useIsMobile();
  const { setFollowedRunner } = useReplay();
  const searchParams = useSearchParams();

  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const followParam = searchParams.get("follow");
    if (!followParam) return;
    const bib = Number.parseInt(followParam, 10);
    if (Number.isNaN(bib)) return;
    const r = getRunnerByBib(bib);
    if (!r) return;
    setFollowedRunner(r.id);
    setFavourites((prev) => {
      if (prev.has(r.id)) return prev;
      const next = new Set(prev);
      next.add(r.id);
      return next;
    });
  }, [searchParams, setFollowedRunner]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRunnerClick = useCallback((r: Runner) => {
    setSelectedRunner(r);
    setDialogOpen(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <RaceHeader race={race} />
      {isMobile ? (
        <MobileLayout
          favourites={favourites}
          onFavouriteToggle={toggleFavourite}
          onRunnerClick={handleRunnerClick}
        />
      ) : (
        <DesktopLayout
          favourites={favourites}
          onFavouriteToggle={toggleFavourite}
          onRunnerClick={handleRunnerClick}
        />
      )}
      <RunnerDialog
        runner={selectedRunner}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <RaceSponsorDialog race={race} />
    </div>
  );
}

function DesktopLayout({
  favourites,
  onFavouriteToggle,
  onRunnerClick,
}: {
  favourites: Set<string>;
  onFavouriteToggle: (id: string) => void;
  onRunnerClick: (r: Runner) => void;
}) {
  const { t } = useT();
  const [tab, setTab] = useState<RailTab>("participants");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-0 flex-1">
      <IconRail
        active={tab}
        onChange={setTab}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
      <Sidebar
        tab={tab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        favourites={favourites}
        onFavouriteToggle={onFavouriteToggle}
        onRunnerClick={onRunnerClick}
      />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="relative flex-1 min-h-0">
          <RaceMap
            favourites={favourites}
            onRunnerDetails={onRunnerClick}
          />
          <MapOverlays />
          {!sidebarOpen && (
            <Button
              variant="outline"
              size="icon"
              aria-label={t("rail.openPanel")}
              onClick={() => setSidebarOpen(true)}
              className="rt-press absolute left-3 top-3 z-20 h-9 w-9 rounded-xl border-line-soft bg-bg2/90 backdrop-blur"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <BottomStrip />
      </div>
    </div>
  );
}
