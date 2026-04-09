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
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-zinc-200/70 bg-white/85 px-5 py-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
          <Link
            href="/"
            className="inline-block max-w-full text-[15px] font-semibold tracking-tight text-zinc-900 transition-colors hover:text-blue-600 sm:text-left sm:text-base"
          >
            {BUSINESS_NAME}
          </Link>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <footer className="border-t border-zinc-200/70 bg-zinc-50 px-5 py-8 text-center text-[13px] leading-relaxed text-zinc-500">
          <p className="font-semibold tracking-tight text-zinc-800">{BUSINESS_NAME}</p>
          <p className="mt-2 max-w-md mx-auto text-zinc-500">{BUSINESS_TAGLINE}</p>
        </footer>
      </body>
    </html>
  );
}
