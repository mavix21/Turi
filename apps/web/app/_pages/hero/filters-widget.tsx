"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@turi/ui/components/button";
import { Calendar, MapPin, Users } from "@turi/ui/index";

export function FiltersWidget({
  peruDestinations,
}: {
  peruDestinations: string[];
}) {
  const [activeTab, setActiveTab] = useState<"tours" | "hostelry">("tours");
  const [destination, setDestination] = useState("Cusco, Peru");
  const [checkIn, setCheckIn] = useState("2025-10-27");
  const [checkOut, setCheckOut] = useState("2025-10-31");
  const [participants, setParticipants] = useState(4);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    const searchData = {
      type: activeTab,
      destination,
      ...(activeTab === "hostelry"
        ? { checkIn, checkOut, rooms, guests }
        : { checkIn, participants }),
    };
    console.log("[v0] Search initiated:", searchData);
    alert(`Searching for ${activeTab} in ${destination}`);
  };
  const t = useTranslations("home.hero");

  return (
    <div className="relative z-20 mx-auto -mt-32 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="bg-card/95 border-border rounded-2xl border p-6 shadow-2xl backdrop-blur-xl">
        <div className="border-border mb-6 flex gap-2 border-b pb-4">
          <button
            onClick={() => setActiveTab("tours")}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
              activeTab === "tours"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {t("tabs.tours")}
          </button>
          <button
            onClick={() => setActiveTab("hostelry")}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
              activeTab === "hostelry"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {t("tabs.hostelry")}
          </button>
        </div>

        {activeTab === "tours" ? (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.destination")}
              </label>
              <div className="relative">
                <MapPin className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                >
                  {peruDestinations.map((dest) => (
                    <option
                      key={dest}
                      value={dest}
                      className="bg-card text-foreground"
                    >
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.tourDate")}
              </label>
              <div className="relative">
                <Calendar className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.participants")}
              </label>
              <div className="relative">
                <Users className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <select
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option
                      key={num}
                      value={num}
                      className="bg-card text-foreground"
                    >
                      {num}{" "}
                      {num === 1
                        ? t("participantsCount.one")
                        : t("participantsCount.other")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.destination")}
              </label>
              <div className="relative">
                <MapPin className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                >
                  {peruDestinations.map((dest) => (
                    <option
                      key={dest}
                      value={dest}
                      className="bg-card text-foreground"
                    >
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.checkIn")}
              </label>
              <div className="relative">
                <Calendar className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.checkOut")}
              </label>
              <div className="relative">
                <Calendar className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                {t("labels.roomGuest")}
              </label>
              <div className="relative">
                <Users className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                <select
                  value={`${rooms}-${guests}`}
                  onChange={(e) => {
                    const [r, g] = e.target.value.split("-").map(Number);
                    setRooms(r ?? 1);
                    setGuests(g ?? 1);
                  }}
                  className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                >
                  <option value="1-1" className="bg-card text-foreground">
                    {t("roomGuestOptions.oneRoomOneGuest")}
                  </option>
                  <option value="1-2" className="bg-card text-foreground">
                    {t("roomGuestOptions.oneRoomTwoGuests")}
                  </option>
                  <option value="2-2" className="bg-card text-foreground">
                    {t("roomGuestOptions.twoRoomsTwoGuests")}
                  </option>
                  <option value="2-4" className="bg-card text-foreground">
                    {t("roomGuestOptions.twoRoomsFourGuests")}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 text-sm shadow-lg transition-all hover:shadow-xl"
          >
            {t("search")}
          </Button>
        </div>
      </div>
    </div>
  );
}
