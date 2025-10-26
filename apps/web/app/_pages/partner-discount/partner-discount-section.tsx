"use client";

import { useQuery } from "convex/react";
import { useTranslations } from "next-intl";

import { api } from "@turi/convex/_generated/api";

import { PartnerCard } from "./ui/partner-card";

export function PartnerDiscountSection() {
  const t = useTranslations("home.partnerDiscounts");
  const partnerDiscounts = useQuery(api.benefits.getAllBenefits);

  if (!partnerDiscounts) {
    return <div>{t("loading")}</div>;
  }

  return (
    <section className="bg-card rounded-3xl py-16 md:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-foreground mb-3 text-4xl font-bold md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {partnerDiscounts.map((partner) => (
            <PartnerCard
              key={partner._id}
              name={partner.title}
              discount={partner.discountPercentage}
              pointsCost={partner.requiredReputation}
              description={partner.description}
              image={partner.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
