import type { Metadata } from "next";
import Image from "next/image";
import { RacesListing } from "@/components/RacesListing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { races } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "RaceTracker · Seguimiento en vivo de carreras",
  description:
    "Sigue carreras de trail running, ultra y triatlón en tiempo real. Mira la posición de tus corredores favoritos durante toda la carrera.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "RaceTracker",
    description:
      "Seguimiento en vivo de carreras de trail running, ultra y triatlón.",
    type: "website",
    siteName: "RaceTracker",
  },
};

export default function Home() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center justify-between sm:mb-10">
          <Image
            src="/logo.png"
            alt="RaceTracker"
            width={180}
            height={40}
            priority
            className="h-8 w-auto sm:h-10"
          />
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="mb-10 max-w-xl sm:mb-14">
          <h1 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[56px]">
            Race tracking,{" "}
            <span className="text-fg3">live and lived-in.</span>
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-fg2 sm:mt-5 sm:text-[15px]">
            Trail running, ultra, and triathlon — across Norway and beyond.
            Follow your runners now, or revisit the archive.
          </p>
        </div>

        <RacesListing races={races} />

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-6 text-xs text-fg3 sm:mt-20">
          <span>
            Organizing a race?{" "}
            <span className="text-foreground">Get in touch</span> to list your
            event.
          </span>
          <span className="rt-mono tabular">RaceTracker · v0.4</span>
        </footer>
      </div>
    </div>
  );
}
