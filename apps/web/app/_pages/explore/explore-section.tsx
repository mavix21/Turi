"use client";

import { useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";

import { PlaceCard } from "./ui/place-card";

export function ExploreSection({
  exploreCategories,
}: {
  exploreCategories: { id: string; label: string }[];
}) {
  const locations = useQuery(api.locations.getAllLocations);
  const [exploreFilter, setExploreFilter] = useState("all");

  if (!locations) {
    return <div>Loading...</div>;
  }

  // Simple client-side filtering based on current filter state
  let filteredPlaces = locations;

  if (exploreFilter === "popular") {
    filteredPlaces = locations.filter(
      (location) => (location.rating ?? 0) >= 4.5,
    );
  } else if (exploreFilter === "archaeological") {
    filteredPlaces = locations.filter(
      (location) =>
        location.category.type === "Attraction" &&
        location.category.kind.subtype === "Archaeological Site",
    );
  } else if (exploreFilter === "historic") {
    filteredPlaces = locations.filter(
      (location) =>
        location.category.type === "Attraction" &&
        location.category.kind.subtype === "Historical Site",
    );
  } else if (exploreFilter === "museums") {
    filteredPlaces = locations.filter(
      (location) =>
        location.category.type === "Attraction" &&
        location.category.kind.subtype === "Museum",
    );
  } else if (exploreFilter === "natural") {
    filteredPlaces = locations.filter(
      (location) => location.category.type === "Attraction",
    );
  }

  return (
    <section className="bg-card rounded-3xl py-16 md:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-foreground mb-3 text-4xl font-bold md:text-5xl">
              Explore
            </h2>
            <p className="text-muted-foreground text-lg">
              Let's go on an adventure
            </p>
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            Discover Peru's incredible destinations including archaeological
            sites, natural wonders, and historic sanctuaries across all
            departments.
          </p>
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {exploreCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setExploreFilter(category.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                exploreFilter === category.id
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
          <button className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground ml-auto flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition">
            Filters
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((location) => (
            <PlaceCard
              key={location._id}
              id={location._id}
              name={location.name}
              location={`${location.address.city}, ${location.address.country}`}
              province={location.address.state}
              department={location.address.city}
              rating={4.5}
              image={location.imageUrl}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="bg-transparent px-8">
            Show more
          </Button>
        </div>
      </div>
    </section>
  );
}
