"use client";

import { useState } from "react";
import { Check, Copy, Link2, MessageCircle, Share2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ShareButton({
  url,
  title,
  className,
}: {
  url?: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl =
    url ??
    (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title ?? "RaceTracker";

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        setOpen(false);
      } catch {
        /* user cancelled — leave popover open */
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const enc = encodeURIComponent(shareUrl);
  const encT = encodeURIComponent(shareTitle);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Compartir"
          className={cn("rt-press h-9 w-9 rounded-xl", className)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[280px] border-line-soft bg-popover p-3"
      >
        <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-fg3">
          Compartir esta carrera
        </div>

        <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-line-soft bg-bg2 p-1">
          <span className="rt-mono ml-1 flex-1 truncate text-[11px] tabular text-fg3">
            {shareUrl.replace(/^https?:\/\//, "")}
          </span>
          <Button
            size="sm"
            onClick={handleCopy}
            className={cn(
              "rt-press h-7 gap-1.5 rounded-lg px-2 text-[11px] font-semibold",
              copied
                ? "bg-[color-mix(in_oklch,var(--running),transparent_80%)] text-[color:var(--running)] hover:bg-[color-mix(in_oklch,var(--running),transparent_80%)]"
                : "bg-primary text-primary-foreground",
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copiar
              </>
            )}
          </Button>
        </div>

        <Separator className="my-3 bg-line-soft" />

        <div className="grid grid-cols-3 gap-1.5">
          <ShareTile
            label="WhatsApp"
            color="oklch(0.72 0.16 145)"
            icon={<MessageCircle className="h-4 w-4" />}
            href={`https://wa.me/?text=${encT}%20${enc}`}
          />
          <ShareTile
            label="X"
            color="oklch(0.85 0.005 258)"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="h-3.5 w-3.5"
              >
                <path d="M18 3h3l-7.5 8.6L22 21h-6.6l-5.2-6.8L4.2 21H1l8-9.2L1 3h6.7l4.7 6.2L18 3zm-1.1 16h1.7L7.2 5H5.4l11.5 14z" />
              </svg>
            }
            href={`https://twitter.com/intent/tweet?text=${encT}&url=${enc}`}
          />
          <ShareTile
            label="Enlace"
            color="var(--accent-color)"
            icon={<Link2 className="h-4 w-4" />}
            onClick={handleNativeShare}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ShareTile({
  label,
  icon,
  color,
  href,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  onClick?: () => void;
}) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={onClick}
      className="rt-press flex flex-col items-center gap-1 rounded-xl border border-line-soft bg-bg2 p-2 hover:bg-bg3"
    >
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-full"
        style={{
          background: `color-mix(in oklch, ${color}, transparent 80%)`,
          color,
        }}
      >
        {icon}
      </span>
      <span className="text-[10.5px] font-semibold text-fg2">{label}</span>
    </Comp>
  );
}
