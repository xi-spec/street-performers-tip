import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BUSINESS_NAME, BUSINESS_TAGLINE } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS_NAME,
    template: `%s · ${BUSINESS_NAME}`,
  },
  description: BUSINESS_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 bg-white px-4 py-3">
          <Link
            href="/"
            className="inline-block max-w-full text-center text-base font-semibold leading-snug tracking-tight text-zinc-900 sm:text-left sm:text-lg"
          >
            {BUSINESS_NAME}
          </Link>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
          <p className="font-medium text-zinc-700">{BUSINESS_NAME}</p>
          <p className="mt-1 max-w-md mx-auto">{BUSINESS_TAGLINE}</p>
        </footer>
      </body>
    </html>
  );
}
