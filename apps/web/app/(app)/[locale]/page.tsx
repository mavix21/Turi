import { useTranslations } from "next-intl";

import { CollectionSection } from "@/app/_pages/collection";
import { ExploreSection } from "@/app/_pages/explore";
import { HeroSection } from "@/app/_pages/hero";
import { PartnerDiscountSection } from "@/app/_pages/partner-discount";

import {
  exploreCategories,
  nftPostcards,
  partnerDiscounts,
  peruDestinations,
} from "./mock-data";

export default function HomePage() {
  const t = useTranslations("home.footer");

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <HeroSection peruDestinations={peruDestinations} />

      {/* Main Content */}
      <main className="mx-auto mb-24 w-full px-4 lg:container">
        {/* Explore Section */}
        <ExploreSection exploreCategories={exploreCategories} />
        <CollectionSection nftPostcards={nftPostcards} />
        <PartnerDiscountSection />
      </main>

      {/* Footer */}
      <footer className="border-border bg-card border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-foreground mb-4 font-semibold">
                {t("about.title")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {t("about.description")}
              </p>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">
                {t("company.title")}
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("company.aboutUs")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("company.careers")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("company.blog")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">
                {t("support.title")}
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("support.helpCenter")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("support.contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("support.faq")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">
                {t("legal.title")}
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("legal.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("legal.terms")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    {t("legal.cookies")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-muted-foreground text-sm">{t("copyright")}</p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                {t("social.x")}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                {t("social.instagram")}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                {t("social.linkedin")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
