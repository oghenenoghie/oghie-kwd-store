"use client";

import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { NAV_SECTIONS } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export function MegaMenu({ light }: { light: boolean }) {
  return (
    <NavigationMenu.Root className="relative hidden lg:block" delayDuration={100}>
      <NavigationMenu.List className="flex items-center gap-8">
        {NAV_SECTIONS.map((section) => (
          <NavigationMenu.Item key={section.label}>
            <NavigationMenu.Trigger
              className={cn(
                "font-body text-sm tracking-wide transition-colors",
                light ? "text-bone hover:text-brass" : "text-ink hover:text-brass",
              )}
            >
              {section.label}
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="absolute left-0 top-full w-screen max-w-2xl border border-ink/10 bg-bone p-8 shadow-xl">
              <div className="grid grid-cols-3 gap-8">
                <ul className="col-span-1 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-body text-sm text-charcoal transition-colors hover:text-brass"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  {section.tiles.map((tile) => (
                    <Link
                      key={tile.href}
                      href={tile.href}
                      className="group relative flex aspect-[4/5] items-end overflow-hidden bg-charcoal p-4"
                    >
                      <span className="font-display text-body-l text-bone transition-transform group-hover:-translate-y-1">
                        {tile.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
