export interface Place {
  id: string;
  name: string;
  type: "restaurant" | "hotel" | "museum" | "landmark" | "business";
  slug: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  description: string;
  rating: number;
  openingHours: string;
  checkInRadius: number; // in meters
  points: number;
  nftReward: boolean;
  image?: string;
  distance?: number;
  isInRange?: boolean;
}
