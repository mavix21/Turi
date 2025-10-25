import { PlaceDetailPage } from "@/app/_pages/place";

const placeData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Machu Picchu",
    location: "Cusco, Peru",
    province: "Urubamba",
    department: "Cusco",
    rating: 4.9,
    reviews: 14000,
    price: 148,
    image: "/machu-picchu.png",
    category: "Archaeological Site",
    tags: ["UNESCO World Heritage", "Archaeological Site", "Mountain"],
    description:
      "Machu Picchu is an ancient Incan citadel set high in the Andes Mountains. Built in the mid-15th century, this iconic site showcases remarkable Incan architecture and engineering. Perched at 2,430 meters above sea level, it offers breathtaking views and a glimpse into the sophisticated civilization that built it.",
    highlights: [
      {
        title: "Ancient Architecture",
        description:
          "Explore perfectly fitted stone structures built without mortar",
      },
      {
        title: "Mountain Views",
        description:
          "Experience stunning panoramic vistas of the surrounding peaks",
      },
      {
        title: "Rich History",
        description:
          "Discover the mysteries of the Incan Empire and its people",
      },
      {
        title: "Guided Tours",
        description:
          "Learn from expert guides about the site's fascinating history",
      },
    ],
    bestTime: "May to October (dry season)",
    duration: "Full day (6-8 hours)",
    difficulty: "Moderate to Challenging",
    accessibility: "Accessible via train and bus from Cusco",
    nftPostcard: {
      name: "Machu Picchu",
      image: "/flat-vector-illustration-of-machu-picchu-peru-with.jpg",
    },
  },
  "2": {
    id: "2",
    name: "Sacred Valley",
    location: "Cusco Region, Peru",
    province: "Cusco",
    department: "Cusco",
    rating: 4.8,
    reviews: 9500,
    price: 125,
    image: "/sacsayhuaman.jpg",
    category: "Cultural Experience",
    tags: ["Cultural Heritage", "Mountain Valley", "Local Markets"],
    description:
      "The Sacred Valley is a region of the Andes Mountains in Peru that was sacred to the Inca. It stretches for about 60 kilometers and is home to several important Incan sites and charming villages.",
    highlights: [
      {
        title: "Local Markets",
        description:
          "Shop at vibrant indigenous markets with traditional crafts",
      },
      {
        title: "Incan Ruins",
        description:
          "Visit multiple archaeological sites throughout the valley",
      },
      {
        title: "Traditional Villages",
        description: "Experience authentic Peruvian culture and hospitality",
      },
      {
        title: "Agricultural Terraces",
        description: "See ancient farming techniques still in use today",
      },
    ],
    bestTime: "April to October",
    duration: "2-3 days",
    difficulty: "Easy to Moderate",
    accessibility: "Accessible by car from Cusco",
    nftPostcard: {
      name: "Sacred Valley",
      image: "/stylized-illustration-of-cusco-peru-historic-plaza.jpg",
    },
  },
};

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PlaceDetailPage id={id} />;
}
