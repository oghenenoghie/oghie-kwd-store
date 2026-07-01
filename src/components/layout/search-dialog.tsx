"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isFetching } = useQuery({
    queryKey: ["products", "search", debouncedQuery],
    queryFn: () => getProducts({ search: debouncedQuery }),
    enabled: open && debouncedQuery.length > 1,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Search"
        className="text-ink transition-colors hover:text-brass"
      >
        <Search size={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[92vw] max-w-xl -translate-x-1/2 bg-bone p-6 shadow-2xl">
          <VisuallyHidden.Root asChild>
            <Dialog.Title>Search products</Dialog.Title>
          </VisuallyHidden.Root>
          <div className="flex items-center gap-3 border-b border-ink/20 pb-3">
            <Search size={18} className="text-stone" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent font-body text-body-base text-ink outline-none placeholder:text-stone"
            />
            <Dialog.Close aria-label="Close search" className="text-stone hover:text-ink">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="mt-4 max-h-96 space-y-1 overflow-y-auto">
            {isFetching && <p className="py-6 text-center text-caption text-stone">Searching…</p>}
            {!isFetching && debouncedQuery.length > 1 && data?.results.length === 0 && (
              <p className="py-6 text-center text-caption text-stone">No results for “{debouncedQuery}”.</p>
            )}
            {data?.results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-2 py-3 font-body text-sm text-ink transition-colors hover:bg-ink/5"
              >
                <span>{product.name}</span>
                <span className="text-stone">
                  {product.currency} {product.price}
                </span>
              </Link>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
