import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Terms of Service — Oghie Store",
};

export default function TermsPage() {
  return (
    <StaticPage title="Terms of service" description="Last updated July 2026">
      <p>
        By using Oghie Store, you agree to these terms. Please read them along with our{" "}
        <a href="/legal/privacy" className="text-brass underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
      <div>
        <h2 className="font-display text-body-l text-ink">Orders and pricing</h2>
        <p className="mt-2 text-stone">
          All prices are listed in the currency shown at checkout and are subject to change
          without notice. We reserve the right to refuse or cancel any order, including in cases
          of suspected fraud or pricing errors.
        </p>
      </div>
      <div>
        <h2 className="font-display text-body-l text-ink">Account responsibility</h2>
        <p className="mt-2 text-stone">
          You&rsquo;re responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account.
        </p>
      </div>
      <div>
        <h2 className="font-display text-body-l text-ink">Intellectual property</h2>
        <p className="mt-2 text-stone">
          All content on this site — product photography, copy, and branding — belongs to Oghie
          Store and may not be reproduced without permission.
        </p>
      </div>
    </StaticPage>
  );
}
