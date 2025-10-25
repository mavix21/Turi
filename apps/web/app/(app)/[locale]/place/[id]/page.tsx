import { PlaceDetailPage } from "@/app/_pages/place";

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PlaceDetailPage id={id} />;
}
