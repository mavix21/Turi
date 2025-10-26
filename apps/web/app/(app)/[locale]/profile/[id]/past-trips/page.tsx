"use client";

import { useQuery } from "convex/react";
import { MapPin } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";

export default function PastTripsPage() {
  const checkIns = useQuery(api.checkIns.getMyCheckIns);

  if (!checkIns) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">Past trips</h2>
        <p className="text-muted-foreground">
          Your travel history and claimed locations
        </p>
      </div>

      {checkIns.length > 0 ? (
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <div
              key={checkIn._id}
              className="bg-card border-border rounded-2xl border p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                    <MapPin className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">
                      {checkIn.locationName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(checkIn._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary text-lg font-bold">
                    +{checkIn.points}
                  </p>
                  <p className="text-muted-foreground text-xs">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border-border rounded-2xl border p-12 text-center">
          <div className="mx-auto mb-6 h-32 w-32">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <rect
                x="40"
                y="60"
                width="120"
                height="100"
                rx="8"
                fill="currentColor"
                className="text-muted"
              />
              <rect
                x="50"
                y="70"
                width="100"
                height="80"
                rx="4"
                fill="currentColor"
                className="text-background"
              />
              <circle
                cx="100"
                cy="110"
                r="15"
                fill="currentColor"
                className="text-primary/30"
              />
              <path
                d="M 70 130 Q 100 100 130 130"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-primary/30"
              />
              <rect
                x="60"
                y="40"
                width="80"
                height="30"
                rx="4"
                fill="currentColor"
                className="text-muted-foreground/30"
              />
            </svg>
          </div>
          <p className="text-foreground mb-2 text-lg font-semibold">
            No trips yet
          </p>
          <p className="text-muted-foreground mb-6">
            You'll find your past reservations here after you've taken your
            first trip
          </p>
          <Button size="lg">Start Exploring</Button>
        </div>
      )}
    </div>
  );
}
