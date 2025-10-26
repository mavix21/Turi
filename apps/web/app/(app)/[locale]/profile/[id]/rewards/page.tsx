"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { Gift, Star } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Badge } from "@turi/ui/components/badge";
import { Button } from "@turi/ui/components/button";
import { useTuriState } from "@turi/ui/hooks/use-turi-state";

import { PartnerCard } from "@/app/_pages/partner-discount/ui/partner-card";

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

  const benefits = useQuery(api.benefits.getAllBenefits);
  const myPoints = useQuery(api.users.getMyProfile)?.reputationScore;

  if (!benefits) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading your benefits...</div>
      </div>
    );
  }

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
            {myPoints} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {benefits.map((item) => (
          <PartnerCard
            key={item._id}
            name={item.title}
            discount={item.discountPercentage}
            pointsCost={item.requiredReputation}
            description={item.description}
            image={item.imageUrl}
          />
          // <div
          //   key={item._id}
          //   className="bg-card border-border overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-xl"
          // >
          //   <div className="bg-muted relative h-48 overflow-hidden">
          //     <Image
          //       src={item.imageUrl}
          //       alt={item.title}
          //       width={200}
          //       height={400}
          //       className="h-full w-full object-cover"
          //     />
          //     <Badge className="absolute top-3 right-3 z-20 rounded-full px-3 py-1 text-sm font-bold shadow-lg">
          //       {item.discountPercentage}% OFF
          //     </Badge>
          //     <div className="absolute bottom-3 left-3 z-20">
          //       <h4 className="text-lg font-bold">{item.title}</h4>
          //     </div>
          //   </div>
          //   <div className="p-4">
          //     <Button
          //       onClick={() =>
          //         handleRedeem(item.requiredReputation, item.title)
          //       }
          //       className="w-full"
          //     >
          //       Redeem • {item.requiredReputation} pts
          //     </Button>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
}
