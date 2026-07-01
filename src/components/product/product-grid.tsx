import type { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center font-body text-sm text-stone">No products found.</p>;
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 @lg:grid-cols-3 @2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
