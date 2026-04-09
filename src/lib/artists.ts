export type ArtistKnowMoreLink = {
  label: string;
  href: string;
};

export type Artist = {
  slug: string;
  name: string;
  stripeAccountId: string;
  tipDescription: string;
  /** Public image URL under `/public`, e.g. `/artists/limona.jpg`. */
  imageSrc?: string;
  /** Optional custom message shown on the success page after payment. */
  successDescription?: string;
  /** Optional links for the post-payment “Know me” section. */
  knowMoreLinks?: ArtistKnowMoreLink[];
};

const artists: Artist[] = [
  {
    slug: "limona",
    name: "Limona Li",
    stripeAccountId: "acct_1TK20YEmzF4KvREU",
    tipDescription: "Support the music with a quick tip. Thank you for your support!",
    successDescription:
      "Your support helps keep Limona Li's music journey moving forward.",
    knowMoreLinks: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/2QGHezEju3FdiTM5ZSMSvb",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/limona_liiii/",
      },

      {
        label: "TikTok",
        href: "https://www.tiktok.com/@limona.li",
      },

      {
        label: "YouTube",
        href: "https://www.youtube.com/channel/UCycPWnHecFBoLGFg9qbMvOw",
      },
      ],
  },
  {
    slug: "test",
    name: "test",
    stripeAccountId: "acct_1TK20YEmzF4KvREU",
    tipDescription: "Support the music with a quick tip. Thank you for your support!",
    successDescription:
      "Your support helps keep test's music journey moving forward.",
  
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
