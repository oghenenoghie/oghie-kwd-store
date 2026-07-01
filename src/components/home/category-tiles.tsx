import Link from "next/link";

const CATEGORIES = [
  { label: "Women", href: "/products?category=women" },
  { label: "Men", href: "/products?category=men" },
  { label: "Accessories", href: "/products?category=accessories" },
];

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group relative flex aspect-[4/5] items-end overflow-hidden bg-charcoal p-6 transition-colors hover:bg-ink"
          >
            <span className="font-display text-display-m text-bone transition-transform duration-300 group-hover:-translate-y-1">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
