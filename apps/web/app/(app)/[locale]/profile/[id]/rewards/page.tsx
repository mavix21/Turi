"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Gift, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { api } from "@turi/convex/_generated/api";
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
  const t = useTranslations("home.profile.rewards");
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
  const myPoints =
    useQuery(api.users.getMyProfile)?.profile.reputationScore || 0;

  if (!benefits) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  const handleRedeem = (pointsCost: number, itemName: string) => {
    if (user.turiScore >= pointsCost) {
      updateUserPoints(-pointsCost);
      alert(`${t("successfulRedeem")} ${itemName}!`);
    } else {
      alert(t("insufficientPoints"));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2 text-3xl font-bold">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="bg-primary/10 flex items-center gap-2 rounded-full px-4 py-2">
          <Gift className="text-primary h-5 w-5" />
          <span className="text-foreground text-sm font-semibold">
            {myPoints} {t("pts")}
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
        ))}
      </div>
    </div>
  );
}
