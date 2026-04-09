# Street Performers Tip

**Street Performers Tip** is a web app for **fan tips to street performers and musicians**. Payments run through **Stripe** (Checkout + Connect). The public product name matches `BUSINESS_NAME` in `src/lib/config.ts` — use the **same** customer-facing name and statement descriptor in your Stripe account (e.g. `STREET PERFORMERS TIP`).

## Stripe verification (business website)

Stripe requires a URL that is **public**, **not password-protected**, and **matches the business name** you gave Stripe.

1. In **Stripe Dashboard → Business settings**, set your **business name**, **DBA**, or customer-facing name to align with **Street Performers Tip** (same branding as this site).
2. Submit your **deployed app URL** — the site shows **Street Performers Tip** in the header and footer.
3. If you use a **GitHub repo** as the URL, the repo must be **public** and this README must describe the product clearly.

**Contact (optional but helpful):** add a way to reach you (email in README or GitHub profile) so reviewers see a legitimate project.

## Features

- App Router + TypeScript + Tailwind CSS
- Mobile-first tipping page at `/limona`
- Reusable artist model (future multi-artist SaaS ready)
- Stripe Checkout Session API at `/api/checkout`
- Stripe Connect transfer to connected account with 2% platform fee

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Add your Stripe key in `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

4. Start the app:

```bash
npm run dev
```

**Home `/`:** Does not show a tip form — only short copy plus links to each artist at `/{slug}` (e.g. `/limona`). The success page resolves the artist from Stripe session `metadata.artistSlug` only.
