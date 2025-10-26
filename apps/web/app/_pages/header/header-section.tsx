"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@turi/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@turi/ui/components/sheet";
import { cn } from "@turi/ui/lib/utils";

import { Link } from "@/app/_shared/i18n";
import { LanguageSwitcher } from "@/app/_shared/ui/language-switcher";
import { ThemeSwitcher } from "@/app/_shared/ui/theme-switcher";

import { AuthMenu } from "./auth-menu";
import { NavLinks, useHeaderNavigationLinks } from "./nav-links";

export function HeaderSection() {
  const navigationLinks = useHeaderNavigationLinks();

  return (
    <header className="bg-background border-border fixed top-0 right-0 left-0 z-50 border-b shadow-lg transition-all duration-500 ease-in-out">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 transition-all duration-300 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-3 md:flex-1">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/turi-logo.png" alt="Turi" height="56" width="150" />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col px-0 pb-0">
              <SheetHeader className="border-b px-4 pt-12 pb-4">
                <SheetTitle className="sr-only">Primary Navigation</SheetTitle>
                <AuthMenu isMobile />
              </SheetHeader>
              <div className="flex h-full flex-col overflow-y-auto">
                <nav className="flex flex-col gap-2 px-4 py-6">
                  {navigationLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-base font-medium transition",
                          link.isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <SheetFooter className="mt-auto gap-4 border-t px-4 py-6 md:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                  </div>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <NavLinks className="md:flex-1 md:justify-center" />
        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
