import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import { Link } from "@/app/_shared/i18n";

interface PlaceCardProps {
  id: string;
  name: string;
  location: string;
  province: string;
  department: string;
  rating: number;
  price: number;
  image: string;
}

export function PlaceCard({
  id,
  name,
  province,
  department,
  rating,
  price,
  image,
}: PlaceCardProps) {
  const handleNavigate = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link href={`/place/${id}`} onClick={handleNavigate}>
      <div className="bg-card card-shadow group overflow-hidden rounded-2xl border transition hover:shadow-xl">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            width={100}
            height={100}
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-md">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-foreground text-sm font-semibold">
              {rating}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-foreground mb-2 text-lg font-bold">{name}</h3>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="text-primary h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  {province}, {department}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-foreground text-xl font-bold">${price}</p>
              <p className="text-muted-foreground text-xs">/Day</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
