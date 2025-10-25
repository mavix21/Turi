import { Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@turi/ui/components/card";

export function ProviderList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Choose Your Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {/*{providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            participants={participants}
            selectedDate={selectedDate}
            onViewDetails={() => setSelectedProvider(provider)}
          />
        ))}*/}
      </CardContent>
    </Card>
  );
}
