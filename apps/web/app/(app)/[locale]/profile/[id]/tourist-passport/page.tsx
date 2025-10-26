"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Calendar, CreditCard, Edit, Globe, Shield, User } from "lucide-react";

import { api } from "@turi/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turi/ui/components/avatar";
import { Badge } from "@turi/ui/components/badge";
import { Button } from "@turi/ui/components/button";
import { Card, CardContent } from "@turi/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@turi/ui/components/dialog";
import { Input } from "@turi/ui/components/input";
import { Label } from "@turi/ui/components/label";

import { StatisticsPanel } from "@/app/_pages/profile/ui/statistics-panel";

export default function TouristPassportPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    documentNumber: "",
    nationality: "",
    dateOfBirth: "",
  });

  const updateProfile = useMutation(api.userProfile.updateProfile);
  const userData = useQuery(api.users.getMyProfile);

  const handleEdit = () => {
    if (userData) {
      setFormData({
        name: userData.name,
        documentNumber: userData.profile.documentNumber,
        nationality: userData.profile.nationality,
        dateOfBirth: userData.profile.dateOfBirth.split("T")[0] || "",
      });
      setIsEditOpen(true);
    }
  };

  const handleSave = async () => {
    try {
      // Fix timezone issue by appending time to the date string
      const dateWithTime = `${formData.dateOfBirth}T00:00:00.000Z`;

      await updateProfile({
        name: formData.name,
        documentNumber: formData.documentNumber,
        nationality: formData.nationality,
        dateOfBirth: dateWithTime,
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!userData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">
          Loading your tourist passport...
        </div>
      </div>
    );
  }

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
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="bg-clip-text font-serif text-4xl font-bold lg:text-5xl">
                    {userData.name}
                  </h2>
                  <div className="text-muted-foreground flex items-center gap-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="bg-muted/50 rounded-full px-3 py-1 font-mono text-sm tracking-wider">
                      {userData.profile.documentNumber}
                    </span>
                  </div>
                </div>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="documentNumber">Document Number</Label>
                        <Input
                          id="documentNumber"
                          value={formData.documentNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documentNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nationality: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                      ).toLocaleDateString(locale, { timeZone: "UTC" })}
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
                      {new Date(userData.profile.issueDate).toLocaleDateString(
                        locale,
                        { timeZone: "UTC" },
                      )}
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
                      {new Date(userData.profile.expiryDate).toLocaleDateString(
                        locale,
                        { timeZone: "UTC" },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatisticsPanel statistics={userData.statistics} />
    </>
  );
}
