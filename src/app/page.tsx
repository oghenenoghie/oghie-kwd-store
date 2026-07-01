import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { ProductGrid } from "@/components/product/product-grid";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { results } = await getProducts({ ordering: "-created", in_stock: true });
    return results.slice(0, 8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <CategoryTiles />
      <section className="mx-auto w-full max-w-7xl px-6 pb-24">
        <h2 className="font-display text-display-m text-ink">New arrivals</h2>
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </div>
  );
}
