"use client";

import Link from "next/link";
import { Drawer } from "vaul";
import { Menu, X } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

export function MobileNav({ light }: { light: boolean }) {
  return (
    <Drawer.Root direction="left">
      <Drawer.Trigger
        aria-label="Open menu"
        className={cn("lg:hidden", light ? "text-bone" : "text-ink")}
      >
        <Menu size={22} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-bone outline-none">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <Drawer.Title className="font-display text-display-m text-ink">Menu</Drawer.Title>
            <Drawer.Close aria-label="Close menu" className="text-ink hover:text-brass">
              <X size={20} />
            </Drawer.Close>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="mb-6">
                <Drawer.Close asChild>
                  <Link href={section.href} className="font-display text-display-m text-ink">
                    {section.label}
                  </Link>
                </Drawer.Close>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Drawer.Close asChild>
                        <Link href={link.href} className="font-body text-sm text-charcoal">
                          {link.label}
                        </Link>
                      </Drawer.Close>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
