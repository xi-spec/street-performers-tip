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
    <main className="page-canvas flex min-h-[calc(100dvh-5.5rem)] w-full flex-1 flex-col items-center justify-center px-5 py-16">
      <div className="relative w-full max-w-md">
        <div className="surface-elevated relative overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/95 p-8 backdrop-blur-sm sm:p-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-blue-500"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-8 top-6 h-px bg-zinc-200/90"
            aria-hidden
          />
          <div className="relative pt-2">
            <TipForm
              artistSlug={artist.slug}
              artistName={artist.name}
              tipDescription={artist.tipDescription}
              imageSrc={artist.imageSrc ?? `/artists/${artist.slug}.png`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
