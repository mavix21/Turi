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
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <HeroSection peruDestinations={peruDestinations} />

      {/* Main Content */}
      <main className="container mx-auto mb-24">
        {/* Explore Section */}
        <ExploreSection exploreCategories={exploreCategories} />
        <CollectionSection nftPostcards={nftPostcards} />
        <PartnerDiscountSection partnerDiscounts={partnerDiscounts} />
      </main>

      {/* Footer */}
      <footer className="border-border bg-card border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-foreground mb-4 font-semibold">About</h4>
              <p className="text-muted-foreground text-sm">
                Discover Peru's wonders and earn rewards with Turi
              </p>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Company</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Support</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Legal</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2025 Turi. All rights reserved.
            </p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                X
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
