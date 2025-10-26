"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { MapPin, Ticket, Calendar, Users, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatUnits } from "viem";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";
import { Card, CardContent } from "@turi/ui/components/card";
import { Badge } from "@turi/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@turi/ui/components/tabs";

export default function PastTripsPage() {
  const t = useTranslations("home.profile.pastTrips");
  const checkIns = useQuery(api.checkIns.getMyCheckIns);
  const bookings = useQuery(api.bookings.getUserBookings);
  const router = useRouter();

  if (!checkIns || !bookings) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  const hasAnyActivity = checkIns.length > 0 || bookings.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {hasAnyActivity ? (
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="checkIns" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Check-ins ({checkIns.length})
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {booking.location?.imageUrl && (
                        <div className="relative h-48 w-full md:h-auto md:w-48 shrink-0">
                          <img
                            src={booking.location.imageUrl}
                            alt={booking.location.name || "Location"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold">
                              {booking.tourPackage?.name || "Tour Package"}
                            </h3>
                            {booking.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.location.name}, {booking.location.address.city}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                          >
                            {booking.status}
                          </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Tour Date</p>
                              <p className="font-medium">
                                {new Date(booking.tourDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Participants</p>
                              <p className="font-medium">{booking.participants}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="flex flex-wrap items-center gap-3 text-sm border-t pt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Paid</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400">
                              ${booking.totalPricePaid} USDX
                            </p>
                          </div>

                          {booking.travelTokensBurned && booking.travelTokensBurned !== "0" && (
                            <div>
                              <p className="text-xs text-muted-foreground">TURI Used</p>
                              <p className="font-semibold text-purple-600 dark:text-purple-400">
                                {parseFloat(formatUnits(BigInt(booking.travelTokensBurned), 18)).toFixed(2)} TURI
                              </p>
                            </div>
                          )}

                          {booking.transactionHash && (
                            <div className="ml-auto">
                              <a
                                href={`https://sepolia.scrollscan.com/tx/${booking.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                View Transaction
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Company */}
                        {booking.company && (
                          <div className="text-xs text-muted-foreground">
                            Provided by {booking.company.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-card border-border rounded-2xl border p-12 text-center">
                <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground mb-2 text-lg font-semibold">
                  No Bookings Yet
                </p>
                <p className="text-muted-foreground mb-6">
                  Book your first tour to see it here
                </p>
                <Button size="lg" onClick={() => router.push("/")}>
                  Explore Tours
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Check-ins Tab */}
          <TabsContent value="checkIns" className="space-y-4">
            {checkIns.length > 0 ? (
              checkIns.map((checkIn) => (
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
                        +{checkIn.pointsValue}
                      </p>
                      <p className="text-muted-foreground text-xs">{t("points")}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border-border rounded-2xl border p-12 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground mb-2 text-lg font-semibold">
                  No Check-ins Yet
                </p>
                <p className="text-muted-foreground mb-6">
                  Visit locations and check-in to earn rewards
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
            {t("noTrips")}
          </p>
          <p className="text-muted-foreground mb-6">
            {t("noTripsDescription")}
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            {t("startExploring")}
          </Button>
        </div>
      )}
    </div>
  );
}
