"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@turi/ui/components/button";

import { useAppKit } from "@/reown";

export function ConnectButton() {
  const { open } = useAppKit();
  const t = useTranslations("auth-actions");

  return (
    <Button onClick={() => open({ view: "Connect" })}>{t("signIn")}</Button>
  );
}
