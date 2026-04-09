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
    <main className="page-canvas flex min-h-[calc(100dvh-5.5rem)] w-full flex-1 flex-col items-center justify-center px-5 py-16">
      <div className="relative w-full max-w-md space-y-6">
        <section className="surface-elevated relative overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/95 p-8 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-blue-500" aria-hidden />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-blue-200/90 bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-blue-800">
              {isPaid ? "Confirmed" : "Processing"}
            </span>
          </div>
          <h1 className="text-[1.65rem] font-semibold tracking-tight text-zinc-900">
            {isPaid ? "Thank you!" : "Payment is processing"}
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-zinc-600">
            {isPaid
              ? successDescription
              : `We received your checkout and are waiting for payment confirmation for ${artistName}. Please refresh this page in a few moments.`}
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Know me
          </h2>

          {knowMoreLinks.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {knowMoreLinks.map((linkItem) => (
                <li key={linkItem.href}>
                  <a
                    href={linkItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-200 hover:bg-white"
                  >
                    <span className="underline decoration-zinc-300 underline-offset-4 group-hover:decoration-zinc-500">
                      {linkItem.label}
                    </span>
                    <span className="text-zinc-400 transition-transform group-hover:translate-x-0.5" aria-hidden>
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-500">
              Social links and more about the artist will appear here.
            </p>
          )}
        </section>

        <Link
          href={`/${artist?.slug ?? DEFAULT_ARTIST_SLUG}`}
          className="flex h-14 w-full items-center justify-center rounded-xl border border-blue-600/25 bg-blue-600 text-[15px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_8px_24px_-10px_rgba(37,99,235,0.45)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_12px_28px_-12px_rgba(37,99,235,0.5)] active:translate-y-0"
        >
          Tip again
        </Link>
      </div>
    </main>
  );
}
