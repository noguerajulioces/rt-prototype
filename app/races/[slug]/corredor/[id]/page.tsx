import Link from "next/link";
import { notFound } from "next/navigation";
import {
  checkpoints,
  getCheckpoint,
  getRace,
  getRunner,
  races,
  runners,
} from "@/lib/mock-data";
import { formatDuration, formatPace, flagEmoji } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export function generateStaticParams() {
  const params: { slug: string; id: string }[] = [];
  for (const race of races) {
    for (const r of runners) {
      params.push({ slug: race.slug, id: r.id });
    }
  }
  return params;
}

export default async function CorredorPage(
  props: PageProps<"/races/[slug]/corredor/[id]">,
) {
  const { slug, id } = await props.params;
  const race = getRace(slug);
  if (!race) notFound();
  const runner = getRunner(id);
  if (!runner) notFound();

  const progress = (runner.currentKm / race.distance) * 100;
  const remainingKm = Math.max(0, race.distance - runner.currentKm);
  const etaSeconds =
    runner.status === "running" && runner.paceSecondsPerKm
      ? runner.elapsedSeconds + remainingKm * runner.paceSecondsPerKm
      : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        <Link
          href={`/races/${race.slug}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          ← Volver al mapa
        </Link>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card font-mono text-xl font-semibold tabular">
              #{runner.bib}
            </div>
            <div>
              <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <span>{flagEmoji(runner.country)}</span>
                <span>{runner.name}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {runner.category === "M" ? "Masculino" : "Femenino"} ·{" "}
                {runner.ageGroup}
                {runner.club ? ` · ${runner.club}` : ""}
              </div>
            </div>
          </div>
          <StatusBadge status={runner.status} />
        </header>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span className="tabular">
              {runner.currentKm.toFixed(1)} / {race.distance} km
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric
              label="Tiempo en carrera"
              value={formatDuration(runner.elapsedSeconds)}
              mono
            />
            <Metric
              label="Ritmo medio"
              value={formatPace(runner.paceSecondsPerKm)}
              mono
            />
            <Metric
              label="Restante"
              value={
                runner.status === "running"
                  ? `${remainingKm.toFixed(1)} km`
                  : "—"
              }
              mono
            />
            <Metric
              label="ETA"
              value={etaSeconds ? formatDuration(etaSeconds) : "—"}
              mono
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tiempos por checkpoint
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Checkpoint</th>
                  <th className="px-4 py-2.5 text-right font-medium">Km</th>
                  <th className="px-4 py-2.5 text-right font-medium">Tiempo</th>
                  <th className="px-4 py-2.5 text-right font-medium">Parcial</th>
                  <th className="hidden px-4 py-2.5 text-right font-medium md:table-cell">
                    Ritmo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {checkpoints.map((cp, i) => {
                  const split = runner.splits.find(
                    (s) => s.checkpointId === cp.id,
                  );
                  const prevSplit =
                    i > 0
                      ? runner.splits.find(
                          (s) =>
                            s.checkpointId === checkpoints[i - 1].id,
                        )
                      : null;
                  const partial = split
                    ? split.elapsedSeconds -
                      (prevSplit?.elapsedSeconds ?? 0)
                    : null;
                  const segmentKm =
                    cp.km - (i > 0 ? checkpoints[i - 1].km : 0);
                  const segmentPace =
                    partial && segmentKm > 0
                      ? Math.round(partial / segmentKm)
                      : null;
                  const passed = !!split;
                  return (
                    <tr key={cp.id} className={!passed ? "opacity-40" : ""}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-1.5 w-1.5 rounded-full ${
                              passed ? "bg-success" : "bg-border"
                            }`}
                          />
                          <span className="font-medium">{cp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular text-muted-foreground">
                        {cp.km}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular">
                        {split ? formatDuration(split.elapsedSeconds) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular text-muted-foreground">
                        {partial !== null ? formatDuration(partial) : "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-right font-mono tabular text-muted-foreground md:table-cell">
                        {segmentPace ? formatPace(segmentPace) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {runner.lastCheckpointId && (
          <p className="text-xs text-muted-foreground">
            Último checkpoint cronometrado:{" "}
            <span className="text-foreground">
              {getCheckpoint(runner.lastCheckpointId)?.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-0.5 text-lg font-semibold tabular ${mono ? "font-mono" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
