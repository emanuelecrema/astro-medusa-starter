import { sdk } from "@lib/sdk";
import { useEffect, useState } from "react";

interface AccountPageProps {
  countryCode: string;
}

interface Customer {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export const AccountPage = ({ countryCode }: AccountPageProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sdk.store.customer
      .retrieve()
      .then(({ customer }) => {
        setCustomer(customer);
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to load your account. Please login again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center text-gray-500">Loading your account...</div>
    );
  }
  if (error || !customer) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center text-red-600">{error || "No account found."}</div>
    );
  }
  return (
    <section className="min-h-[calc(100vh-96px-2rem)] px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] p-8 md:p-10">
        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-6 text-center">Your Account</h1>
        <div className="space-y-6">
          <div>
            <span className="block text-xs font-semibold text-gray-500 mb-1">First Name</span>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800">{customer.first_name || "-"}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-500 mb-1">Last Name</span>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800">{customer.last_name || "-"}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-500 mb-1">Email</span>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800">{customer.email || "-"}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
