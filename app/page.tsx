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
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-10">
        <header>
          <div className="flex items-center gap-2 text-primary">
            <RaceTrackerMark className="h-7 w-7" />
            <span className="text-base font-extrabold tracking-tight">
              RaceTracker
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Seguimiento en vivo
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Sigue a tus corredores en tiempo real durante carreras de trail
            running, ultra y triatlón en Noruega y el resto del mundo.
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Carreras
          </h2>
          <ul className="space-y-2">
            {races.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/races/${r.slug}`}
                  className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">
                        {r.name}{" "}
                        <span className="font-mono text-muted-foreground">
                          {r.edition}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {r.location}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground tabular">
                      <div>{r.date}</div>
                      <div className="mt-1">
                        {r.distance} km · {r.elevationGain} m D+
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
          ¿Sos organizador de una carrera?{" "}
          <span className="text-foreground">Contactanos</span> para sumar tu
          evento a la plataforma.
        </footer>
      </div>
    </div>
  );
}
