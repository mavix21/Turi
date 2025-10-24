import { PartnerCard } from "./ui/partner-card";

interface PartnerDiscountProps {
  id: string;
  name: string;
  discount: string;
  pointsCost: number;
  description: string;
  image: string;
}
export function PartnerDiscountSection({
  partnerDiscounts,
}: {
  partnerDiscounts: PartnerDiscountProps[];
}) {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-foreground mb-3 text-4xl font-bold md:text-5xl">
            Partner Discount Bundles
          </h2>
          <p className="text-muted-foreground text-lg">
            Exclusive Peru travel offers for Turi members
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {partnerDiscounts.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              discount={partner.discount}
              pointsCost={partner.pointsCost}
              description={partner.description}
              image={partner.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
