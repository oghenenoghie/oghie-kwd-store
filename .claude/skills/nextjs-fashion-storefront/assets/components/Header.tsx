"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";

export type MegaMenuSection = {
  label: string;
  href: string;
  links?: { label: string; href: string }[];
  featured?: { label: string; href: string; image: string }[];
};

export function Header({
  brandName,
  logoSrc,
  sections,
  cartCount = 0,
}: {
  brandName: string;
  logoSrc?: string;
  sections: MegaMenuSection[];
  cartCount?: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone/20 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Left: nav (desktop) / hamburger (mobile) */}
        <div className="flex items-center gap-6">
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5 text-ink" />
          </button>

          <NavigationMenu.Root className="relative hidden md:block">
            <NavigationMenu.List className="flex gap-6">
              {sections.map((section) => (
                <NavigationMenu.Item key={section.label}>
                  <NavigationMenu.Trigger className="text-xs uppercase tracking-widest text-ink">
                    {section.label}
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="absolute left-0 top-full w-screen max-w-md border border-stone/20 bg-bone p-6 shadow-lg">
                    <div className="grid grid-cols-2 gap-6">
                      {section.links && (
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="text-sm text-ink hover:text-accent"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.featured && (
                        <div className="grid grid-cols-2 gap-2">
                          {section.featured.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="relative block aspect-[3/4] overflow-hidden bg-stone/10"
                            >
                              <Image
                                src={item.image}
                                alt={item.label}
                                fill
                                className="object-cover"
                              />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        {/* Center: logo */}
        <Link href="/" className="font-display text-xl tracking-wide text-ink">
          {logoSrc ? (
            <Image src={logoSrc} alt={brandName} width={140} height={32} />
          ) : (
            brandName
          )}
        </Link>

        {/* Right: utility icons */}
        <div className="flex items-center gap-4">
          <button aria-label="Search">
            <Search className="h-5 w-5 text-ink" />
          </button>
          <Link href="/account" aria-label="Account" className="hidden md:block">
            <User className="h-5 w-5 text-ink" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-ink" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-ink" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-bone">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-bone md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-display text-lg">{brandName}</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              ✕
            </button>
          </div>
          <ul className="space-y-4 px-4">
            {sections.map((section) => (
              <li key={section.label}>
                <p className="text-sm uppercase tracking-widest text-ink">
                  {section.label}
                </p>
                {section.links && (
                  <ul className="mt-2 space-y-2 pl-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-stone">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
