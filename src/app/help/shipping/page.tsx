import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Shipping — Oghie Store",
};

export default function ShippingPage() {
  return (
    <StaticPage title="Shipping">
      <p>
        Standard shipping takes 3–5 business days and is free on orders over $150. Expedited
        shipping (1–2 business days) is available at checkout for an additional fee.
      </p>
      <p>
        Once your order ships, you&rsquo;ll receive a confirmation email with tracking
        information. Orders placed before 1pm on a business day ship the same day.
      </p>
      <p>
        We currently ship within the United States and Canada. International shipping is not yet
        available.
      </p>
    </StaticPage>
  );
}
