"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative flex h-[92vh] min-h-[560px] items-end bg-ink"
      style={{ marginTop: "calc(var(--header-height, 75px) * -1)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-7xl px-6 pb-20"
      >
        <p className="font-body text-caption uppercase tracking-[0.3em] text-brass">
          New season
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-display-xl font-light text-bone">
          Quiet luxury, considered detail.
        </h1>
        <p className="mt-4 max-w-md font-body text-body-l text-bone/80">
          Tailoring and accessories built for permanence, not trend cycles.
        </p>
        <Link href="/products" className="mt-8 inline-block">
          <Button variant="primary" size="lg">
            Shop the collection
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
