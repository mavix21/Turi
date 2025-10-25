"use client";

import { useState } from "react";
import { Award, CheckCircle2, MapPin, Ticket } from "lucide-react";

import { Button } from "@turi/ui/components/button";
import { useTuriState } from "@turi/ui/hooks/use-turi-state";

export default function TouristPassportPage() {
  const { user } = useTuriState();

  const [badges] = useState([
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first experience",
      icon: "👣",
      tier: "bronze" as const,
      earned: true,
      earnedDate: "Jan 15, 2024",
      pointsRequired: 100,
    },
    {
      id: "2",
      name: "Explorer",
      description: "Visit 5 different locations",
      icon: "🗺️",
      tier: "bronze" as const,
      earned: true,
      earnedDate: "Feb 2, 2024",
      pointsRequired: 500,
    },
    {
      id: "3",
      name: "Cultural Enthusiast",
      description: "Earn 500 points from cultural experiences",
      icon: "🎭",
      tier: "silver" as const,
      earned: true,
      earnedDate: "Mar 10, 2024",
      pointsRequired: 1000,
    },
    {
      id: "4",
      name: "Adventure Seeker",
      description: "Complete 10 adventure activities",
      icon: "⛰️",
      tier: "silver" as const,
      earned: false,
      pointsRequired: 1500,
    },
    {
      id: "5",
      name: "Turi Master",
      description: "Reach 2000 points",
      icon: "👑",
      tier: "gold" as const,
      earned: false,
      pointsRequired: 2000,
    },
    {
      id: "6",
      name: "Legend",
      description: "Reach 5000 points",
      icon: "⭐",
      tier: "platinum" as const,
      earned: false,
      pointsRequired: 5000,
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          My Turi Passport
        </h2>
        <p className="text-muted-foreground">
          Your achievements and digital collectibles
        </p>
      </div>

      {/* Achievements */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-foreground text-xl font-bold">Achievements</h3>
          <div className="bg-secondary/10 flex items-center gap-2 rounded-full px-4 py-2">
            <Award className="text-primary h-5 w-5" />
            <span className="text-foreground text-sm font-semibold">
              {badges.filter((b) => b.earned).length}/{badges.length}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-6 text-center transition-all hover:scale-105 ${
                badge.earned
                  ? "from-primary/10 to-secondary/10 border-primary/30 border-2 bg-gradient-to-br shadow-lg"
                  : "bg-muted border-border border-2"
              }`}
            >
              <div className="mb-3 text-4xl">{badge.icon}</div>
              <p className="text-foreground mb-1 text-sm font-bold">
                {badge.name}
              </p>
              <p className="text-muted-foreground mb-2 text-xs">
                {badge.description}
              </p>
              {badge.earned ? (
                <div className="text-primary flex items-center justify-center gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Earned</span>
                </div>
              ) : (
                <p className="text-muted-foreground text-xs font-semibold">
                  {badge.pointsRequired} pts
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Digital Postcards */}
      <div>
        <h3 className="text-foreground mb-6 text-xl font-bold">
          Digital Postcards
        </h3>
        {user.digitalPostcards.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {user.digitalPostcards.map((postcard, idx) => (
              <div
                key={idx}
                className="bg-card border-border rounded-xl border p-4 transition-all hover:shadow-lg"
              >
                <div className="bg-muted mb-3 flex aspect-square items-center justify-center rounded-lg">
                  <MapPin className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-foreground text-sm font-semibold">
                  {postcard}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border-border rounded-2xl border p-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <Ticket className="text-muted-foreground h-10 w-10" />
            </div>
            <p className="text-muted-foreground mb-4">
              No postcards collected yet
            </p>
            <Button>Claim Your First Postcard</Button>
          </div>
        )}
      </div>
    </div>
  );
}
