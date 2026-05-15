import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getRace, races } from "@/lib/mock-data";

export function generateStaticParams() {
  return races.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  props: PageProps<"/races/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const r = getRace(slug);
  if (!r) {
    return { title: "Carrera no encontrada · RaceTracker" };
  }
  const title = `${r.name} ${r.edition} · RaceTracker`;
  const description = `Seguimiento en vivo de ${r.name} ${r.edition} · ${r.location} · ${r.distance} km · ${r.elevationGain} m D+`;
  return {
    title,
    description,
    alternates: {
      canonical: `/races/${r.slug}`,
    },
    openGraph: {
      title: `${r.name} ${r.edition}`,
      description,
      type: "website",
      siteName: "RaceTracker",
      locale: r.defaultLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${r.name} ${r.edition}`,
      description,
    },
  };
}

export default async function RacePage(props: PageProps<"/races/[slug]">) {
  const { slug } = await props.params;
  const r = getRace(slug);
  if (!r) notFound();
  return <AppShell />;
}
