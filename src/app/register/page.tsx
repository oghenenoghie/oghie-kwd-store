import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = {
  title: "Create account — Oghie Store",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="font-display text-display-m text-ink">Create an account</h1>
      <p className="mt-2 font-body text-sm text-stone">
        Join Oghie Store to save your wishlist and check out faster.
      </p>

      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
}
