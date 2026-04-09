"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";

type ElementsTipCheckoutProps = {
  artistSlug: string;
  amountCents: number;
  /** Passed from a Server Component; reads `process.env.STRIPE_PUBLISHABLE_KEY`. */
  stripePublishableKey: string;
};

function CheckoutForm({ artistSlug }: { artistSlug: string }) {
  const router = useRouter();
  const checkoutState = useCheckout();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  async function confirmPayment(preventDefault?: () => void) {
    preventDefault?.();
    setError("");

    if (checkoutState.type !== "success") {
      setError("Checkout is still loading. Please wait a moment.");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const result = await checkoutState.checkout.confirm({
      redirect: "always",
      email: trimmedEmail,
    });

    if (result.type === "error") {
      setError(result.error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Stripe handles navigation to the server-defined return_url.
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    await confirmPayment(() => event.preventDefault());
  }

  if (checkoutState.type === "loading") {
    return (
      <p className="flex items-center gap-2.5 text-[13px] text-zinc-500">
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-500 motion-reduce:animate-none" />
        Loading secure checkout…
      </p>
    );
  }

  if (checkoutState.type === "error") {
    return (
      <p className="rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-[13px] text-red-900">
        {checkoutState.error.message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-[14px] outline-none transition-colors placeholder:text-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60"
          placeholder="you@example.com"
        />
      </label>
      <PaymentElement
        options={{
          wallets: {
            link: "never",
          },
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: "never",
            spacedAccordionItems: true,
          },
        }}
      />
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => router.push(`/${artistSlug}`)}
          className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white text-[13px] font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 flex-1 rounded-xl border border-blue-600/25 bg-blue-600 text-[13px] font-medium text-white shadow-sm transition-[transform,box-shadow] hover:bg-blue-500 disabled:opacity-40"
        >
          {isSubmitting ? "Processing…" : "Pay now"}
        </button>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-[13px] text-red-900">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function ElementsTipCheckout({
  artistSlug,
  amountCents,
  stripePublishableKey,
}: ElementsTipCheckoutProps) {
  const stripePromise = useMemo(
    () => (stripePublishableKey ? loadStripe(stripePublishableKey) : null),
    [stripePublishableKey],
  );

  const options = useMemo(
    () => ({
      clientSecret: fetch("/api/checkout/elements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug, amountCents }),
      })
        .then(async (response) => {
          const data = (await response.json()) as {
            clientSecret?: string;
            error?: string;
          };
          if (!response.ok || !data.clientSecret) {
            throw new Error(data.error ?? "Unable to start checkout.");
          }
          return data.clientSecret;
        }),
    }),
    [artistSlug, amountCents],
  );

  if (!stripePromise) {
    return (
      <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[13px] text-zinc-700">
        Missing STRIPE_PUBLISHABLE_KEY (set in env for server; passed from the pay page).
      </p>
    );
  }

  return (
    <CheckoutElementsProvider stripe={stripePromise} options={options}>
      <CheckoutForm artistSlug={artistSlug} />
    </CheckoutElementsProvider>
  );
}
