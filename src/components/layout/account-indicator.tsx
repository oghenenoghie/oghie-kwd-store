"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

function getInitials(source: string) {
  const cleaned = source.trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Signed-out visitors get the plain account icon; once signed in it swaps
 * to a small initials avatar so there's a visible "you're signed in"
 * indicator (the backend has no profile picture field, so initials are the
 * only image-like identity signal available - see AuthUser in
 * lib/api/types.ts).
 */
export function AccountIndicator({ light }: { light: boolean }) {
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUser();

  if (isAuthenticated && user) {
    const initials = getInitials(user.username || user.email);
    return (
      <Link
        href="/account"
        aria-label={`Account, signed in as ${user.username}`}
        className="hidden transition-opacity hover:opacity-80 sm:block"
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full font-body text-[11px] font-semibold uppercase",
            light ? "bg-bone text-ink" : "bg-brass text-ink",
          )}
        >
          {initials}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      aria-label="Account"
      className={cn("hidden transition-colors hover:text-brass sm:block", light ? "text-bone" : "text-ink")}
    >
      <User size={20} />
    </Link>
  );
}
