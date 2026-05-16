"use client";

import { useState } from "react";
import { Users, BarChart3, History, Settings } from "lucide-react";
import { RaceMap } from "./RaceMap";
import { ReplayTimeline } from "./ReplayTimeline";
import {
  ParticipantsPanel,
  StatsPanel,
  HistoryPanel,
  SettingsPanel,
} from "./Sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useT } from "./LocaleContext";
import type { Runner } from "@/lib/mock-data";

type MobilePanel = "participants" | "stats" | "history" | "settings" | null;

export function MobileLayout({
  favourites,
  onFavouriteToggle,
  onRunnerClick,
}: {
  favourites: Set<string>;
  onFavouriteToggle: (id: string) => void;
  onRunnerClick: (r: Runner) => void;
}) {
  const [openPanel, setOpenPanel] = useState<MobilePanel>(null);
  const { t } = useT();

  const closePanel = () => setOpenPanel(null);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative flex-1 min-h-0">
          <RaceMap
            favourites={favourites}
            onRunnerDetails={(r) => {
              onRunnerClick(r);
            }}
          />
        </div>
        <ReplayTimeline />
        <MobileBottomBar
          openPanel={openPanel}
          onOpen={setOpenPanel}
        />
      </div>

      <Drawer
        open={openPanel === "participants"}
        onOpenChange={(o) => !o && closePanel()}
      >
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("rail.participants")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ParticipantsPanel
              favourites={favourites}
              onFavouriteToggle={onFavouriteToggle}
              onRunnerClick={(r) => {
                closePanel();
                onRunnerClick(r);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={openPanel === "stats"}
        onOpenChange={(o) => !o && closePanel()}
      >
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("rail.stats")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <StatsPanel />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={openPanel === "history"}
        onOpenChange={(o) => !o && closePanel()}
      >
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("rail.history")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <HistoryPanel />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={openPanel === "settings"}
        onOpenChange={(o) => !o && closePanel()}
      >
        <DrawerContent className="h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("rail.settings")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <SettingsPanel />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function MobileBottomBar({
  openPanel,
  onOpen,
}: {
  openPanel: MobilePanel;
  onOpen: (panel: MobilePanel) => void;
}) {
  const { t } = useT();
  const buttons: { key: Exclude<MobilePanel, null>; label: string; icon: typeof Users }[] = [
    { key: "participants", label: t("rail.participants"), icon: Users },
    { key: "stats", label: t("rail.stats"), icon: BarChart3 },
    { key: "history", label: t("rail.history"), icon: History },
    { key: "settings", label: t("rail.settings"), icon: Settings },
  ];

  return (
    <nav
      className="grid shrink-0 grid-cols-4 gap-1 border-t border-line-soft bg-background px-2 pb-2.5 pt-1.5"
      aria-label="Mobile navigation"
    >
      {buttons.map((b) => {
        const Icon = b.icon;
        const active = openPanel === b.key;
        return (
          <button
            key={b.key}
            type="button"
            onClick={() => onOpen(active ? null : b.key)}
            className={cn(
              "rt-press relative flex flex-col items-center gap-1 rounded-xl px-1 py-2",
              active ? "text-primary" : "text-fg3 hover:text-foreground",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-[3px] w-[22px] -translate-x-1/2 rounded-full bg-primary"
              />
            )}
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className={cn(
                "text-[10px] tracking-tight",
                active ? "font-semibold" : "font-medium",
              )}
            >
              {b.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
