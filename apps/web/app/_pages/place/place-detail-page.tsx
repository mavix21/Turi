"use client";

import { useQuery } from "convex/react";
import { useTranslations } from "next-intl";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";
import { MapPin } from "@turi/ui/index";

import { BookingCard } from "./ui/booking-card";

export function PlaceDetailPage({ id }: { id: string }) {
  const t = useTranslations("home.placeDetail");
  const location = useQuery(api.locations.getLocationById, { id });

  if (!location) {
    return <div>{t("loading")}</div>;
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="relative h-[600px] overflow-hidden md:h-[700px]">
          <img
            src={location.imageUrl || "/placeholder.svg"}
            alt={location.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/50 from-0% via-transparent via-50% to-black to-100%" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="max-w-4xl">
              <h1 className="mb-4 text-5xl leading-tight font-bold text-balance text-white drop-shadow-lg md:text-7xl">
                {location.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white drop-shadow-md">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg font-medium">
                    {location.address.city}, {location.address.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved Divider */}
        <div className="bg-background relative h-20">
          <svg
            className="text-background absolute top-0 left-0 h-full w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background mb-18">
        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-12">
            {/* Left Column - Description & Highlights */}
            <div className="lg:col-span-3">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-foreground mb-4 text-3xl font-bold">
                  {t("about")}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {location.description}
                </p>
              </div>

              {/* Highlights Grid */}
              <div className="mb-12">
                <h2 className="text-foreground mb-8 text-3xl font-bold">
                  {t("highlights")}
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {location.highlights.map((highlight, index: number) => (
                    <div
                      key={index}
                      className="bg-card border-border hover:border-primary/50 rounded-xl border p-6 transition"
                    >
                      <h3 className="text-foreground mb-2 text-lg font-bold">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              {/*<div className="mb-12">
                <h2 className="text-foreground mb-8 text-3xl font-bold">
                  Details
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="bg-muted/50 rounded-xl p-6">
                    <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                      Best Time to Visit
                    </p>
                    <p className="text-foreground text-xl font-bold">
                      {location.bestTime}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6">
                    <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                      Duration
                    </p>
                    <p className="text-foreground text-xl font-bold">
                      {location.duration}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6">
                    <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                      Difficulty Level
                    </p>
                    <p className="text-foreground text-xl font-bold">
                      {location.difficulty}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6">
                    <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                      Accessibility
                    </p>
                    <p className="text-foreground text-xl font-bold">
                      {location.accessibility}
                    </p>
                  </div>
                </div>
              </div>*/}

              {/* NFT Postcard */}
              <div className="bg-primary/5 border-primary/20 rounded-2xl border p-8">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                  <img
                    src={location.nftPostcard.image || "/placeholder.svg"}
                    alt={location.nftPostcard.name}
                    className="h-40 w-32 rounded-lg object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-foreground mb-2 text-2xl font-bold">
                      {t("nftPostcard.title")}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t("nftPostcard.description", {
                        locationName: location.name,
                      })}
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {t("nftPostcard.collectNow")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <BookingCard location={location} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
