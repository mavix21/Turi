"use client";

import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";

import { Button } from "@turi/ui/components/button";

export function HeroSection({
  peruDestinations,
}: {
  peruDestinations: string[];
}) {
  const [activeTab, setActiveTab] = useState<"tours" | "hostelry">("tours");
  const [destination, setDestination] = useState("Cusco, Peru");
  const [checkIn, setCheckIn] = useState("2024-12-02");
  const [checkOut, setCheckOut] = useState("2024-12-03");
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

  return (
    <section className="bg-background relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-6 text-6xl leading-tight font-extrabold md:text-8xl">
            Discover Peru
          </h1>
        </div>

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="/images/design-mode/machu-pichu-optimized.jpg"
            alt="Machu Picchu"
            className="h-[550px] w-full object-cover md:h-[650px]"
          />

          <div className="absolute top-1/2 right-8 hidden -translate-y-1/2 lg:block">
            <div className="relative">
              <div className="bg-card border-border w-40 rotate-3 transform overflow-hidden rounded-lg border-2 shadow-2xl transition-transform duration-300 hover:rotate-0">
                <div className="relative">
                  <img
                    src="/stylized-illustration-of-cusco-peru-historic-plaza.jpg"
                    alt="Cusco NFT Postcard"
                    className="h-48 w-full object-cover"
                  />
                  <div className="bg-primary absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full shadow-lg">
                    <svg
                      className="text-primary-foreground h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="bg-card p-2">
                  <p className="text-foreground text-center text-xs font-bold tracking-wide uppercase">
                    Cusco
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-6 left-6 flex gap-3">
            <span className="bg-card/95 text-foreground border-border rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
              UNESCO World Heritage
            </span>
            <span className="bg-card/95 text-foreground border-border rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
              Archaeological Site
            </span>
          </div>

          <div className="bg-card/95 border-border absolute top-6 right-6 flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm">
            <div className="flex -space-x-2">
              <div className="bg-primary border-card h-8 w-8 rounded-full border-2" />
              <div className="bg-secondary border-card h-8 w-8 rounded-full border-2" />
              <div className="bg-accent border-card h-8 w-8 rounded-full border-2" />
            </div>
            <div className="ml-2 flex items-center gap-1">
              <svg
                className="h-4 w-4 fill-current text-yellow-500"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-foreground text-sm font-bold">4.9</span>
              <span className="text-muted-foreground text-xs">
                14K+ Reviews
              </span>
            </div>
          </div>

          <div className="bg-card/95 border-border absolute right-6 bottom-6 max-w-xs rounded-xl border p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <img
                src="/flat-vector-illustration-of-machu-picchu-peru-with.jpg"
                alt="Machu Picchu NFT"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-muted-foreground mb-1 text-xs">
                  Collect NFT Postcard
                </p>
                <p className="text-foreground text-sm font-bold">
                  Machu Picchu
                </p>
                <p className="text-muted-foreground text-xs">Cusco, Peru</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              Tours
            </button>
            <button
              onClick={() => setActiveTab("hostelry")}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                activeTab === "hostelry"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Hostelry
            </button>
          </div>

          {activeTab === "tours" ? (
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase">
                  Destination
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
                  Tour Date
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
                  Participants
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
                        {num} {num === 1 ? "Person" : "People"}
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
                  Destination
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
                  Check-in
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
                  Check-out
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
                  Room & Guest
                </label>
                <div className="relative">
                  <Users className="text-primary absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2" />
                  <select
                    value={`${rooms}-${guests}`}
                    onChange={(e) => {
                      const [r, g] = e.target.value.split("-").map(Number);
                      setRooms(r);
                      setGuests(g);
                    }}
                    className="text-foreground w-full cursor-pointer bg-transparent pl-6 text-sm font-medium outline-none"
                  >
                    <option value="1-1" className="bg-card text-foreground">
                      1 Room, 1 Guest
                    </option>
                    <option value="1-2" className="bg-card text-foreground">
                      1 Room, 2 Guests
                    </option>
                    <option value="2-2" className="bg-card text-foreground">
                      2 Rooms, 2 Guests
                    </option>
                    <option value="2-4" className="bg-card text-foreground">
                      2 Rooms, 4 Guests
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
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
