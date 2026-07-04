import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "FAQ — Oghie Store",
};

const FAQS = [
  {
    question: "How do I track my order?",
    answer:
      "You'll receive a tracking link by email as soon as your order ships. You can also find tracking details under Order History in your account.",
  },
  {
    question: "What sizes do you carry?",
    answer:
      "Sizing varies by piece — check the size guide on each product page. If you're between sizes, our styling team can help via the Contact page.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "We process orders quickly, so changes can only be made within an hour of purchase. Contact us right away and we'll do what we can.",
  },
  {
    question: "Do you restock sold-out items?",
    answer:
      "Some pieces are restocked seasonally, others are one-off. Sign in and add an item to your wishlist to be notified if it returns.",
  },
];

export default function FaqPage() {
  return (
    <StaticPage title="Frequently asked questions">
      <dl className="space-y-8">
        {FAQS.map((faq) => (
          <div key={faq.question}>
            <dt className="font-display text-body-l text-ink">{faq.question}</dt>
            <dd className="mt-2 text-stone">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </StaticPage>
  );
}
