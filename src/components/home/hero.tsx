"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CmsSection } from "@/lib/api/types";

const AUTOPLAY_MS = 6000;

const FALLBACK_SLIDE = {
  title: "Quiet luxury, considered detail.",
  body: "Tailoring and accessories built for permanence, not trend cycles.",
  href: "/products",
  image: null as string | null,
};

/**
 * Renders every active "hero" CMSSection (see cms/models.py in
 * oghie-store) as a slide, auto-advancing and crossfading between them.
 * With zero slides - e.g. the CMS fetch failed, or nothing has been seeded
 * yet - it falls back to the original static, image-less hero instead of
 * rendering an empty section.
 */
export function Hero({ slides = [] }: { slides?: CmsSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const views = hasSlides
    ? slides.map((slide) => ({
        title: slide.title,
        body: slide.body,
        href: slide.link_url || "/products",
        image: slide.image_url,
      }))
    : [FALLBACK_SLIDE];

  const boundedIndex = Math.min(activeIndex, views.length - 1);
  const active = views[boundedIndex];

  return (
    <section
      className="relative flex h-[92vh] min-h-[560px] items-end overflow-hidden bg-ink"
      style={{ marginTop: "calc(var(--header-height, 75px) * -1)" }}
    >
      {views.map((view, index) =>
        view.image ? (
          <motion.img
            key={`hero-slide-${index}`}
            src={view.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: index === boundedIndex ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        ) : null,
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

      <motion.div
        key={boundedIndex}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-7xl px-6 pb-20"
      >
        {!hasSlides && (
          <p className="font-body text-caption uppercase tracking-[0.3em] text-brass">
            New season
          </p>
        )}
        <h1 className="mt-4 max-w-2xl font-display text-display-xl font-light text-bone">
          {active.title}
        </h1>
        <p className="mt-4 max-w-md font-body text-body-l text-bone/80">{active.body}</p>
        <Link href={active.href} className="mt-8 inline-block">
          <Button variant="primary" size="lg">
            Shop the collection
          </Button>
        </Link>
      </motion.div>

      {views.length > 1 && (
        <div className="absolute bottom-8 right-6 z-10 flex gap-2">
          {views.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === boundedIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === boundedIndex ? "w-8 bg-brass" : "w-1.5 bg-bone/50 hover:bg-bone/80",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
