"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer } from "vaul";
import { ChevronDown, LayoutGrid, Rows3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ORDERING_OPTIONS = [
  { label: "Newest", value: "-created" },
  { label: "Price: low to high", value: "price" },
  { label: "Price: high to low", value: "-price" },
];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Accessories", value: "accessories" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "");

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  const activeFilterCount = [
    searchParams.get("min_price"),
    searchParams.get("max_price"),
    searchParams.get("in_stock"),
  ].filter(Boolean).length;

  const view = searchParams.get("view") === "compact" ? "compact" : "comfortable";

  return (
    <div className="flex items-stretch overflow-x-auto border-y border-ink/10 font-body text-caption uppercase tracking-widest text-ink">
      <button
        type="button"
        onClick={() => setFilterOpen(true)}
        className="flex flex-shrink-0 items-center gap-1 border-r border-ink/10 px-3 py-3 hover:bg-ink/5 sm:px-4"
      >
        Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
      </button>

      <div className="relative flex flex-shrink-0 items-center border-r border-ink/10 px-3 py-3 hover:bg-ink/5 sm:px-4">
        <select
          value={searchParams.get("ordering") ?? ""}
          onChange={(event) => updateParams({ ordering: event.target.value })}
          aria-label="Sort by"
          className="w-24 appearance-none truncate bg-transparent pr-5 focus:outline-none"
        >
          <option value="">Sort by</option>
          {ORDERING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 sm:right-4" />
      </div>

      <div className="min-w-4 flex-1" />

      <div className="flex flex-shrink-0 items-center gap-1 px-3 py-3 sm:px-4">
        <button
          type="button"
          aria-label="Comfortable grid"
          aria-pressed={view === "comfortable"}
          onClick={() => updateParams({ view: "" })}
          className={cn("p-1", view === "comfortable" ? "text-ink" : "text-stone")}
        >
          <Rows3 size={16} />
        </button>
        <button
          type="button"
          aria-label="Compact grid"
          aria-pressed={view === "compact"}
          onClick={() => updateParams({ view: "compact" })}
          className={cn("p-1", view === "compact" ? "text-ink" : "text-stone")}
        >
          <LayoutGrid size={16} />
        </button>
      </div>

      <Drawer.Root direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Drawer.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-bone normal-case tracking-normal outline-none">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <Drawer.Title className="font-display text-display-m text-ink">Filter</Drawer.Title>
              <Drawer.Close aria-label="Close filters" className="text-ink hover:text-brass">
                <X size={20} />
              </Drawer.Close>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <div>
                <p className="font-body text-caption uppercase tracking-widest text-stone">Category</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => {
                    const active = (searchParams.get("category") ?? "") === category.value;
                    return (
                      <button
                        key={category.label}
                        type="button"
                        onClick={() => updateParams({ category: category.value })}
                        className={cn(
                          "border px-3 py-1.5 font-body text-sm",
                          active ? "border-ink bg-ink text-bone" : "border-ink/20 text-ink hover:border-ink",
                        )}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-body text-caption uppercase tracking-widest text-stone">Price</p>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    className="w-full border border-ink/20 bg-bone px-3 py-2 font-body text-sm text-ink"
                  />
                  <span className="text-stone">–</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className="w-full border border-ink/20 bg-bone px-3 py-2 font-body text-sm text-ink"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-body text-sm text-ink">
                <input
                  type="checkbox"
                  checked={searchParams.get("in_stock") === "true"}
                  onChange={(event) => updateParams({ in_stock: event.target.checked ? "true" : "" })}
                />
                In stock only
              </label>
            </div>

            <div className="flex gap-3 border-t border-ink/10 px-6 py-5">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  updateParams({ category: "", min_price: "", max_price: "", in_stock: "" });
                }}
              >
                Clear all
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  updateParams({ min_price: minPrice, max_price: maxPrice });
                  setFilterOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
