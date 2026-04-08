export type Artist = {
  slug: string;
  name: string;
  stripeAccountId: string;
  tipDescription: string;
};

const artists: Artist[] = [
  {
    slug: "limona",
    name: "Limona Li",
    stripeAccountId: "acct_xxx",
    tipDescription: "Support the music with a quick tip. Thank you for your support!",
  },
];

export function addArtist(artist: Artist): void {
  if (artists.some((a) => a.slug === artist.slug)) {
    throw new Error(`Artist with slug "${artist.slug}" already exists`);
  }
  artists.push(artist);
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getAllArtists(): Artist[] {
  return artists;
}

export function getFirstArtist(): Artist | undefined {
  return getAllArtists()[0];
}
