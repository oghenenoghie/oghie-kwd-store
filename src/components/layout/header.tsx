"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Heart, ShoppingBag, User } from "lucide-react";
import { AnnouncementBar } from "./announcement-bar";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { useScrollShrink } from "@/hooks/use-scroll-shrink";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useActiveCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

// Only the homepage has a full-bleed hero the header can float over.
const TRANSPARENT_ROUTES = new Set(["/"]);

export function Header() {
  const pathname = usePathname();
  const transparentOnTop = TRANSPARENT_ROUTES.has(pathname);
  const isShrunk = useScrollShrink(80);
  const { open: openCart } = useCartDrawer();
  const { data: cart } = useActiveCart();
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isTransparent = transparentOnTop && !isShrunk;

  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--header-height", `${entry.contentRect.height}px`);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        isTransparent ? "bg-transparent" : "bg-bone border-b border-ink/10",
      )}
    >
      {!isTransparent && <AnnouncementBar />}

      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300",
          isShrunk ? "py-3" : "py-6",
        )}
      >
        <div className="flex flex-1 items-center gap-8">
          <MobileNav light={isTransparent} />
          <MegaMenu light={isTransparent} />
        </div>

        <Link
          href="/"
          className={cn(
            "font-display text-display-m tracking-wide transition-colors",
            isTransparent ? "text-bone" : "text-ink",
          )}
        >
          OGHIE
        </Link>

        <div className="flex flex-1 items-center justify-end gap-6">
          <span className={isTransparent ? "text-bone" : "text-ink"}>
            <SearchDialog />
          </span>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={cn("transition-colors hover:text-brass", isTransparent ? "text-bone" : "text-ink")}
          >
            <Heart size={20} />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className={cn(
              "relative transition-colors hover:text-brass",
              isTransparent ? "text-bone" : "text-ink",
            )}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-oxblood text-[10px] text-bone">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className={cn("hidden transition-colors hover:text-brass sm:block", isTransparent ? "text-bone" : "text-ink")}
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
