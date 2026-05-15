"use client";

import {
  Users,
  BarChart3,
  History,
  Settings,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useT } from "./LocaleContext";
import { useSettings } from "./SettingsContext";

export type RailTab = "participants" | "stats" | "history" | "settings";

type TabDef = { key: RailTab; tKey: string; icon: LucideIcon };

const raceTabs: TabDef[] = [
  { key: "participants", tKey: "rail.participants", icon: Users },
  { key: "stats", tKey: "rail.stats", icon: BarChart3 },
  { key: "history", tKey: "rail.history", icon: History },
];

const settingsTab: TabDef = {
  key: "settings",
  tKey: "rail.settings",
  icon: Settings,
};

export function IconRail({
  active,
  onChange,
  sidebarOpen,
  onToggleSidebar,
}: {
  active: RailTab;
  onChange: (tab: RailTab) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const { t } = useT();
  const { showElevation, set } = useSettings();

  const renderPanelButton = (tab: TabDef) => {
    const Icon = tab.icon;
    const isActive = active === tab.key && sidebarOpen;
    const label = t(tab.tKey);
    return (
      <Tooltip key={tab.key}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => {
              if (active === tab.key && sidebarOpen) onToggleSidebar();
              else {
                onChange(tab.key);
                if (!sidebarOpen) onToggleSidebar();
              }
            }}
            className={cn(
              "h-9 w-9 rounded-md",
              isActive
                ? "bg-primary/15 text-primary hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-2">
      {raceTabs.map(renderPanelButton)}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("settings.showElevation")}
            aria-pressed={showElevation}
            onClick={() => set("showElevation", !showElevation)}
            className={cn(
              "h-9 w-9 rounded-md",
              showElevation
                ? "bg-primary/15 text-primary hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Mountain className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {t("settings.showElevation")}
        </TooltipContent>
      </Tooltip>

      <Separator className="mt-auto my-1 w-6" />
      {renderPanelButton(settingsTab)}
    </nav>
  );
}
