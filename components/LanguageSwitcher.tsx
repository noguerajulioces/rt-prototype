"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "./LocaleContext";
import { locales, localeLabels } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useT();
  const current = localeLabels[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Idioma actual: ${current.native}`}
          className={cn(
            "h-7 gap-1 px-2 text-xs font-medium",
            className,
          )}
        >
          <span aria-hidden className="text-sm leading-none">
            {current.flag}
          </span>
          <span className="uppercase tabular tracking-wider">{locale}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {locales.map((l) => {
          const meta = localeLabels[l];
          const active = l === locale;
          return (
            <DropdownMenuItem
              key={l}
              onClick={() => setLocale(l)}
              className={cn(active && "font-semibold")}
            >
              <span aria-hidden className="mr-2">
                {meta.flag}
              </span>
              <span className="flex-1">{meta.native}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
