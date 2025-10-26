import { useState } from "react";
import { useQuery } from "convex/react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { api } from "@turi/convex/_generated/api";
import { Doc, Id } from "@turi/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@turi/ui/components/card";

import { ProviderCard } from "./provider-card";

type TourPackageWithCompany = Doc<"tourPackages"> & {
  company: {
    _id: Id<"companies">;
    name: string;
    slug: string;
    logoUrl?: string;
  } | null;
  companyName: string;
};

export function ProviderList({
  providers,
  participants,
  selectedDate,
}: {
  providers: TourPackageWithCompany[];
  participants: number;
  selectedDate: Date;
}) {
  const t = useTranslations("home.placeDetail.booking");
  const [selectedProvider, setSelectedProvider] = useState<TourPackageWithCompany | null>(null);

  if (!providers) {
    return <div>{t("noProvidersFound")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          {t("chooseProvider")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        {providers.map((provider) => (
          <ProviderCard
            key={provider._id}
            provider={provider}
            participants={participants}
            selectedDate={selectedDate}
            onViewDetails={() => setSelectedProvider(provider)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
