"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { FiltersWidget } from "./filters-widget";

export function HeroSection({
  peruDestinations,
}: {
  peruDestinations: string[];
}) {
  const t = useTranslations("home.hero");

  return (
    <section className="bg-background relative pt-24 pb-8 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-center md:mb-12">
          <h1 className="text-foreground mb-6 text-5xl leading-tight font-extrabold md:text-8xl">
            {t("title")}
          </h1>
        </div>

        <div className="max-w-8xl relative mx-auto overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="/images/design-mode/machu-pichu-optimized.jpg"
            alt="Machu Picchu"
            className="h-[400px] w-full object-cover sm:h-[500px] md:aspect-video md:h-auto"
            width={1600}
            height={900}
            priority
          />

          <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-4 md:right-8">
            <div className="relative">
              <div className="bg-card border-border w-24 rotate-3 transform overflow-hidden rounded-lg border-2 shadow-2xl transition-transform duration-300 hover:rotate-0 sm:w-32 md:w-40">
                <div className="relative">
                  <img
                    src="/flat-vector-illustration-of-machu-picchu-peru-with.jpg"
                    alt="Machu Picchu Postcard"
                    className="h-28 w-full object-cover sm:h-36 md:h-48"
                  />
                  <div className="bg-primary absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full shadow-lg sm:top-2 sm:left-2 sm:h-5 sm:w-5 md:h-6 md:w-6">
                    <svg
                      className="text-primary-foreground h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="bg-card p-1 sm:p-1.5 md:p-2">
                  <p className="text-foreground text-center text-[0.5rem] font-bold tracking-wide uppercase sm:text-xs">
                    Machu Picchu
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 sm:top-4 sm:left-4 sm:gap-2 md:top-6 md:left-6 md:gap-3">
            <span className="bg-card/95 text-foreground border-border rounded-full border px-2 py-1 text-[0.625rem] font-medium shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm">
              {t("badges.unesco")}
            </span>
            <span className="bg-card/95 text-foreground border-border rounded-full border px-2 py-1 text-[0.625rem] font-medium shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm">
              {t("badges.archaeological")}
            </span>
          </div>

          <div className="hidden lg:block">
            <FiltersWidget peruDestinations={peruDestinations} />
          </div>
        </div>
      </div>
    </section>
  );
}
