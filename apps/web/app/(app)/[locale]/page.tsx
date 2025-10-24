import { IconBrandGithub, IconRocket } from "@tabler/icons-react";

import { CollectionSection } from "@/app/_pages/collection";
import { ExploreSection } from "@/app/_pages/explore";
import { HeroSection } from "@/app/_pages/hero";
import { PartnerDiscountSection } from "@/app/_pages/partner-discount";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

export default function HomePage() {
  const exploreCategories = [
    { id: "popular", label: "Popular" },
    { id: "all", label: "All Places" },
    { id: "archaeological", label: "Archaeological Sites" },
    { id: "natural", label: "Natural Wonders" },
    { id: "museums", label: "Museums" },
    { id: "historic", label: "Historic Sites" },
  ];

  const places = [
    {
      id: "1",
      name: "Machu Picchu",
      province: "Urubamba",
      department: "Cusco",
      rating: 4.9,
      price: 148,
      image: "/tropical-island-mindanao-philippines.jpg",
      category: "archaeological",
      popular: true,
    },
    {
      id: "2",
      name: "Sacsayhuamán",
      province: "Cusco",
      department: "Cusco",
      rating: 4.8,
      price: 85,
      image: "/disneyland-tokyo-castle.jpg",
      category: "archaeological",
      popular: true,
    },
    {
      id: "3",
      name: "Colca Canyon",
      province: "Caylloma",
      department: "Arequipa",
      rating: 4.9,
      price: 120,
      image: "/thousand-islands-indonesia-tropical.jpg",
      category: "natural",
      popular: true,
    },
    {
      id: "4",
      name: "Lake Titicaca",
      province: "Puno",
      department: "Puno",
      rating: 4.9,
      price: 95,
      image: "/basilica-venice-italy.jpg",
      category: "natural",
      popular: true,
    },
    {
      id: "5",
      name: "Chan Chan",
      province: "Trujillo",
      department: "La Libertad",
      rating: 4.7,
      price: 75,
      image: "/tropical-island-mindanao-philippines.jpg",
      category: "archaeological",
      popular: false,
    },
    {
      id: "6",
      name: "Nazca Lines",
      province: "Nazca",
      department: "Ica",
      rating: 4.8,
      price: 110,
      image: "/mountain-volcano-landscape-scenic.jpg",
      category: "archaeological",
      popular: false,
    },
  ];

  const nftPostcards = [
    {
      id: "1",
      name: "Machu Picchu",
      image: "/flat-vector-illustration-of-machu-picchu-peru-with.jpg",
      collected: true,
      collectionProgress: 5,
      totalInCollection: 5,
    },
    {
      id: "2",
      name: "Cusco",
      image: "/stylized-illustration-of-cusco-peru-historic-plaza.jpg",
      collected: true,
      collectionProgress: 4,
      totalInCollection: 5,
    },
    {
      id: "3",
      name: "Lake Titicaca",
      image: "/artistic-illustration-of-lake-titicaca-peru-with-t.jpg",
      collected: true,
      collectionProgress: 3,
      totalInCollection: 5,
    },
    {
      id: "4",
      name: "Nazca Lines",
      image: "/flat-vector-illustration-of-nazca-lines-peru-deser.jpg",
      collected: false,
      collectionProgress: 2,
      totalInCollection: 5,
    },
    {
      id: "5",
      name: "Colca Canyon",
      image: "/stylized-illustration-of-colca-canyon-peru-with-co.jpg",
      collected: false,
      collectionProgress: 1,
      totalInCollection: 5,
    },
    {
      id: "6",
      name: "Lima",
      image: "/flat-vector-illustration-of-lima-peru-coastal-city.jpg",
      collected: false,
      collectionProgress: 0,
      totalInCollection: 5,
    },
  ];

  const partnerDiscounts = [
    {
      id: "1",
      name: "Andean Lodge Stays",
      discount: "30% OFF",
      pointsCost: 500,
      description: "Premium mountain accommodations in Peru",
      image: "/andean-lodge-mountain-accommodation-peru.jpg",
    },
    {
      id: "2",
      name: "Inca Trail Expeditions",
      discount: "20% OFF",
      pointsCost: 750,
      description: "Guided treks to Machu Picchu and beyond",
      image: "/inca-trail-trekking-expedition-machu-picchu.jpg",
    },
    {
      id: "3",
      name: "Peruvian Cuisine Dining",
      discount: "25% OFF",
      pointsCost: 300,
      description: "Authentic regional dining experiences",
      image: "/peruvian-cuisine-dining-authentic-food.jpg",
    },
    {
      id: "4",
      name: "Cultural Tours",
      discount: "35% OFF",
      pointsCost: 600,
      description: "Immersive Peruvian heritage experiences",
      image: "/peruvian-cultural-heritage-tour-experience.jpg",
    },
  ];

  const peruDestinations = [
    "Cusco, Peru",
    "Lima, Peru",
    "Arequipa, Peru",
    "Puno, Peru",
    "Iquitos, Peru",
    "Paracas, Peru",
    "Huaraz, Peru",
    "Trujillo, Peru",
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <HeroSection peruDestinations={peruDestinations} />

      {/* Main Content */}
      <main className="container mx-auto pt-24">
        {/* Explore Section */}
        <ExploreSection exploreCategories={exploreCategories} places={places} />
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
