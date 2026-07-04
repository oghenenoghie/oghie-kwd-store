"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Couldn't sign in. Check your email and password and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-display-m text-ink">You&rsquo;re signed in</h1>
        <Button className="mt-6" variant="outline" onClick={logout}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="font-display text-display-m text-ink">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="font-body text-caption uppercase tracking-widest text-stone">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border border-ink/20 bg-bone px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-ink"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-body text-caption uppercase tracking-widest text-stone">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full border border-ink/20 bg-bone px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-ink"
          />
        </div>
        {error && <p className="font-body text-caption text-oxblood">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
