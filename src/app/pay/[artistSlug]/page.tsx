import { notFound } from "next/navigation";
import { getArtistBySlug } from "@/lib/artists";
import { MIN_TIP_AMOUNT_CENTS } from "@/lib/config";
import { ElementsTipCheckout } from "@/components/elements-tip-checkout";

type PayPageProps = {
  params: Promise<{ artistSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseAmountCents(
  searchParams: Record<string, string | string[] | undefined>,
): number | null {
  const raw = searchParams.amount_cents;
  const value = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return null;
  if (parsed < MIN_TIP_AMOUNT_CENTS) return null;
  return parsed;
}

export default async function PayPage({ params, searchParams }: PayPageProps) {
  const { artistSlug } = await params;
  const artist = getArtistBySlug(artistSlug);
  if (!artist) {
    notFound();
  }

  const sp = await searchParams;
  const amountCents = parseAmountCents(sp);
  if (!amountCents) {
    notFound();
  }

  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? "";

  return (
    <main className="page-canvas flex min-h-[calc(100dvh-5.5rem)] w-full flex-1 flex-col items-center px-5 py-16">
      <div className="relative w-full max-w-md">
        <div className="mb-8 space-y-3 text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200/90 bg-blue-50/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-700 backdrop-blur-sm">
            Secure checkout
          </span>
          <h1 className="text-[1.65rem] font-semibold tracking-tight text-zinc-900">
            Complete your tip
          </h1>
          <p className="mx-auto max-w-[22rem] text-[14px] leading-relaxed text-zinc-600">
            You are supporting <span className="font-medium text-zinc-800">{artist.name}</span>.
          </p>
        </div>
        <div className="surface-elevated relative overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/95 p-6 backdrop-blur-sm sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-blue-500" aria-hidden />
          <ElementsTipCheckout
            artistSlug={artistSlug}
            amountCents={amountCents}
            stripePublishableKey={stripePublishableKey}
          />
        </div>
      </div>
    </main>
  );
}
