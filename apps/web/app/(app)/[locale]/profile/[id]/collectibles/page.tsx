"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Hash, Link2, MapPin } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Badge } from "@turi/ui/components/badge";

export default function CollectiblesPage() {
  const collectiblesWithCheckIns = useQuery(api.checkIns.getMyCheckIns);

  if (!collectiblesWithCheckIns) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">
          Loading your collectibles...
        </div>
      </div>
    );
  }

  if (collectiblesWithCheckIns.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-foreground mb-2 text-3xl font-bold">
            My Collectibles
          </h2>
          <p className="text-muted-foreground">
            Your travel stamps and memories
          </p>
        </div>
        <div className="bg-card border-border flex min-h-[300px] items-center justify-center rounded-2xl border p-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-2 text-lg">
              No collectibles yet
            </p>
            <p className="text-muted-foreground text-sm">
              Check in at locations to earn collectible stamps!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          My Collectibles
        </h2>
        <p className="text-muted-foreground">
          {collectiblesWithCheckIns.length} travel stamp
          {collectiblesWithCheckIns.length !== 1 ? "s" : ""} collected
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collectiblesWithCheckIns.map((collectible) => {
          const isSynced = collectible.onchainStatus.status === "synced";
          const isPending = collectible.onchainStatus.status === "pending";
          const isError = collectible.onchainStatus.status === "error";

          return (
            <div
              key={collectible._id}
              className="bg-card border-border group relative overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-2xl"
            >
              {/* Stamp Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={collectible.imageUrl || "/placeholder.jpg"}
                  alt={collectible.name || "Collectible"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                  {isSynced && (
                    <Badge className="flex items-center gap-1 border backdrop-blur-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Synced
                    </Badge>
                  )}
                  {isPending && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 backdrop-blur-sm"
                    >
                      <AlertCircle className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                  {isError && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 backdrop-blur-sm"
                    >
                      <AlertCircle className="h-3 w-3" />
                      Error
                    </Badge>
                  )}
                </div>
                {/* Visits Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="backdrop-blur-sm">
                    {collectible.numberOfVisits} visit
                    {collectible.numberOfVisits !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              {/* Collectible Info */}
              <div className="p-4">
                <h3 className="text-foreground mb-1 text-lg font-bold">
                  {collectible.name}
                </h3>
                <div className="text-muted-foreground mb-3 flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{collectible.locationName}</span>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {collectible.description}
                </p>

                {/* Points Badge */}
                <div className="mb-1 flex items-center justify-between">
                  <Badge variant="outline" className="text-primary">
                    +{collectible.pointsValue} points
                  </Badge>
                </div>

                {/* Blockchain Info - Only show if synced */}
                {isSynced && collectible.onchainStatus.status === "synced" && (
                  <div className="border-border bg-muted/30 space-y-2 rounded-lg border p-3 text-xs">
                    <div className="text-foreground mb-1 flex items-center gap-1 font-semibold">
                      <Link2 className="h-3 w-3" />
                      <span>On-Chain Details</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Hash className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground mb-0.5">
                            Token ID
                          </p>
                          <p className="text-foreground font-mono break-all">
                            {collectible.onchainStatus.tokenId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Link2 className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground mb-0.5">
                            Contract
                          </p>
                          <p className="text-foreground font-mono text-[10px] break-all">
                            {collectible.onchainStatus.contractAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Chain ID</span>
                        <span className="text-foreground font-mono">
                          {collectible.onchainStatus.chainId}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {isError && collectible.onchainStatus.status === "error" && (
                  <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-3 text-xs">
                    <p className="text-destructive">
                      {collectible.onchainStatus.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
