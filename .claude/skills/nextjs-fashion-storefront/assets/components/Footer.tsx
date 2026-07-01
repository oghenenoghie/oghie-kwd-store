import Link from "next/link";

export type FooterLinkColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export function Footer({
  brandName,
  columns,
  socials,
}: {
  brandName: string;
  columns: FooterLinkColumn[];
  socials: { label: string; href: string }[];
}) {
  return (
    <footer className="bg-ink text-bone">
      {/* Newsletter band — above the link columns, visually distinct */}
      <div className="border-b border-bone/10 px-4 py-10 text-center">
        <h2 className="font-display text-xl">Newsletter</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-bone/70">
          Get first access to new arrivals, inspiration, and services.
        </p>
        <form className="mx-auto mt-4 flex max-w-sm gap-2">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-bone/30 bg-transparent px-3 py-2 text-sm placeholder:text-bone/50"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-bone px-4 py-2 text-xs uppercase tracking-widest text-ink"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-xs uppercase tracking-widest text-bone/60">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-bone/90">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Socials — quiet, small, doesn't compete with columns */}
      <div className="mx-auto flex max-w-7xl gap-4 px-4 pb-6">
        {socials.map((social) => (
          <Link
            key={social.href}
            href={social.href}
            className="text-xs text-bone/50 hover:text-bone"
          >
            {social.label}
          </Link>
        ))}
      </div>

      {/* Legal / trademark line — smallest text, last element */}
      <div className="border-t border-bone/10 px-4 py-4 text-center text-[11px] text-bone/40">
        {brandName}® and its designs are registered trademarks.
      </div>
    </footer>
  );
}
