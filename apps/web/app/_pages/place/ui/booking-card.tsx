"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Calendar, ChevronDownIcon, PackageX } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import { Id } from "@turi/convex/_generated/dataModel";
import { Button } from "@turi/ui/components/button";
import { Calendar as CalendarComponent } from "@turi/ui/components/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@turi/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@turi/ui/components/empty";
import { Label } from "@turi/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@turi/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@turi/ui/components/select";

import { ProviderList } from "./provider-list";

interface BookingCardProps {
  _id: string;
  name: string;
}

export function BookingCard({ location }: { location: BookingCardProps }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [participants, setParticipants] = useState(1);

  const providers = useQuery(api.tourPackages.getTourPackagesByLocation, {
    locationId: location._id as Id<"locations">,
  });

  // Debug logging
  console.log("BookingCard - Location ID:", location._id);
  console.log("BookingCard - Providers:", providers);

  // Show loading state
  if (providers === undefined) {
    return (
      <div className="space-y-4 lg:sticky lg:top-4">
        <Card className="border-2">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading packages...</p>
            <p className="text-xs text-muted-foreground mt-2">
              Location ID: {location._id}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (providers === null || providers.length === 0) {
    return (
      <div className="space-y-4 lg:sticky lg:top-4">
        <Card className="border-2">
          <CardContent className="p-0">
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageX className="text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No tour packages available</EmptyTitle>
                <EmptyDescription>
                  There are currently no tour providers offering packages for{" "}
                  {location.name}. Check back later or explore other
                  destinations.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" asChild>
                  <a href="/explore">Browse Other Locations</a>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate minimum price from all providers
  const minPrice = Math.min(
    ...providers.map(
      (p) => (p.basePricePerPerson ?? 0) + (p.taxesAndFees ?? 0),
    ),
  );

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <Card className="border-2">
        <CardHeader>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Starting from</p>
            <CardTitle className="text-3xl">
              ${minPrice}
              <span className="text-muted-foreground text-lg font-normal">
                /person
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Date
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {date.toLocaleDateString()}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date ?? new Date());
                    setOpen(false);
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Participants</Label>
            <Select
              value={participants.toString()}
              onValueChange={(value) => setParticipants(parseInt(value))}
            >
              <SelectTrigger id="participants" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Person" : "People"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <ProviderList
        providers={providers}
        participants={participants}
        selectedDate={date ?? new Date()}
      />
    </div>
  );
}
