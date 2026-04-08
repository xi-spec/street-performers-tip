import { getFirstArtist } from "@/lib/artists";
import { DEFAULT_ARTIST_SLUG } from "@/lib/config";

/**
 * Which artist slug to show on `/`.
 *
 * - `next dev`: always the first artist in the catalog (easy local iteration).
 * - `next start` / production: `DEFAULT_ARTIST_SLUG`, unless
 *   `MUSICTIP_HOME_FIRST_ARTIST=true` (e.g. local prod smoke test after `next build`).
 */
export function getHomeArtistSlug(): string {
  const useFirst =
    process.env.NODE_ENV === "development" ||
    process.env.MUSICTIP_HOME_FIRST_ARTIST === "true";

  if (useFirst) {
    return getFirstArtist()?.slug ?? DEFAULT_ARTIST_SLUG;
  }

  return DEFAULT_ARTIST_SLUG;
}
