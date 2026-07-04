import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Careers — Oghie Store",
};

export default function CareersPage() {
  return (
    <StaticPage title="Careers">
      <p>
        We&rsquo;re a small team and don&rsquo;t have open roles posted right now, but we&rsquo;re
        always glad to hear from people who care about craft and quiet-luxury retail.
      </p>
      <p>
        Send a note and your background to{" "}
        <a href="mailto:careers@oghiestore.com" className="text-brass underline underline-offset-4">
          careers@oghiestore.com
        </a>{" "}
        and we&rsquo;ll keep it on file for when a role opens up.
      </p>
    </StaticPage>
  );
}
