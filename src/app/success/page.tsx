import Link from "next/link";
import { redirect } from "next/navigation";
import { getArtistBySlug } from "@/lib/artists";
import { DEFAULT_ARTIST_SLUG } from "@/lib/config";
import { getStripeClient } from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSessionId(
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = searchParams.session_id;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return undefined;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = readSessionId(params);
  if (!sessionId) {
    redirect("/");
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const isPaid = session.payment_status === "paid";

  const sessionArtistSlug = session.metadata?.artistSlug;
  const artist = getArtistBySlug(sessionArtistSlug ?? DEFAULT_ARTIST_SLUG);
  const artistName = artist?.name ?? "the artist";
  const successDescription =
    artist?.successDescription ??
    `Your support helps keep ${artistName}'s music journey moving forward.`;
  const knowMoreLinks = artist?.knowMoreLinks ?? [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <section className="rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isPaid ? "Thank you!" : "Payment is processing"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-800">
          {isPaid
            ? successDescription
            : `We received your checkout and are waiting for payment confirmation for ${artistName}. Please refresh this page in a few moments.`}
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-300 bg-zinc-50 p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Know me</h2>

        {knowMoreLinks.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {knowMoreLinks.map((linkItem) => (
              <li key={linkItem.href}>
                <a
                  href={linkItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md px-1 py-1 text-base font-medium text-zinc-900 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900"
                >
                  {linkItem.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-700">
            Social links and deeper artist story will be added here.
          </p>
        )}
      </section>

      <Link
        href={`/${artist?.slug ?? DEFAULT_ARTIST_SLUG}`}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-4 text-base font-semibold text-white hover:bg-zinc-800"
      >
        Tip again
      </Link>
    </main>
  );
}
