"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Calendar, CreditCard, Edit, Globe, Shield, User, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

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
import {
  TuriTokenAbi,
  TuriTokenAddress,
  USDXAbi,
  USDXAddress,
} from "@/src/constants/abi";

export default function TouristPassportPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("home.profile.touristPassport");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    documentNumber: "",
    nationality: "",
    dateOfBirth: "",
  });

  const updateProfile = useMutation(api.userProfile.updateProfile);
  const userData = useQuery(api.users.getMyProfile);

  // Wallet connection and token balances
  const { address, isConnected } = useAccount();

  // Read USDX balance (6 decimals)
  const { data: usdxBalance } = useReadContract({
    address: USDXAddress,
    abi: USDXAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000,
    },
  });

  // Read TURI balance (18 decimals)
  const { data: turiBalance } = useReadContract({
    address: TuriTokenAddress,
    abi: TuriTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000,
    },
  });

  // Format balances for display
  const formattedUSDX =
    usdxBalance && typeof usdxBalance === "bigint"
      ? parseFloat(formatUnits(usdxBalance, 6)).toFixed(2)
      : "0.00";
  const formattedTURI =
    turiBalance && typeof turiBalance === "bigint"
      ? parseFloat(formatUnits(turiBalance, 18)).toFixed(2)
      : "0.00";

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
        <div className="text-muted-foreground">{t("loading")}</div>
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
                  {t("verified")}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h2 className="max-w-80 truncate bg-clip-text font-serif text-4xl font-bold lg:text-5xl">
                    {userData.name}
                  </h2>
                  <div className="text-muted-foreground flex items-center gap-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="bg-muted/50 rounded-full px-3 py-1 font-mono text-sm tracking-wider">
                      {userData.profile.documentNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {isConnected && address ? (
                    <div className="flex items-center gap-2 rounded-lg border bg-blue-500/5 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
                        <Wallet className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          USDX
                        </span>
                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          ${formattedUSDX}
                        </span>
                      </div>
                    </div>
                  ) : null}

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
                        <DialogTitle>{t("editProfile")}</DialogTitle>
                        <DialogDescription>{t("updateInfo")}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">{t("name")}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="documentNumber">
                            {t("documentNumber")}
                          </Label>
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
                          <Label htmlFor="nationality">{t("nationality")}</Label>
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
                          <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
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
                          {t("cancel")}
                        </Button>
                        <Button onClick={handleSave}>{t("saveChanges")}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                <div className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                      {t("nationality")}
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
                      {t("dateOfBirth")}
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
                      {t("issueDate")}
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
                      {t("expiryDate")}
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

      <StatisticsPanel
        statistics={userData.statistics}
        turiBalance={formattedTURI}
        reputationScore={userData.profile.reputationScore}
      />
    </>
  );
}
