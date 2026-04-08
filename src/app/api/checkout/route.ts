import { NextRequest, NextResponse } from "next/server";
import { getArtistBySlug } from "@/lib/artists";
import {
  CENTS_PER_UNIT,
  CURRENCY,
  CURRENCY_CODE,
  MIN_TIP_AMOUNT_CENTS,
  PLATFORM_FEE_PERCENTAGE,
} from "@/lib/config";
import { getStripeClient } from "@/lib/stripe";

type CheckoutPayload = {
  artistSlug?: string;
  amountCents?: number;
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();
    const body = (await request.json()) as CheckoutPayload;
    const { artistSlug, amountCents } = body;

    if (!artistSlug || typeof amountCents !== "number") {
      return NextResponse.json(
        { error: "artistSlug and amountCents are required." },
        { status: 400 },
      );
    }

    const artist = getArtistBySlug(artistSlug);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found." }, { status: 404 });
    }

    if (!Number.isFinite(amountCents) || amountCents < MIN_TIP_AMOUNT_CENTS) {
      return NextResponse.json(
        {
          error: `Minimum amount is ${CURRENCY_CODE} ${(
            MIN_TIP_AMOUNT_CENTS / CENTS_PER_UNIT
          ).toFixed(2)}.`,
        },
        { status: 400 },
      );
    }

    const applicationFeeAmount = Math.round(amountCents * PLATFORM_FEE_PERCENTAGE);
    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/${artist.slug}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: amountCents,
            product_data: {
              name: `Tip for ${artist.name}`,
            },
          },
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: artist.stripeAccountId,
        },
      },
      metadata: {
        artistSlug: artist.slug,
        artistName: artist.name,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}
