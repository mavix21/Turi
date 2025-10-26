"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { CheckCircle2, MapPin, Star, TrendingUp } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";

interface CertifiedProvider {
  id: string;
  name: string;
  aiConfidenceScore: number;
  category: string;
  location: string;
  rating?: number;
  reviews?: number;
  verified?: boolean;
}

export default function CertifiedProvidersPage() {
  const [certifiedProviders] = useState<CertifiedProvider[]>([
    {
      id: "1",
      name: "Inca Trail Expeditions",
      aiConfidenceScore: 98,
      category: "Trekking",
      location: "Cusco",
      rating: 4.9,
      reviews: 487,
      verified: true,
    },
    {
      id: "2",
      name: "Lima Culinary Tours",
      aiConfidenceScore: 95,
      category: "Food & Culture",
      location: "Lima",
      rating: 4.7,
      reviews: 234,
      verified: true,
    },
    {
      id: "3",
      name: "Titicaca Community Stays",
      aiConfidenceScore: 92,
      category: "Lodging",
      location: "Puno",
      rating: 4.6,
      reviews: 156,
      verified: true,
    },
    {
      id: "4",
      name: "Nazca Lines Flights",
      aiConfidenceScore: 96,
      category: "Adventure",
      location: "Nazca",
      rating: 4.8,
      reviews: 312,
      verified: true,
    },
  ]);

  const collectiblesWithCheckIns = useQuery(api.checkIns.getMyCheckIns);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          Certified Providers
        </h2>
        <p className="text-muted-foreground">
          AI-verified trusted partners for your Peru journey
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {certifiedProviders.map((provider) => (
          <div
            key={provider.id}
            className="bg-card border-border rounded-2xl border p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-foreground text-xl font-bold">
                    {provider.name}
                  </h4>
                  {provider.verified && (
                    <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                  )}
                </div>
                <p className="text-muted-foreground mb-1 text-sm">
                  {provider.category}
                </p>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="text-primary h-4 w-4" />
                  AI Confidence Score
                </span>
                <span className="text-primary text-lg font-bold">
                  {provider.aiConfidenceScore}%
                </span>
              </div>
              <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                <div
                  className="from-primary to-secondary h-3 rounded-full bg-gradient-to-r transition-all"
                  style={{ width: `${provider.aiConfidenceScore}%` }}
                />
              </div>
            </div>
            <div className="border-border flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(provider.rating || 0)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                ))}
                <span className="text-muted-foreground ml-1 text-xs">
                  ({provider.reviews})
                </span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
