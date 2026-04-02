import { notFound } from "next/navigation";
import { getLocation } from "@/lib/content";
import LocationEditForm from "./LocationEditForm";

export default async function StandortEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) notFound();

  return <LocationEditForm slug={slug} location={location} />;
}
