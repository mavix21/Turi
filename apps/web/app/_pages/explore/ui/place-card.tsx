"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { MapPin, Star } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Id } from "@turi/convex/_generated/dataModel";

import { Link } from "@/app/_shared/i18n";

interface PlaceCardProps {
  id: string;
  name: string;
  location: string;
  province: string;
  department: string;
  rating: number | undefined;
  image: string;
}

export function PlaceCard({
  id,
  name,
  province,
  department,
  rating,
  image,
}: PlaceCardProps) {
  const providers = useQuery(api.tourPackages.getTourPackagesByLocation, {
    locationId: id as Id<"locations">,
  });

  if (!providers) {
    return null;
  }

  const minPrice =
    providers.length > 0
      ? Math.min(
          ...providers.map(
            (provider) => provider.basePricePerPerson + provider.taxesAndFees,
          ),
        )
      : null;

  return (
    <Link href={`/place/${id}`}>
      <div className="bg-card card-shadow group overflow-hidden rounded-2xl border transition hover:shadow-xl">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            width={400}
            height={400}
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {/* Rating Badge */}
          {rating && (
            <div className="bg-background/90 absolute top-3 right-3 flex items-center gap-1 rounded-full border px-3 py-1.5 backdrop-blur-2xl">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-foreground text-sm font-semibold">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-foreground mb-2 text-lg font-bold">{name}</h3>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="text-primary h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {province}, {department}
                </span>
              </div>
            </div>
            {minPrice !== null && (
              <div className="shrink-0 text-right">
                <p className="text-foreground text-xl font-bold">${minPrice}</p>
                <p className="text-muted-foreground text-xs">/Day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
