import Link from "next/link";
import { BUSINESS_TAGLINE } from "@/lib/config";
import { getAllArtists } from "@/lib/artists";

export default function Home() {
  const artists = getAllArtists();

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="space-y-6 text-center">
        <p className="text-sm leading-relaxed text-zinc-600">{BUSINESS_TAGLINE}</p>
        <p className="text-sm text-zinc-500">
          Open a performer&apos;s tip page using their link, for example{" "}
          <Link href="/limona" className="font-medium text-zinc-900 underline underline-offset-2">
            /limona
          </Link>
          .
        </p>
        {artists.length > 0 ? (
          <ul className="space-y-2 text-left text-sm">
            {artists.map((artist) => (
              <li key={artist.slug}>
                <Link
                  href={`/${artist.slug}`}
                  className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                >
                  {artist.name} <span className="text-zinc-500">/{artist.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
