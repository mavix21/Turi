import { IconBrandGithub, IconRocket } from "@tabler/icons-react";

import { ExploreSection } from "@/app/_pages/explore";
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

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 border-b px-4 backdrop-blur">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <IconRocket className="size-6" />
            <span className="text-xl font-bold">Next.js Monorepo</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto pt-24">
        {/* Explore Section */}
        <ExploreSection exploreCategories={exploreCategories} places={places} />
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Next.js Monorepo Template. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Monorepo Structure",
    description:
      "Efficiently manage multiple packages and applications in a single repository.",
    icon: IconRocket,
  },
  {
    title: "Modern UI",
    description:
      "Beautiful and responsive UI components built with Tailwind CSS.",
    icon: IconRocket,
  },
  {
    title: "Type Safety",
    description: "Full TypeScript support for better development experience.",
    icon: IconRocket,
  },
];
