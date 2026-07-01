import Image from "next/image";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ShopTheLook({
  lifestyleImage,
  lifestyleAlt,
  products,
}: {
  lifestyleImage: string;
  lifestyleAlt: string;
  products: ProductCardData[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-center font-display text-2xl text-ink">
        Shop the Look
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone">
          <Image
            src={lifestyleImage}
            alt={lifestyleAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 self-start md:grid-cols-1">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
