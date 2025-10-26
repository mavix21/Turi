"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import {
  Award,
  Calendar,
  CheckCircle2,
  CreditCard,
  Globe,
  MapPin,
  Shield,
  Ticket,
  User,
} from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turi/ui/components/avatar";
import { Badge } from "@turi/ui/components/badge";
import { Card, CardContent } from "@turi/ui/components/card";
import { useTuriState } from "@turi/ui/hooks/use-turi-state";

import { StatisticsPanel } from "@/app/_pages/profile/ui/statistics-panel";

export default function TouristPassportPage() {
  const { user } = useTuriState();

  const [badges] = useState([
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first experience",
      icon: "👣",
      tier: "bronze" as const,
      earned: true,
      earnedDate: "Jan 15, 2024",
      pointsRequired: 100,
    },
    {
      id: "2",
      name: "Explorer",
      description: "Visit 5 different locations",
      icon: "🗺️",
      tier: "bronze" as const,
      earned: true,
      earnedDate: "Feb 2, 2024",
      pointsRequired: 500,
    },
    {
      id: "3",
      name: "Cultural Enthusiast",
      description: "Earn 500 points from cultural experiences",
      icon: "🎭",
      tier: "silver" as const,
      earned: true,
      earnedDate: "Mar 10, 2024",
      pointsRequired: 1000,
    },
    {
      id: "4",
      name: "Adventure Seeker",
      description: "Complete 10 adventure activities",
      icon: "⛰️",
      tier: "silver" as const,
      earned: false,
      pointsRequired: 1500,
    },
    {
      id: "5",
      name: "Turi Master",
      description: "Reach 2000 points",
      icon: "👑",
      tier: "gold" as const,
      earned: false,
      pointsRequired: 2000,
    },
    {
      id: "6",
      name: "Legend",
      description: "Reach 5000 points",
      icon: "⭐",
      tier: "platinum" as const,
      earned: false,
      pointsRequired: 5000,
    },
  ]);

  // const userData = {
  //   name: "María Elena Rodríguez",
  //   passportNumber: "PE-127845693",
  //   nationality: "Peruana",
  //   dateOfBirth: "15 de Marzo, 1992",
  //   issueDate: "10 de Enero, 2022",
  //   expiryDate: "10 de Enero, 2032",
  //   photo:
  //     "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  // };

  const travelStamps = [
    {
      id: "0x7f9c8e2a1b5d3f6e",
      destination: "Machu Picchu",
      location: "Cusco",
      visitDate: "2024-03-15",
      verificationStatus: "verified",
      image:
        "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=600",
      blockchainHash: "0x7f9c8e2a1b5d3f6e4c8a9d2b7f1e5c3a",
    },
    {
      id: "0x3a6d8f1c2e5b9a4d",
      destination: "Líneas de Nazca",
      location: "Nazca",
      visitDate: "2024-05-22",
      verificationStatus: "verified",
      image:
        "https://images.pexels.com/photos/14654471/pexels-photo-14654471.jpeg?auto=compress&cs=tinysrgb&w=600",
      blockchainHash: "0x3a6d8f1c2e5b9a4d7e2f8c1b6a3d9e5c",
    },
    {
      id: "0x9e4b2f7a1d6c8e3b",
      destination: "Lago Titicaca",
      location: "Puno",
      visitDate: "2024-07-08",
      verificationStatus: "verified",
      image:
        "https://images.pexels.com/photos/12697283/pexels-photo-12697283.jpeg?auto=compress&cs=tinysrgb&w=600",
      blockchainHash: "0x9e4b2f7a1d6c8e3b5a9d2f7c1e4b8a6d",
    },
    {
      id: "0x5c8a3e9f2b1d7a4c",
      destination: "Cañón del Colca",
      location: "Arequipa",
      visitDate: "2024-08-19",
      verificationStatus: "verified",
      image:
        "https://images.pexels.com/photos/19058522/pexels-photo-19058522.jpeg?auto=compress&cs=tinysrgb&w=600",
      blockchainHash: "0x5c8a3e9f2b1d7a4c6e8b3f9d2a7c5e1b",
    },
    {
      id: "0x2d7f4b8e1c6a9d3f",
      destination: "Reserva Nacional Paracas",
      location: "Ica",
      visitDate: "2024-09-30",
      verificationStatus: "verified",
      image:
        "https://images.pexels.com/photos/19638308/pexels-photo-19638308.jpeg?auto=compress&cs=tinysrgb&w=600",
      blockchainHash: "0x2d7f4b8e1c6a9d3f5b7e2a8c4d9f1e6a",
    },
  ];

  const statistics = {
    totalDestinations: travelStamps.length,
    verifiedStamps: travelStamps.filter(
      (s) => s.verificationStatus === "verified",
    ).length,
    verificationScore: 98.5,
    memberSince: "2022",
  };

  const userData = useQuery(api.users.getMyProfile);

  if (!userData) return null;

  return (
    <>
      <Card>
        <CardContent className="p-8 lg:p-10">
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="group relative">
              <div className="relative">
                <Avatar className="border-accent/50 ring-accent/10 h-40 w-40 ring-4 lg:h-48 lg:w-48">
                  <AvatarImage
                    src={userData.imageUrl ?? "/placeholder.png"}
                    alt={userData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-serif text-4xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-0 px-4 py-1 shadow-lg">
                  <Shield className="mr-1 h-3 w-3" />
                  Verificado
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="from-primary via-primary to-accent bg-gradient-to-r bg-clip-text font-serif text-4xl font-bold text-transparent lg:text-5xl">
                  {userData.name}
                </h2>
                <div className="text-muted-foreground flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  <span className="bg-muted/50 rounded-full px-3 py-1 font-mono text-sm tracking-wider">
                    {userData.profile.documentNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                <div className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                      Nationality
                    </p>
                    <p className="text-foreground text-lg font-semibold">
                      {userData.profile.nationality}
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                      Date of Birth
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(
                        userData.profile.dateOfBirth,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                      Issue Date
                    </p>
                    <p className="text-foreground text-lg font-semibold">
                      {new Date(
                        userData.profile.issueDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                      Expiry Date
                    </p>
                    <p className="text-foreground text-lg font-semibold">
                      {new Date(
                        userData.profile.expiryDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatisticsPanel statistics={statistics} />
    </>
  );
}
