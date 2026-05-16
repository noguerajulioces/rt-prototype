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
      <div className="mx-auto max-w-5xl px-6 py-14">
        <header className="mb-10 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="RaceTracker"
            width={180}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="mb-14 max-w-xl">
          <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[56px]">
            Race tracking,{" "}
            <span className="text-fg3">live and lived-in.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-fg2">
            Trail running, ultra, and triathlon — across Norway and beyond.
            Follow your runners now, or revisit the archive.
          </p>
        </div>

        <RacesListing races={races} />

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-6 text-xs text-fg3">
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
