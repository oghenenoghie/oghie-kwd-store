"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

const inputClasses =
  "w-full border border-ink/20 bg-transparent px-4 py-3 font-body text-body-base text-ink outline-none placeholder:text-stone focus-visible:border-brass";

/** DRF validation errors come back as { field: string[] } or { detail: string }. */
function parseErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body;
    if (body && typeof body === "object") {
      const messages = Object.values(body as Record<string, unknown>)
        .flat()
        .filter((value): value is string => typeof value === "string");
      if (messages.length > 0) return messages.join(" ");
    }
    if (error.status === 403) return "Registration is currently unavailable. Please try again later.";
  }
  return "Something went wrong. Please try again.";
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      router.push("/");
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block font-body text-xs tracking-wide text-stone">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block font-body text-xs tracking-wide text-stone">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-body text-xs tracking-wide text-stone">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-body text-xs tracking-wide text-stone">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-body text-xs tracking-wide text-stone">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={inputClasses}
        />
      </div>

      {error && <p className="font-body text-sm text-oxblood">{error}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
