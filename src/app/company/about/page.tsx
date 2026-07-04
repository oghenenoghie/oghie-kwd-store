import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "About — Oghie Store",
};

export default function AboutPage() {
  return (
    <StaticPage title="About Oghie Store">
      <p>
        Oghie Store was built around a simple idea: fewer, better pieces. We work with a small
        set of makers who share our focus on quality materials and construction that lasts beyond
        a season.
      </p>
      <p>
        Every piece in the collection is chosen for how it wears over years, not weeks — tailored
        silhouettes, natural fibers, and a quiet, considered palette rather than a trend cycle.
      </p>
    </StaticPage>
  );
}
