"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const ORDERING_OPTIONS = [
  { label: "Newest", value: "-created" },
  { label: "Price: low to high", value: "price" },
  { label: "Price: high to low", value: "-price" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-ink/10 pb-6">
      <select
        value={searchParams.get("ordering") ?? ""}
        onChange={(event) => updateParam("ordering", event.target.value)}
        className="border border-ink/20 bg-bone px-3 py-2 font-body text-sm text-ink"
      >
        <option value="">Sort</option>
        {ORDERING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 font-body text-sm text-ink">
        <input
          type="checkbox"
          checked={searchParams.get("in_stock") === "true"}
          onChange={(event) => updateParam("in_stock", event.target.checked ? "true" : "")}
        />
        In stock only
      </label>
    </div>
  );
}
