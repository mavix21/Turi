"use client";

import { useState } from "react";

import type { Id } from "@turi/convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@turi/ui/components/accordion";
import { Badge } from "@turi/ui/components/badge";
import { Button } from "@turi/ui/components/button";
import { Card } from "@turi/ui/components/card";
import { Clock, Eye, Star, Ticket } from "@turi/ui/index";

import { BookingConfirmDialog } from "./booking-confirm-dialog";

interface ProviderCardProps {
  _id: Id<"tourPackages">;
  name: string;
  basePricePerPerson: number;
  taxesAndFees: number;
  currency: "USX" | "USDC";
  availableTickets: number;
  guarantees: string[];
  company: {
    _id: Id<"companies">;
    name: string;
    slug: string;
    logoUrl?: string;
  } | null;
  mixedPayment?: {
    turiTokens: number;
    remainingUSX: number;
  };
}

export function ProviderCard({
  provider,
  participants,
  selectedDate,
  onViewDetails,
}: {
  provider: ProviderCardProps;
  participants: number;
  selectedDate: Date;
  onViewDetails: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const subtotal = provider.basePricePerPerson * participants;
  const taxes = provider.taxesAndFees;
  const total = subtotal + taxes;

  const canBook = selectedDate && provider.availableTickets >= participants;

  // Currency symbol mapper
  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USX: "USX",
      USDC: "USDC",
    };
    return symbols[curr] || curr;
  };

  const currencySymbol = getCurrencySymbol(provider.currency);

  return (
    <>
      <Card className="p-3 transition-shadow duration-200 hover:shadow-md">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">
                {provider.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{4.5}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">{"2 hours"}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {total.toFixed(2)} {currencySymbol}
              </div>
              <div className="text-muted-foreground text-[10px]">total</div>
            </div>
          </div>

          <Badge variant="secondary" className="h-5 text-[10px]">
            <Ticket className="mr-1 h-2.5 w-2.5" />
            {provider.availableTickets} left
          </Badge>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pricing" className="border-none">
              <AccordionTrigger className="text-muted-foreground py-2 text-xs hover:no-underline">
                View price breakdown
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {currencySymbol} {provider.basePricePerPerson.toFixed(2)}{" "}
                      × {participants}
                    </span>
                    <span>
                      {currencySymbol} {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span>
                      {currencySymbol} {taxes.toFixed(2)}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="h-8 w-full text-xs"
            >
              <Eye className="mr-1 h-3 w-3" />
              Details
            </Button> */}
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={!canBook}
              className="h-8 w-full text-xs"
            >
              Book Now
            </Button>
          </div>

          {!selectedDate && (
            <p className="text-muted-foreground text-center text-[10px]">
              Select a date to book
            </p>
          )}
        </div>
      </Card>

      <BookingConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        provider={{
          _id: provider._id,
          name: provider.name,
          guarantees: provider.guarantees,
          company: provider.company
            ? {
                slug: provider.company.slug,
                name: provider.company.name,
              }
            : null,
          mixedPayment: provider.mixedPayment,
        }}
        participants={participants}
        selectedDate={selectedDate}
        total={total}
      />
    </>
  );
}
