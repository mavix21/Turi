import { useLocalStorage } from "./use-local-storage";

interface UserState {
  digitalId: string;
  turiScore: number;
  role: "PERUANO" | "EXTRANJERO";
  digitalPostcards: string[];
  nextAchievementGoal: string;
  nextAchievementPoints: number;
  trustScore: number;
  verificationBadges: string[];
  memberSince: string;
  totalExperiences: number;
}

interface ClaimHistory {
  id: string;
  location: string;
  timestamp: string;
  pointsEarned: number;
}

const defaultUserState: UserState = {
  digitalId: "TUR-2025-PE-001847",
  turiScore: 1250,
  role: "PERUANO",
  digitalPostcards: ["Machu Picchu", "Sacred Valley", "Lake Titicaca"],
  nextAchievementGoal: "Explorer Elite",
  nextAchievementPoints: 2000,
  trustScore: 92,
  verificationBadges: ["Email Verified", "ID Verified", "Phone Verified"],
  memberSince: "Jan 2024",
  totalExperiences: 12,
};

const defaultClaimHistory: ClaimHistory[] = [
  {
    id: "1",
    location: "Machu Picchu",
    timestamp: "Today at 2:30 PM",
    pointsEarned: 100,
  },
  {
    id: "2",
    location: "Sacred Valley",
    timestamp: "Yesterday at 10:15 AM",
    pointsEarned: 100,
  },
  {
    id: "3",
    location: "Lake Titicaca",
    timestamp: "2 days ago at 4:45 PM",
    pointsEarned: 100,
  },
];

export function useTuriState() {
  const [user, setUser] = useLocalStorage<UserState>(
    "turi_user_state",
    defaultUserState,
  );
  const [claimHistory, setClaimHistory] = useLocalStorage<ClaimHistory[]>(
    "turi_claim_history",
    defaultClaimHistory,
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "turi_favorites",
    [],
  );

  const updateUserPoints = (points: number) => {
    setUser((prev) => ({
      ...prev,
      turiScore: prev.turiScore + points,
    }));
  };

  const addDigitalPostcard = (postcard: string) => {
    setUser((prev) => ({
      ...prev,
      digitalPostcards: [...prev.digitalPostcards, postcard],
    }));
  };

  const addClaimHistory = (location: string, pointsEarned: number) => {
    const newClaim: ClaimHistory = {
      id: String(claimHistory.length + 1),
      location,
      timestamp: "Just now",
      pointsEarned,
    };
    setClaimHistory((prev) => [newClaim, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const resetUserState = () => {
    setUser(defaultUserState);
    setClaimHistory(defaultClaimHistory);
    setFavorites([]);
  };

  return {
    user,
    setUser,
    claimHistory,
    setClaimHistory,
    favorites,
    setFavorites,
    updateUserPoints,
    addDigitalPostcard,
    addClaimHistory,
    toggleFavorite,
    isFavorite,
    resetUserState,
  };
}
