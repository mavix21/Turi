"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@turi/ui/components/button";

interface PlaceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  place: any;
  selectedDate: string;
  participants: number;
}

export function PlaceBookingModal({
  isOpen,
  onClose,
  onConfirm,
  place,
  selectedDate,
  participants,
}: PlaceBookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onConfirm({
        date: selectedDate,
        participants,
        ...formData,
      });
    }
  };

  if (!isOpen) return null;

  const totalPrice = Math.round(place.price * participants * 1.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="bg-card border-border sticky top-0 flex items-center justify-between border-b p-6">
          <h2 className="text-foreground text-2xl font-bold">
            {step === 1 ? "Review Booking" : "Confirm Details"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition"
          >
            <X className="text-muted-foreground h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-foreground mb-4 font-bold">
                  Booking Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Place</span>
                    <span className="text-foreground font-semibold">
                      {place.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-foreground font-semibold">
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString()
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="text-foreground font-semibold">
                      {participants}
                    </span>
                  </div>
                  <div className="border-border flex justify-between border-t pt-3">
                    <span className="text-foreground font-semibold">
                      Total Price
                    </span>
                    <span className="text-primary text-2xl font-bold">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <h3 className="text-foreground mb-4 font-bold">
                  What's Included
                </h3>
                <div className="space-y-2">
                  {[
                    "Expert local guide",
                    "All entrance fees",
                    "Transportation",
                    "Lunch and refreshments",
                    "Travel insurance",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="bg-primary/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                        <Check className="text-primary h-3 w-3" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-semibold">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-2 block text-sm font-semibold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-foreground mb-2 block text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-foreground mb-2 block text-sm font-semibold">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="text-foreground mb-2 block text-sm font-semibold">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:ring-primary/50 w-full resize-none rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Any special requirements or preferences?"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-card border-border sticky bottom-0 flex gap-3 border-t p-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border hover:bg-muted flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
          >
            {step === 1 ? "Continue" : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
