import { useState } from "react";
import { useQuery } from "convex/react";
import { Users } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Doc, Id } from "@turi/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@turi/ui/components/card";

import { ProviderCard } from "./provider-card";

export function ProviderList({
  providers,
  participants,
  selectedDate,
}: {
  providers: Doc<"tourPackages">[];
  participants: number;
  selectedDate: Date;
}) {
  const [selectedProvider, setSelectedProvider] = useState({});

  if (!providers) {
    return <div>No providers found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Choose Your Provider
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
