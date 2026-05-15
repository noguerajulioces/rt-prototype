"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettings, type Settings as SettingsType } from "./SettingsContext";
import { useT } from "./LocaleContext";

export function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const { t } = useT();

  return (
    <div className="space-y-3">
      <div>
        <SectionTitle>{t("settings.section.map")}</SectionTitle>
        <ToggleRow id="show-leader" tKey="settings.showLeader" k="showLeader" />
        <ToggleRow id="show-bib" tKey="settings.showBib" k="showBib" />
        <ToggleRow id="predictive" tKey="settings.predictive" k="predictive" />
        <ToggleRow
          id="fav-tracks"
          tKey="settings.favTracks"
          k="showFavTracks"
        />
        <ToggleRow id="all-names" tKey="settings.allNames" k="showAllNames" />
        <ToggleRow
          id="runners-on-profile"
          tKey="settings.runnersOnProfile"
          k="showRunnersOnProfile"
        />
      </div>
      <Separator />
      <div>
        <SectionTitle>{t("settings.section.units")}</SectionTitle>
        <ToggleRow id="imperial" tKey="settings.imperial" k="imperial" />
      </div>
      <Separator />
      <div>
        <SectionTitle>{t("settings.section.theme")}</SectionTitle>
        <div className="grid grid-cols-3 gap-1.5">
          <ThemeBtn
            active={theme === "light"}
            onClick={() => setTheme("light")}
            icon={<Sun className="h-3.5 w-3.5" />}
            label={t("settings.theme.light")}
          />
          <ThemeBtn
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
            icon={<Moon className="h-3.5 w-3.5" />}
            label={t("settings.theme.dark")}
          />
          <ThemeBtn
            active={theme === "system"}
            onClick={() => setTheme("system")}
            icon={<Monitor className="h-3.5 w-3.5" />}
            label={t("settings.theme.system")}
          />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

function ToggleRow({
  id,
  tKey,
  k,
}: {
  id: string;
  tKey: string;
  k: keyof SettingsType;
}) {
  const s = useSettings();
  const { t } = useT();
  return (
    <div className="flex items-center justify-between py-1.5">
      <Label htmlFor={id} className="text-sm font-normal">
        {t(tKey)}
      </Label>
      <Switch
        id={id}
        checked={s[k]}
        onCheckedChange={(v) => s.set(k, v)}
      />
    </div>
  );
}

function ThemeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-8 gap-1 text-xs"
    >
      {icon}
      {label}
    </Button>
  );
}
