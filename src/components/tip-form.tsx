"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CENTS_PER_UNIT,
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  MIN_TIP_AMOUNT_CENTS,
  SUPPORTED_TIP_AMOUNTS_CENTS,
} from "@/lib/config";

type TipFormProps = {
  artistSlug: string;
  artistName: string;
  tipDescription: string;
};

export function TipForm({ artistSlug, artistName, tipDescription }: TipFormProps) {
  const [selectedAmountCents, setSelectedAmountCents] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCustomFocused, setIsCustomFocused] = useState(false);

  const finalAmountCents = useMemo(() => {
    const customParsed = Number(customAmount);
    const hasCustom = customAmount.trim().length > 0;

    if (hasCustom && Number.isFinite(customParsed)) {
      return Math.round(customParsed * CENTS_PER_UNIT);
    }

    return selectedAmountCents;
  }, [customAmount, selectedAmountCents]);

  const isValidAmount =
    typeof finalAmountCents === "number" &&
    Number.isFinite(finalAmountCents) &&
    finalAmountCents >= MIN_TIP_AMOUNT_CENTS;

  const isCustomActive = customAmount.trim().length > 0;
  const isCustomHighlighted = isCustomActive || isCustomFocused;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValidAmount) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistSlug,
          amountCents: finalAmountCents,
        }),
      });

      if (!response.ok) {
        setError("Unable to create checkout. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as { url?: string };

      if (!data.url) {
        setError("Missing checkout URL. Please try again.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Tip {artistName}
        </h1>
      </div>
      <p className="text-center text-sm text-zinc-500">{tipDescription}</p>

      <div className="grid grid-cols-3 gap-3">
        {SUPPORTED_TIP_AMOUNTS_CENTS.map((amountCents) => {
          const amountInUnits = amountCents / CENTS_PER_UNIT;
          const isSelected =
            customAmount.trim().length === 0 &&
            !isCustomFocused &&
            selectedAmountCents === amountCents;
          return (
            <button
              key={amountCents}
              type="button"
              onClick={() => {
                setCustomAmount("");
                setSelectedAmountCents(amountCents);
              }}
              className={`h-14 rounded-xl border-2 text-lg font-semibold transition ${
                isSelected
                  ? "border-amber-400 bg-black text-white shadow-[0_0_0_2px_rgba(251,191,36,0.25)]"
                  : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400"
              }`}
            >
              {CURRENCY_SYMBOL}
              {amountInUnits}
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">
          Custom amount ({CURRENCY_CODE})
        </span>
        <div
          className={`flex h-14 items-stretch overflow-hidden rounded-xl border-2 bg-white transition ${
            isCustomHighlighted
              ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.25)]"
              : "border-zinc-300"
          }`}
        >
          <span
            className={`flex shrink-0 items-center border-r px-4 text-lg font-semibold tabular-nums ${
              isCustomHighlighted
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-zinc-200 bg-zinc-100 text-zinc-700"
            }`}
            aria-hidden
          >
            {CURRENCY_SYMBOL}
          </span>
          <input
            type="number"
            min={MIN_TIP_AMOUNT_CENTS / CENTS_PER_UNIT}
            step="0.01"
            inputMode="decimal"
            value={customAmount}
            onChange={(event) => {
              setCustomAmount(event.target.value);
              setSelectedAmountCents(null);
            }}
            onFocus={() => setIsCustomFocused(true)}
            onBlur={() => setIsCustomFocused(false)}
            placeholder="0.00"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 text-right text-xl font-semibold tabular-nums text-zinc-900 outline-none [appearance:textfield] placeholder:text-zinc-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">
          Thank you — any amount you choose means a lot.
        </p>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full rounded-xl bg-black text-base font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Redirecting..." : "Support"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
