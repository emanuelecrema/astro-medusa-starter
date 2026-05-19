import { sdk } from "@lib/sdk";
import { useState } from "react";

interface LoginPageProps {
  countryCode: string;
}

function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Unable to log you in right now. Please try again in a moment.";
}

export const LoginPage = ({ countryCode }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const result = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });
      // result può essere string (token) o { location }
      if (typeof result !== "string") {
        setErrorMessage("External login required. Please check your email or provider.");
        setIsSubmitting(false);
        return;
      }
      setIsSuccess(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-[calc(100vh-96px-2rem)] px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] p-8 md:p-10 text-center">
          <p className="mb-5 inline-flex rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-black/70">
            Login successful
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Welcome back!
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-gray-600 md:text-base">
            You are now signed in. You can continue shopping or view your orders.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`/${countryCode}/store`}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Browse products
            </a>
            <a
              href={`/${countryCode}`}
              className="inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Go to homepage
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-96px-2rem)] px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] p-8 md:p-10">
        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-6 text-center">
          Sign in to your account
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
              placeholder="you@email.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              minLength={8}
              required
              className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
              placeholder="At least 8 characters"
            />
          </label>
          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-12 w-full rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href={`/${countryCode}/register`} className="text-black underline hover:text-gray-800">
            Register
          </a>
        </div>
      </div>
    </section>
  );
};
