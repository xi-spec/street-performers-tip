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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
        Complete your tip
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        You are supporting {artist.name}.
      </p>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
        <ElementsTipCheckout
          artistSlug={artistSlug}
          amountCents={amountCents}
          stripePublishableKey={stripePublishableKey}
        />
      </div>
    </main>
  );
}
