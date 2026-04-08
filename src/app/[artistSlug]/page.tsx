import { ArtistTipShell } from "@/components/artist-tip-shell";
import { getAllArtists } from "@/lib/artists";

type ArtistPageProps = {
  params: Promise<{ artistSlug: string }>;
};

export async function generateStaticParams() {
  return getAllArtists().map((artist) => ({ artistSlug: artist.slug }));
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistSlug } = await params;
  return <ArtistTipShell slug={artistSlug} />;
}
