"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@turi/ui/components/button";
import { Card, CardContent } from "@turi/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@turi/ui/components/dialog";
import { Calendar, CheckCircle2, CreditCard, Users } from "@turi/ui/index";

interface BookingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: { name: string; guarantees: string[] };
  participants: number;
  selectedDate: Date | undefined;
  total: number;
}

export function BookingConfirmDialog({
  open,
  onOpenChange,
  provider,
  participants,
  selectedDate,
  total,
}: BookingConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      setTimeout(() => {
        setIsConfirmed(false);
        onOpenChange(false);
      }, 3000);
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your reservation has been successfully confirmed. Check your email
              for details.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-1 font-semibold">{provider.name}</h3>
              <p className="text-muted-foreground text-sm">
                {"2 hours"} experience
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "No date selected"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <span>
                  {participants} {participants === 1 ? "Person" : "People"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground h-4 w-4" />
                <span className="text-lg font-semibold">${total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 space-y-1 rounded-lg p-4 text-sm">
          <div className="flex flex-col items-start gap-2">
            {provider.guarantees.map((guarantee) => (
              <div className="flex items-start gap-2" key={guarantee}>
                <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-muted-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? "Processing..." : `Confirm & Pay $${total}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
