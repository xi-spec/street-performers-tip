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
  const [selectedAmountCents, setSelectedAmountCents] = useState<number>(
    SUPPORTED_TIP_AMOUNTS_CENTS[1],
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const finalAmountCents = useMemo(() => {
    const customParsed = Number(customAmount);
    const hasCustom = customAmount.trim().length > 0;

    if (hasCustom && Number.isFinite(customParsed)) {
      return Math.round(customParsed * CENTS_PER_UNIT);
    }

    return selectedAmountCents;
  }, [customAmount, selectedAmountCents]);

  const isValidAmount =
    Number.isFinite(finalAmountCents) && finalAmountCents >= MIN_TIP_AMOUNT_CENTS;

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
      <h1 className="text-3xl font-semibold tracking-tight">Tip {artistName}</h1>
      <p className="text-sm text-zinc-500">{tipDescription}</p>

      <div className="grid grid-cols-3 gap-3">
        {SUPPORTED_TIP_AMOUNTS_CENTS.map((amountCents) => {
          const amountInUnits = amountCents / CENTS_PER_UNIT;
          const isSelected =
            customAmount.trim().length === 0 && selectedAmountCents === amountCents;
          return (
            <button
              key={amountCents}
              type="button"
              onClick={() => {
                setCustomAmount("");
                setSelectedAmountCents(amountCents);
              }}
              className={`h-14 rounded-xl border text-lg font-semibold transition ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-900"
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
        <input
          type="number"
          min={MIN_TIP_AMOUNT_CENTS / CENTS_PER_UNIT}
          step="0.01"
          inputMode="decimal"
          value={customAmount}
          onChange={(event) => setCustomAmount(event.target.value)}
          placeholder="e.g. 12"
          className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-lg outline-none focus:border-black"
        />
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
