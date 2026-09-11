import { notFound } from "next/navigation";
import { TrackDetail, TRACKS_DATA } from "@/features/landing/components";

interface TrackPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return Object.keys(TRACKS_DATA).map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { id } = await params;
  const track = TRACKS_DATA[id];

  if (!track) {
    return { title: "Track Not Found • HighSchool Tutor" };
  }

  return {
    title: `${track.name} (${track.grades}) • HighSchool Tutor`,
    description: track.overview,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  const track = TRACKS_DATA[id];

  if (!track) {
    notFound();
  }

  return <TrackDetail trackId={id} />;
}
