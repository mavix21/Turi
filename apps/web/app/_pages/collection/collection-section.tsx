import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@turi/ui/components/button";

import { PostcardCard } from "./ui/postcard-card";

interface NftPostcardProps {
  id: string;
  name: string;
  image: string;
  collected: boolean;
  collectionProgress: number;
  totalInCollection: number;
}

export function CollectionSection({
  nftPostcards,
}: {
  nftPostcards: NftPostcardProps[];
}) {
  const t = useTranslations("home.collection");

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-3 text-4xl font-bold md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        <div className="relative">
          <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {nftPostcards.map((postcard) => (
              <PostcardCard
                key={postcard.id}
                name={postcard.name}
                image={postcard.image}
                collected={postcard.collected}
                collectionProgress={postcard.collectionProgress}
                totalInCollection={postcard.totalInCollection}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="bg-card border-border hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full border transition">
              <ChevronLeft className="text-muted-foreground h-5 w-5" />
            </button>
            <button className="bg-card border-border hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full border transition">
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-primary/5 border-primary/20 mt-12 rounded-2xl border p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <svg
                className="text-primary-foreground h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-foreground mb-2 text-xl font-bold">
                {t("blockchainProof.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("blockchainProof.description")}
              </p>
            </div>
            <Link href="/profile">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                {t("viewCollection")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
