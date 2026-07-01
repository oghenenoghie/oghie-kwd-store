"use client";

import { useState } from "react";
import { X } from "lucide-react";

const MESSAGE = "Complimentary shipping on orders over $200 — worldwide.";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-center bg-ink px-10 py-2 text-center font-body text-caption tracking-wide text-bone">
      <p>{MESSAGE}</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone"
      >
        <X size={14} />
      </button>
    </div>
  );
}
