import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { getProducts } from "@/lib/api/products";
import type { Product, ProductFilters as ProductFiltersType } from "@/lib/api/types";

export const revalidate = 60;

type SearchParams = Record<string, string | string[] | undefined>;

function toFilters(searchParams: SearchParams): ProductFiltersType {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    search: get("search"),
    category: get("category"),
    currency: get("currency"),
    ordering: get("ordering"),
    min_price: get("min_price") ? Number(get("min_price")) : undefined,
    max_price: get("max_price") ? Number(get("max_price")) : undefined,
    in_stock: get("in_stock") === "true" ? true : undefined,
    min_rating: get("min_rating") ? Number(get("min_rating")) : undefined,
  };
}

async function getFilteredProducts(filters: ProductFiltersType): Promise<Product[]> {
  try {
    const { results } = await getProducts(filters);
    return results;
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = toFilters(await searchParams);
  const products = await getFilteredProducts(filters);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="font-display text-display-l text-ink">
        {filters.category ? filters.category.replace(/-/g, " ") : "All products"}
      </h1>
      <div className="mt-8">
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>
      </div>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
