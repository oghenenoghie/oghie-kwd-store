import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";

export const metadata: Metadata = {
  title: "Returns — Oghie Store",
};

export default function ReturnsPage() {
  return (
    <StaticPage title="Returns">
      <p>
        We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in
        their original packaging with tags attached.
      </p>
      <p>
        To start a return, sign in to your account and open Order History, or{" "}
        <a href="/help/contact" className="text-brass underline underline-offset-4">
          contact us
        </a>{" "}
        with your order number. Refunds are issued to the original payment method within 5–7
        business days of us receiving the return.
      </p>
      <p>Sale items and final-sale pieces are not eligible for return or exchange.</p>
    </StaticPage>
  );
}
