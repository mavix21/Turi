import { Check } from "lucide-react";

interface PostcardCardProps {
  name: string;
  image: string;
  collected: boolean;
  collectionProgress?: number;
  totalInCollection?: number;
}

export function PostcardCard({
  name,
  image,
  collected,
  collectionProgress = 0,
  totalInCollection = 5,
}: PostcardCardProps) {
  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="bg-card card-shadow transform overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Verification Badge */}
          {collected && (
            <div className="bg-primary border-card absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg">
              <Check
                className="text-primary-foreground h-5 w-5"
                strokeWidth={3}
              />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="from-foreground/20 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Card Content */}
        <div className="p-4 text-center">
          <h3 className="text-foreground mb-3 text-sm font-bold tracking-wider uppercase">
            {name}
          </h3>

          {/* Collection Progress Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: totalInCollection }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index < collectionProgress ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* NFT Badge (optional - shows on hover) */}
      {collected && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap shadow-lg">
            Verified On-Chain
          </div>
        </div>
      )}
    </div>
  );
}
