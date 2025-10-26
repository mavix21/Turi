"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Trophy } from "lucide-react";

import { Button } from "@turi/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@turi/ui/components/dialog";

interface CheckInSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  points: number;
  collectibleName: string;
  collectibleImage?: string;
}

export function CheckInSuccessModal({
  isOpen,
  onClose,
  placeName,
  points,
  collectibleName,
  collectibleImage,
}: CheckInSuccessModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showCollectible, setShowCollectible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Stagger animations
      setShowContent(false);
      setShowPoints(false);
      setShowCollectible(false);

      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowPoints(true), 400);
      setTimeout(() => setShowCollectible(true), 700);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center text-2xl font-bold">
            <div
              className={`transition-all duration-500 ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
            >
              <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary h-12 w-12 animate-bounce" />
              </div>
              Check-in Successful! 🎉
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Success message */}
          <div
            className={`text-center transition-all duration-500 ${
              showContent
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <p className="text-muted-foreground text-sm">
              You've successfully checked in at
            </p>
            <p className="text-foreground mt-1 text-lg font-semibold">
              {placeName}
            </p>
          </div>

          {/* Points earned */}
          <div
            className={`from-primary/10 to-primary/5 border-primary/20 transform rounded-xl border-2 bg-linear-to-br p-6 transition-all duration-500 ${
              showPoints ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Trophy className="text-primary h-8 w-8 animate-pulse" />
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Points Earned</p>
                <p className="text-primary text-3xl font-bold">+{points}</p>
              </div>
              <Sparkles className="text-primary h-8 w-8 animate-pulse" />
            </div>
          </div>

          {/* NFT Collectible */}
          <div
            className={`transform transition-all duration-500 ${
              showCollectible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="bg-accent/5 border-accent/20 rounded-xl border-2 p-6">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles className="text-accent h-5 w-5" />
                <p className="text-accent text-sm font-semibold">
                  NFT Collectible Minted!
                </p>
                <Sparkles className="text-accent h-5 w-5" />
              </div>

              {collectibleImage && (
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={collectibleImage}
                    alt={collectibleName}
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute right-3 bottom-3 left-3">
                    <p className="text-sm font-semibold text-white">
                      {collectibleName}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground text-center text-xs">
                This unique digital postcard has been added to your collection!
              </p>
            </div>
          </div>

          {/* Close button */}
          <Button onClick={onClose} className="w-full" size="lg">
            View My Collection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
