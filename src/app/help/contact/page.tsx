import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Contact — Oghie Store",
};

export default function ContactPage() {
  return (
    <StaticPage title="Contact us" description="We usually reply within one business day.">
      <p>
        For order questions, sizing help, or anything else, reach us at{" "}
        <a href="mailto:support@oghiestore.com" className="text-brass underline underline-offset-4">
          support@oghiestore.com
        </a>
        .
      </p>
      <p>
        Customer care is available Monday to Friday, 9am–6pm. For shipping and returns questions,
        see our{" "}
        <a href="/help/shipping" className="text-brass underline underline-offset-4">
          Shipping
        </a>{" "}
        and{" "}
        <a href="/help/returns" className="text-brass underline underline-offset-4">
          Returns
        </a>{" "}
        pages.
      </p>
    </StaticPage>
  );
}
