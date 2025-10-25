"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Users } from "lucide-react";

import { Button } from "@turi/ui/components/button";

import { PlaceBookingModal } from "./place-booking-modal";

export function BookingCard({ place }: { place: any }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [participants, setParticipants] = useState(1);

  const handleQuickBook = () => {
    setIsBookingOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log("[v0] Booking confirmed:", bookingData);
    alert(
      `Booking confirmed for ${place.name}!\nDate: ${bookingData.date}\nParticipants: ${bookingData.participants}`,
    );
    setIsBookingOpen(false);
  };

  return (
    <>
      <div className="lg:col-span-1">
        <div className="bg-card border-border sticky top-20 z-40 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border p-6 shadow-xl md:p-8">
          {/* Price */}
          <div className="mb-8">
            <p className="text-muted-foreground mb-2 text-sm">Starting from</p>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-4xl font-bold">
                ${place.price}
              </span>
              <span className="text-muted-foreground">/person</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="mb-8 space-y-4">
            {/* Date Picker */}
            <div>
              <label className="text-foreground mb-2 block text-sm font-semibold">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full rounded-lg border py-3 pr-4 pl-10 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="text-foreground mb-2 block text-sm font-semibold">
                Participants
              </label>
              <div className="relative">
                <Users className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <select
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="bg-muted border-border text-foreground focus:ring-primary/50 w-full cursor-pointer appearance-none rounded-lg border py-3 pr-4 pl-10 focus:ring-2 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Person" : "People"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-muted/50 mb-6 rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-semibold">
                ${place.price * participants}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>Taxes & fees</span>
              <span>${Math.round(place.price * participants * 0.1)}</span>
            </div>
            <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-primary text-2xl font-bold">
                ${Math.round(place.price * participants * 1.1)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleQuickBook}
            className="bg-primary hover:bg-primary/90 text-primary-foreground mb-3 w-full py-3 text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            Book Now
          </Button>

          {/* Secondary CTA */}
          <Button
            variant="outline"
            className="border-border hover:bg-muted w-full bg-transparent"
          >
            Add to Wishlist
          </Button>

          {/* Trust Indicators */}
          <div className="border-border mt-8 space-y-3 border-t pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                <svg
                  className="text-primary h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">
                Free cancellation up to 24 hours
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                <svg
                  className="text-primary h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">
                Expert local guides included
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                <svg
                  className="text-primary h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">
                Secure payment guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <PlaceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirm={handleBookingConfirm}
        place={place}
        selectedDate={selectedDate}
        participants={participants}
      />
    </>
  );
}
