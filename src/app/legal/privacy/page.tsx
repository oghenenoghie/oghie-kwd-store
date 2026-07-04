import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Oghie Store",
};

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy policy" description="Last updated July 2026">
      <div>
        <h2 className="font-display text-body-l text-ink">What we collect</h2>
        <p className="mt-2 text-stone">
          When you create an account or place an order, we collect your name, email, shipping
          address, and order history. We don&rsquo;t store full payment card numbers — those are
          handled by our payment processor.
        </p>
      </div>
      <div>
        <h2 className="font-display text-body-l text-ink">How we use it</h2>
        <p className="mt-2 text-stone">
          We use your information to fulfill orders, provide customer support, and — only if you
          opt in — send updates about new arrivals and restocks. We don&rsquo;t sell your data to
          third parties.
        </p>
      </div>
      <div>
        <h2 className="font-display text-body-l text-ink">Your choices</h2>
        <p className="mt-2 text-stone">
          You can update or delete your account information at any time, and unsubscribe from
          marketing emails using the link in any email we send. For requests, reach us at{" "}
          <a href="mailto:privacy@oghiestore.com" className="text-brass underline underline-offset-4">
            privacy@oghiestore.com
          </a>
          .
        </p>
      </div>
    </StaticPage>
  );
}
