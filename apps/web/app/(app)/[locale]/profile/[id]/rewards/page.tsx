"use client";

import { useState } from "react";
import { Gift, Star } from "lucide-react";

import { Button } from "@turi/ui/components/button";
import { useTuriState } from "@turi/ui/hooks/use-turi-state";

interface Marketplace {
  id: string;
  name: string;
  discount: number;
  pointsCost: number;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function RewardsPage() {
  const {
    user,
    claimHistory,
    updateUserPoints,
    addDigitalPostcard,
    addClaimHistory,
  } = useTuriState();

  const [marketplaceItems] = useState<Marketplace[]>([
    {
      id: "1",
      name: "Cusco Heritage Hotel",
      discount: 15,
      pointsCost: 500,
      category: "Accommodation",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: "2",
      name: "Andean Cuisine Restaurant",
      discount: 20,
      pointsCost: 300,
      category: "Dining",
      rating: 4.6,
      reviews: 156,
    },
    {
      id: "3",
      name: "Sacred Valley Tours",
      discount: 25,
      pointsCost: 750,
      category: "Activities",
      rating: 4.9,
      reviews: 312,
    },
    {
      id: "4",
      name: "Artisan Textile Market",
      discount: 10,
      pointsCost: 200,
      category: "Shopping",
      rating: 4.5,
      reviews: 89,
    },
  ]);

  const handleRedeem = (pointsCost: number, itemName: string) => {
    if (user.turiScore >= pointsCost) {
      updateUserPoints(-pointsCost);
      alert(`Successfully redeemed ${itemName}!`);
    } else {
      alert("Insufficient points!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2 text-3xl font-bold">Rewards</h2>
          <p className="text-muted-foreground">
            Redeem your points for exclusive offers
          </p>
        </div>
        <div className="bg-primary/10 flex items-center gap-2 rounded-full px-4 py-2">
          <Gift className="text-primary h-5 w-5" />
          <span className="text-foreground text-sm font-semibold">
            {user.turiScore} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {marketplaceItems.map((item) => (
          <div
            key={item.id}
            className="bg-card border-border overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-xl"
          >
            <div className="bg-muted relative h-48 overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="bg-primary text-primary-foreground absolute top-3 right-3 z-20 rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                {item.discount}% OFF
              </div>
              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-card mb-1 text-sm font-medium">
                  {item.category}
                </p>
                <h4 className="text-card text-lg font-bold">{item.name}</h4>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(item.rating || 0)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                ))}
                <span className="text-muted-foreground ml-1 text-xs">
                  ({item.reviews})
                </span>
              </div>
              <Button
                onClick={() => handleRedeem(item.pointsCost, item.name)}
                className="w-full"
              >
                Redeem • {item.pointsCost} pts
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
