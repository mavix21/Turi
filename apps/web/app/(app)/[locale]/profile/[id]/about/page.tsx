"use client";

import { useState } from "react";
import { Camera, MapPin, Zap } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turi/ui/components/avatar";
import { Button } from "@turi/ui/components/button";
import { useTuriState } from "@turi/ui/hooks/use-turi-state";

export default function AboutPage() {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/placeholder.svg?height=200&width=200",
  );

  const {
    user,
    claimHistory,
    updateUserPoints,
    addDigitalPostcard,
    addClaimHistory,
  } = useTuriState();

  const levels = [
    { name: "Explorer", minPoints: 0, maxPoints: 500 },
    { name: "Adventurer", minPoints: 500, maxPoints: 1000 },
    { name: "Wanderer", minPoints: 1000, maxPoints: 2000 },
    { name: "Global Explorer", minPoints: 2000, maxPoints: 5000 },
    { name: "Legend", minPoints: 5000, maxPoints: 10000 },
  ];

  const currentLevel =
    levels.find(
      (level) =>
        user.turiScore >= level.minPoints && user.turiScore < level.maxPoints,
    ) || levels[levels.length - 1];

  const nextLevel = levels.find((level) => level.minPoints > user.turiScore);
  const progressPercentage = nextLevel
    ? ((user.turiScore - currentLevel.minPoints) /
        (nextLevel.minPoints - currentLevel.minPoints)) *
      100
    : 100;

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClaimPoints = () => {
    const newLocation = `Location ${user.digitalPostcards.length + 1}`;
    updateUserPoints(100);
    addDigitalPostcard(newLocation);
    addClaimHistory(newLocation, 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-3xl font-bold">About me</h2>
        <p className="text-muted-foreground">
          Your profile information and statistics
        </p>
      </div>

      {/* Avatar Upload Section */}
      <div className="bg-card border-border flex flex-col items-center gap-4 rounded-2xl border p-8">
        <div className="group relative">
          <Avatar className="border-primary/20 h-32 w-32 border-4">
            <AvatarImage
              src={avatarUrl || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback className="text-3xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Camera className="text-card h-8 w-8" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div className="text-center">
          <h3 className="text-foreground mb-1 text-2xl font-bold">
            {user.name}
          </h3>
          <p className="text-muted-foreground">Turi Traveler</p>
        </div>
      </div>

      {/* Updated Stats Card */}
      <div className="bg-card border-border rounded-2xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Turi Score</p>
            <p className="text-primary text-3xl font-bold">
              {user.turiScore.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground mb-1 text-sm">Current Level</p>
            <p className="text-foreground text-lg font-bold">
              {currentLevel.name}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress to next level
            </span>
            {nextLevel && (
              <span className="text-foreground font-semibold">
                {nextLevel.minPoints - user.turiScore} pts to {nextLevel.name}
              </span>
            )}
          </div>
          <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
            <div
              className="from-primary to-secondary h-3 rounded-full bg-gradient-to-r transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {nextLevel && (
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{currentLevel.minPoints} pts</span>
              <span>{nextLevel.minPoints} pts</span>
            </div>
          )}
        </div>
      </div>

      {/* Claim Points Card */}
      <div className="from-primary via-primary/90 to-primary/80 rounded-2xl bg-gradient-to-br p-8 shadow-xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="bg-card flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg">
            <MapPin className="text-primary h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-primary-foreground mb-2 text-2xl font-bold">
              I AM HERE! Claim Points & Postal
            </h3>
            <p className="text-primary-foreground/90 mb-4">
              Verify your location with GPS and earn 100 points plus a digital
              postcard instantly
            </p>
            <Button
              onClick={handleClaimPoints}
              size="lg"
              className="bg-card hover:bg-card/90 text-primary shadow-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Claim Points Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
