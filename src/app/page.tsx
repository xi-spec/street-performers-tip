import { ArtistTipShell } from "@/components/artist-tip-shell";
import { getHomeArtistSlug } from "@/lib/home-artist";

export default function Home() {
  return <ArtistTipShell slug={getHomeArtistSlug()} />;
}
