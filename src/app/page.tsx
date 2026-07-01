import { Hero } from "@/components/home/hero";
import { ShopTheLook } from "@/components/home/shop-the-look";
import { ProductCarousel } from "@/components/product/product-carousel";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";

export const revalidate = 60;

async function getHomepageProducts(): Promise<{ newArrivals: Product[]; accessories: Product[] }> {
  try {
    const [newArrivals, accessories] = await Promise.all([
      getProducts({ ordering: "-created", in_stock: true }),
      getProducts({ category: "accessories" }),
    ]);
    return {
      newArrivals: newArrivals.results.slice(0, 12),
      accessories: accessories.results.slice(0, 12),
    };
  } catch {
    return { newArrivals: [], accessories: [] };
  }
}

export default async function Home() {
  const { newArrivals, accessories } = await getHomepageProducts();

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <ProductCarousel
        overline="New season"
        title="New arrivals"
        viewAllHref="/products?ordering=-created"
        products={newArrivals}
      />
      <ProductCarousel
        overline="Curated"
        title="Accessories"
        viewAllHref="/products?category=accessories"
        products={accessories}
      />
      <ShopTheLook products={newArrivals.slice(0, 3)} />
    </div>
  );
}
