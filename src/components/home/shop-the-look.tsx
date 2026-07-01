import type { Product } from "@/lib/api/types";
import { ProductCard } from "@/components/product/product-card";

export function ShopTheLook({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-center font-display text-display-m text-ink">Shop the Look</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/5] w-full bg-charcoal/10" />
        <div className="grid grid-cols-2 gap-4 self-start md:grid-cols-1">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
