import Image from "next/image";
import Link from "next/link";

import { Button } from "@turi/ui/components/button";

interface PartnerCardProps {
  name: string;
  discount: string;
  pointsCost: number;
  description: string;
  image: string;
}

export function PartnerCard({
  name,
  discount,
  pointsCost,
  description,
  image,
}: PartnerCardProps) {
  return (
    <div className="bg-card card-shadow group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Discount Badge */}
        <div className="bg-card absolute top-4 right-4 rounded-full px-3 py-1.5 shadow-lg">
          <span className="text-primary text-sm font-bold">{discount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-foreground mb-2 text-xl font-bold">{name}</h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {description}
        </p>

        {/* Redeem Button */}
        <Link href="/profile">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
            Redeem • {pointsCost} pts
          </Button>
        </Link>
      </div>
    </div>
  );
}
