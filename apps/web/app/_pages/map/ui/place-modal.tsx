"use client";

import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";

import { Badge } from "@turi/ui/components/badge";
import { Button } from "@turi/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@turi/ui/components/dialog";

import { useCheckInMachine } from "../hooks/useCheckInMachine";
import { Place } from "../model/types";
import { CheckInSuccessModal } from "./check-in-success-modal";

interface PlaceModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
  checkInMachine: ReturnType<typeof useCheckInMachine>;
  hasCheckedIn: boolean;
}

export function PlaceModal({
  place,
  isOpen,
  onClose,
  checkInMachine,
  hasCheckedIn,
}: PlaceModalProps) {
  const handleCheckIn = () => {
    checkInMachine.checkIn();
  };

  const handleRetry = () => {
    checkInMachine.retry();
  };

  const getLoadingMessage = () => {
    if (checkInMachine.isValidating) return "Validating...";
    if (checkInMachine.isPreparing) return "Preparing transaction...";
    if (checkInMachine.isWaitingForSignature)
      return "Please sign in your wallet...";
    if (checkInMachine.isWaitingForConfirmation)
      return "Confirming transaction...";
    if (checkInMachine.isUpdatingDatabase) return "Updating your profile...";
    return "Processing...";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "hotel":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "museum":
        return "bg-pink-500/10 text-pink-600 border-pink-500/20";
      case "landmark":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "business":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Show success modal when check-in is successful
  if (checkInMachine.isSuccess) {
    return (
      <CheckInSuccessModal
        isOpen={isOpen}
        onClose={onClose}
        placeName={place.name}
        points={place.points}
        collectibleName={
          checkInMachine.context.collectibleName ?? "Digital Postcard"
        }
        collectibleImage={
          checkInMachine.context.collectibleImage ?? place.image
        }
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!checkInMachine.isLoading}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-foreground text-2xl font-bold">
                {place.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {place.address}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className={getTypeColor(place.type)}>
              {place.type}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Image */}
          {place.image && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <img
                src={place.image || "/placeholder.svg"}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-foreground text-sm leading-relaxed">
            {place.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-foreground font-medium">
                {place.rating}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{place.openingHours}</span>
            </div>
          </div>

          {/* Distance and range status */}
          <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
            <MapPin className="text-primary h-5 w-5" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {place.distance
                  ? `${place.distance.toFixed(0)}m away`
                  : "Calculating distance..."}
              </p>
              <p className="text-muted-foreground text-xs">
                Check-in radius: {place.checkInRadius}m
              </p>
            </div>
            {place.isInRange ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="text-muted-foreground h-5 w-5" />
            )}
          </div>

          {/* Rewards */}
          <div className="bg-primary/5 border-primary/20 rounded-lg border p-3">
            <p className="text-foreground mb-1 text-sm font-medium">
              Check-in Rewards
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                +{place.points} Points
              </Badge>
              {place.nftReward && (
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  NFT Postcard
                </Badge>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {checkInMachine.isError && checkInMachine.error && (
            <div className="border-destructive/50 bg-destructive/10 flex h-24 items-start gap-2 overflow-auto rounded-lg border p-3">
              <p className="text-destructive max-w-md text-sm">
                {checkInMachine.error}
              </p>
            </div>
          )}

          {/* Check-in button */}
          <Button
            onClick={checkInMachine.isError ? handleRetry : handleCheckIn}
            disabled={
              !place.isInRange || hasCheckedIn || checkInMachine.isLoading
            }
            className="w-full"
            size="lg"
          >
            {checkInMachine.isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {getLoadingMessage()}
              </>
            ) : checkInMachine.isError ? (
              "Retry Check-In"
            ) : hasCheckedIn ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Checked In
              </>
            ) : place.isInRange ? (
              "Check In Now"
            ) : (
              "Too Far Away"
            )}
          </Button>

          {!place.isInRange && !hasCheckedIn && !checkInMachine.isLoading && (
            <p className="text-muted-foreground text-center text-xs">
              Get within {place.checkInRadius}m to check in
            </p>
          )}

          {checkInMachine.isWaitingForConfirmation &&
            checkInMachine.context.transactionHash && (
              <p className="text-muted-foreground text-center text-xs">
                Transaction hash:{" "}
                {checkInMachine.context.transactionHash.slice(0, 10)}...
              </p>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
