"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SUPPORTED_TIP_AMOUNTS_CENTS } from "@/lib/config";

type TipFormProps = {
  artistSlug: string;
  artistName: string;
  tipDescription: string;
  imageSrc: string;
};

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function TipForm({ artistSlug, artistName, tipDescription, imageSrc }: TipFormProps) {
  const [selectedCents, setSelectedCents] = useState<number | null>(null);
  const [customCents, setCustomCents] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customCentsValue = useMemo(() => {
    const trimmed = customCents.trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace(",", ".");
    const euros = Number(normalized);
    if (!Number.isFinite(euros) || euros <= 0) return null;
    return Math.round(euros * 100);
  }, [customCents]);

  const amountCents = customCentsValue ?? selectedCents;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!amountCents) {
      setError("Choose an amount or enter a custom tip.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug, amountCents }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Unexpected response from the server.");
    } catch {
      setError("Could not connect. Check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <header className="space-y-5 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white shadow-lg ring-2 ring-blue-400/70">
              <Image
                src={imageSrc}
                alt=""
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-blue-200/90 bg-blue-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-700">
              Live support
            </span>
            <h1 className="text-[1.65rem] font-semibold tracking-tight text-zinc-900 sm:text-[1.75rem]">
              {artistName}
            </h1>
            <div className="mx-auto h-0.5 w-14 rounded-full bg-blue-400" />
            <p className="mx-auto max-w-[22rem] text-[14px] leading-relaxed text-zinc-600">
              {tipDescription}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Suggested amounts
            </p>
            <span className="text-[11px] text-zinc-400">EUR</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {SUPPORTED_TIP_AMOUNTS_CENTS.map((cents) => {
              const isSelected = selectedCents === cents && customCents.trim() === "";
              return (
                <button
                  key={cents}
                  type="button"
                  onClick={() => {
                    setSelectedCents(cents);
                    setCustomCents("");
                    setError(null);
                  }}
                  className={[
                    "rounded-xl border px-2 py-3 text-[15px] font-semibold tracking-tight transition-all duration-200",
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-950 shadow-md ring-2 ring-blue-200/90"
                      : "border-zinc-200/90 bg-white text-zinc-800 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:translate-y-0",
                  ].join(" ")}
                >
                  {formatEuro(cents)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <label
            htmlFor="custom-amount"
            className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400"
          >
            Custom amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-zinc-400">
              €
            </span>
            <input
              id="custom-amount"
              type="text"
              inputMode="decimal"
              autoComplete="transaction-amount"
              placeholder="e.g. 7.50"
              value={customCents}
              onChange={(e) => {
                setCustomCents(e.target.value);
                setSelectedCents(null);
                setError(null);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-9 pr-4 text-[17px] font-medium tracking-tight text-zinc-900 shadow-inner outline-none transition-[border-color,box-shadow,background-color] placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-200/50"
            />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">
            Every bit helps — pick what feels right today.
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-center text-[13px] text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 w-full items-center justify-center rounded-xl border border-blue-600/25 bg-blue-600 text-[15px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_8px_24px_-10px_rgba(37,99,235,0.45)] transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_12px_28px_-12px_rgba(37,99,235,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isSubmitting ? "Opening secure checkout…" : "Continue to payment"}
      </button>

      <p className="text-center text-[11px] leading-relaxed text-zinc-400">
        Powered by Stripe · encrypted · your card is not stored here
      </p>
    </form>
  );
}
