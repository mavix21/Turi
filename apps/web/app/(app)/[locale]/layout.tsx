import { Cormorant, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import "@turi/ui/globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { HeaderSection } from "@/app/_pages/header/header-section";
import { routing } from "@/shared/i18n/routing";
import { ThemeProvider } from "@/shared/ui/theme-provider";

import { Providers } from "./providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontCormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Turi",
  description: "Your friendly tour guide",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontSpaceGrotesk.className} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <Providers cookies={cookies}>
              <HeaderSection />
              {children}
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
