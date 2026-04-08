/**
 * Public product name — use the same name in Stripe (business / DBA / statement descriptor)
 * so your live URL or GitHub README matches verification requirements.
 */
export const BUSINESS_NAME = "Street Performers Tip";

/** One-line description for metadata and footer copy. */
export const BUSINESS_TAGLINE =
  "Tips for street performers and musicians. Payments are processed securely with Stripe.";

/** Slug for the artist shown at the site root `/` (no redirect). */
export const DEFAULT_ARTIST_SLUG = "limona";

export const PLATFORM_FEE_PERCENTAGE = 0.02;

export const CURRENCY = "eur" as const;
export const CURRENCY_CODE = "EUR";
export const CURRENCY_SYMBOL = "€";

export const CENTS_PER_UNIT = 100;
export const MIN_TIP_AMOUNT_CENTS = 50;
export const SUPPORTED_TIP_AMOUNTS_CENTS = [200, 500, 1000] as const;
