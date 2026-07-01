"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FOOTER_COLUMNS } from "@/lib/nav-data";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="bg-ink text-bone">
      <div className="bg-charcoal">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-display-m">Stay in the know</p>
            <p className="mt-1 font-body text-caption text-stone">
              New arrivals, restocks, and quiet-luxury essentials — no spam.
            </p>
          </div>
          {submitted ? (
            <p className="font-body text-sm text-brass">You&rsquo;re on the list.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full border border-bone/30 bg-transparent px-4 py-2 font-body text-sm text-bone outline-none placeholder:text-stone focus:border-brass"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="font-body text-caption uppercase tracking-widest text-stone">{column.heading}</h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-bone/90 hover:text-brass">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 border-t border-bone/10 px-6 py-6 sm:flex-row sm:justify-between">
        <p className="font-body text-caption text-stone">Visa · Mastercard · Amex · Apple Pay</p>
        <p className="font-body text-caption text-stone">© {new Date().getFullYear()} Oghie Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
