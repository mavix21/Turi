"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronDownIcon, Users } from "lucide-react";

import { Button } from "@turi/ui/components/button";
import { Calendar as CalendarComponent } from "@turi/ui/components/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@turi/ui/components/card";
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
  name: string;
}

export function BookingCard({ location }: { location: BookingCardProps }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [participants, setParticipants] = useState(1);

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <Card className="border-2">
        <CardHeader>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Starting from</p>
            <CardTitle className="text-3xl">
              {/*TODO: add minPrice in base of tourPackages*/}${20}
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
        participants={participants}
        selectedDate={date ?? new Date()}
      />
    </div>
  );
}
