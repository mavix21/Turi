"use client";

import { useCallback } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

import { Place } from "@/app/_pages/map/model/types";
import { UserLocation } from "@/src/lib/types";

import { calculateDistance, isWithinRadius } from "./map-utils";

interface MapViewProps {
  userLocation: UserLocation;
  places: Place[];
  onPinClick: (place: Place) => void;
  checkedInPlaces: Set<string>;
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapView({
  userLocation,
  places,
  onPinClick,
  checkedInPlaces,
}: MapViewProps) {
  const getMarkerColor = useCallback(
    (place: Place) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.location.lat,
        place.location.lng,
      );
      const inRange = isWithinRadius(distance, place.checkInRadius);
      const hasCheckedIn = checkedInPlaces.has(place.id);

      if (hasCheckedIn) return "#10b981"; // green for checked in
      if (inRange) return "#0ea5e9"; // blue for in range

      // Color by type
      switch (place.type) {
        case "restaurant":
          return "#f59e0b";
        case "hotel":
          return "#8b5cf6";
        case "museum":
          return "#ec4899";
        case "landmark":
          return "#ef4444";
        case "business":
          return "#06b6d4";
        default:
          return "#64748b";
      }
    },
    [userLocation, checkedInPlaces],
  );

  if (!apiKey) {
    return <div>Please set the Google Maps API key.</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={userLocation}
        defaultZoom={16}
        mapId="turi-map"
        disableDefaultUI={false}
        zoomControl
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        gestureHandling="greedy"
        className="size-full"
      >
        {/* User location marker */}
        <AdvancedMarker position={userLocation} zIndex={1000}>
          <div className="relative">
            <div className="bg-primary border-background size-6 rounded-full border-4 shadow-lg" />
            <div className="bg-primary absolute inset-0 size-6 animate-ping rounded-full opacity-30" />
          </div>
        </AdvancedMarker>

        {/* Place markers */}
        {places.map((place) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.location.lat,
            place.location.lng,
          );
          const inRange = isWithinRadius(distance, place.checkInRadius);
          const hasCheckedIn = checkedInPlaces.has(place.id);
          const color = getMarkerColor(place);

          return (
            <AdvancedMarker
              key={place.id}
              position={place.location}
              onClick={() => onPinClick(place)}
              title={place.name}
            >
              <Pin
                background={color}
                borderColor="#ffffff"
                glyphColor="#ffffff"
                scale={hasCheckedIn ? 1.3 : inRange ? 1.1 : 1}
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
