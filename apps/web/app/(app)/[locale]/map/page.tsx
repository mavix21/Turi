"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Locate } from "lucide-react";

import { Badge } from "@turi/ui/components/badge";
import { Button } from "@turi/ui/components/button";

import { calculateDistance, isWithinRadius } from "@/app/_pages/map/map-utils";
import { MapView } from "@/app/_pages/map/mav-view";
import { mockPlaces } from "@/app/_pages/map/model/mock-places";
import { Place } from "@/app/_pages/map/model/types";
import { PlaceModal } from "@/app/_pages/map/ui/place-modal";
import { UserLocation } from "@/src/lib/types";

// This centers the map at a location near Plaza de Armas in Cusco, Peru
// Coordinates: latitude -13.5170, longitude -71.9790
// This position is close to Plaza de Armas, Qorikancha Temple, and Museo Inka for easy check-ins
const DEMO_LOCATION: UserLocation = {
  lat: -13.517,
  lng: -71.979,
};

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEMO_LOCATION);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [checkedInPlaces, setCheckedInPlaces] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (_) => {
          // Optionally use real location if available
          // For demo purposes, we keep the Plaza de Armas location
          // Uncomment the lines below to use actual user location:
          // setUserLocation({
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude,
          // })
          console.log(
            "User location available but using demo location (Plaza de Armas)",
          );
        },
        (_) => {
          console.log(
            "Geolocation not available, using demo location (Plaza de Armas)",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // Handle pin click
  const handlePinClick = useCallback(
    (place: Place) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.location.lat,
        place.location.lng,
      );

      setSelectedPlace({
        ...place,
        distance,
        isInRange: isWithinRadius(distance, place.checkInRadius),
      });
      setIsModalOpen(true);
    },
    [userLocation],
  );

  // Handle check-in
  const handleCheckIn = useCallback((placeId: string) => {
    setCheckedInPlaces((prev) => new Set(prev).add(placeId));
  }, []);

  const handleRecenter = useCallback(() => {
    setUserLocation(DEMO_LOCATION);
  }, []);

  if (isLoadingLocation) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full pt-16">
      {/* Location info banner */}
      <div className="absolute top-20 left-1/2 z-10 mx-4 w-full max-w-md -translate-x-1/2">
        <div className="bg-card border-border rounded-lg border p-3 shadow-lg">
          <p className="text-muted-foreground text-center text-xs">
            📍 Demo Mode: Centered at Plaza de Armas, Cusco, Peru
          </p>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-36 left-4 z-10 space-y-2">
        <div className="bg-card/95 border-border rounded-lg border p-4 shadow-lg backdrop-blur-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">{mockPlaces.length} Places Nearby</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {checkedInPlaces.size} Checked In
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Recenter button */}
      <div className="absolute right-4 bottom-24 z-10">
        <Button
          onClick={handleRecenter}
          size="lg"
          className="bg-card hover:bg-card/90 border-border h-14 w-14 rounded-full border shadow-lg"
          variant="outline"
          title="Recenter to Plaza de Armas"
        >
          <Locate className="text-primary h-6 w-6" />
        </Button>
      </div>

      {/* Map */}
      <MapView
        userLocation={userLocation}
        places={mockPlaces}
        onPinClick={handlePinClick}
        checkedInPlaces={checkedInPlaces}
      />

      {/* Place modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCheckIn={handleCheckIn}
          hasCheckedIn={checkedInPlaces.has(selectedPlace.id)}
        />
      )}
    </div>
  );
}
