import type { Metadata } from "next";
import Link from "next/link";
import { RaceTrackerMark } from "@/components/RaceTrackerLogo";
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
      <div className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <header>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <RaceTrackerMark className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-tight">
              RaceTracker
            </span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
            Seguimiento en vivo
          </h1>
          <p className="mt-3 max-w-xl text-fg2">
            Sigue a tus corredores en tiempo real durante carreras de trail
            running, ultra y triatlón en Noruega y el resto del mundo.
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.1em] text-fg3">
            Carreras
          </h2>
          <ul className="space-y-2.5">
            {races.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/races/${r.slug}`}
                  className="rt-press group block rounded-2xl border border-line-soft bg-card p-5 transition-colors hover:border-[color-mix(in_oklch,var(--accent-color),transparent_60%)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rt-live-pill">
                          <span className="rt-live-dot" />
                          LIVE
                        </span>
                      </div>
                      <div className="mt-2 text-lg font-semibold tracking-tight">
                        {r.name}{" "}
                        <span className="rt-mono text-fg3 font-medium">
                          {r.edition}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-fg2">
                        {r.location}
                      </div>
                    </div>
                    <div className="rt-mono shrink-0 text-right text-[11px] tabular text-fg3">
                      <div>{r.date}</div>
                      <div className="mt-1">
                        <span className="text-fg2">{r.distance} km</span> ·{" "}
                        {r.elevationGain} m D+
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-line-soft pt-6 text-xs text-fg3">
          ¿Sos organizador de una carrera?{" "}
          <span className="text-foreground">Contactanos</span> para sumar tu
          evento a la plataforma.
        </footer>
      </div>
    </div>
  );
}
