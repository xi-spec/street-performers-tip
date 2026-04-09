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
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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
    return <p className="text-sm text-zinc-600">Loading secure checkout...</p>;
  }

  if (checkoutState.type === "error") {
    return <p className="text-sm text-red-600">{checkoutState.error.message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-800">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-xl border border-zinc-300 px-4 text-sm outline-none focus:border-black"
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
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push(`/${artistSlug}`)}
          className="h-12 flex-1 rounded-xl border border-zinc-300 bg-white text-sm font-medium text-zinc-900"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-xl bg-black text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Pay now"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

export function ElementsTipCheckout({
  artistSlug,
  amountCents,
}: ElementsTipCheckoutProps) {
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
      <p className="text-sm text-red-600">
        Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </p>
    );
  }

  return (
    <CheckoutElementsProvider stripe={stripePromise} options={options}>
      <CheckoutForm artistSlug={artistSlug} />
    </CheckoutElementsProvider>
  );
}
