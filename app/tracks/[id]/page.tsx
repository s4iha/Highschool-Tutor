import { notFound } from "next/navigation";
import { TrackDetail, TRACKS_DATA } from "@/features/landing/components";
import {
  JsonLd,
  buildCourseSchema,
  buildBreadcrumbSchema,
  buildPageMetadata,
} from "@/features/seo";

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
    return buildPageMetadata({
      title: "Track Not Found",
      description: "Academic track not found.",
      path: `/tracks/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${track.name} (${track.grades})`,
    description: track.overview,
    path: `/tracks/${id}`,
  });
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  const track = TRACKS_DATA[id];

  if (!track) {
    notFound();
  }

  const courseSchema = buildCourseSchema(track);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Academic Tracks & Strands", path: "/tracks" },
    { name: `${track.name} (${track.grades})`, path: `/tracks/${id}` },
  ]);

  return (
    <>
      <JsonLd schema={courseSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <TrackDetail trackId={id} />
    </>
  );
}
