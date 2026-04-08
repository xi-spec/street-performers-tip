import { notFound } from "next/navigation";
import { TipForm } from "@/components/tip-form";
import { getArtistBySlug } from "@/lib/artists";

type ArtistTipShellProps = {
  slug: string;
};

export function ArtistTipShell({ slug }: ArtistTipShellProps) {
  const artist = getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
      <TipForm
        artistSlug={artist.slug}
        artistName={artist.name}
        tipDescription={artist.tipDescription}
      />
    </main>
  );
}
