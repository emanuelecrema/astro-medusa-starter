import { sdk } from "@lib/sdk";
import { useMemo, useState } from "react";

interface RegisterPageProps {
  countryCode: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "Unable to create your account right now. Please try again in a moment.";
}

export const RegisterPage = ({ countryCode }: RegisterPageProps) => {
  const [values, setValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      values.firstName.trim().length > 0 &&
      values.lastName.trim().length > 0 &&
      values.email.trim().length > 0 &&
      values.password.length >= 8
    );
  }, [values]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormValues,
  ) => {
    const next = event.target.value;
    setValues((prev) => ({ ...prev, [key]: next }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = await sdk.auth.register("customer", "emailpass", {
        email: values.email,
        password: values.password,
      });

      await sdk.store.customer.create(
        {
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
        },
        {},
        {
          Authorization: `Bearer ${token}`,
        },
      );

      setIsSuccess(true);
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Customer registration failed:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-[calc(100vh-96px-2rem)] px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] md:grid-cols-[1.05fr_1fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,white,rgba(243,244,246,0.95),rgba(229,231,235,0.9))] p-8 md:p-10">
            <p className="mb-5 inline-flex rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-black/70">
              Account created
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Welcome aboard, your profile is ready.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">
              You can now continue shopping with faster checkout and access to
              your upcoming order history.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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

          <div className="flex items-center border-t border-gray-200 bg-white p-8 md:border-l md:border-t-0 md:p-10">
            <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold">Registration complete</h2>
              <p className="mt-2 text-sm text-gray-600">
                To see customer-only details, sign in if your storefront has a
                login page enabled.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-96px-2rem)] px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] md:grid-cols-[1.05fr_1fr]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,white,rgba(243,244,246,0.95),rgba(229,231,235,0.9))] p-8 md:p-10">
          <p className="mb-5 inline-flex rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-black/70">
            New customer
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Create your account and shop faster.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">
            Join in a minute to save your details and speed up checkout on your
            next order.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-white/70 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500">
                Estimated time
              </p>
              <p className="mt-1 text-base font-semibold">Under 60 seconds</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white/70 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500">
                Minimum password
              </p>
              <p className="mt-1 text-base font-semibold">8 characters</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-800">Name</span>
                <input
                  type="text"
                  value={values.firstName}
                  onChange={(event) => handleChange(event, "firstName")}
                  autoComplete="given-name"
                  required
                  className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                  placeholder="Mario"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-800">Surname</span>
                <input
                  type="text"
                  value={values.lastName}
                  onChange={(event) => handleChange(event, "lastName")}
                  autoComplete="family-name"
                  required
                  className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                  placeholder="Rossi"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-800">Email</span>
              <input
                type="email"
                value={values.email}
                onChange={(event) => handleChange(event, "email")}
                autoComplete="email"
                required
                className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                placeholder="cliente@email.com"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-800">Password</span>
              <input
                type="password"
                value={values.password}
                onChange={(event) => handleChange(event, "password")}
                autoComplete="new-password"
                minLength={8}
                required
                className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black"
                placeholder="At least 8 characters"
              />
            </label>

            {errorMessage && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-12 w-full rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
