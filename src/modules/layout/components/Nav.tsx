import {
  $cartItemCount,
  $regionId,
  initCart,
  toggleCartSidebar,
} from "@lib/stores/cart";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { sdk } from "@lib/sdk";

interface NavProps {
  countryCode: string;
  regionId: string | null;
}

function UserIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeWidth="2" />
    </svg>
  );
}

export const Nav = ({ countryCode, regionId }: NavProps) => {
  const cartItemCount = useStore($cartItemCount);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (regionId) {
      $regionId.set(regionId);
      initCart();
    }
  }, [regionId]);

  useEffect(() => {
    // Verifica login chiamando retrieve customer
    sdk.store.customer
      .retrieve()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setIsAuthLoading(false));
  }, []);

  const handleCartClick = () => {
    toggleCartSidebar();
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await sdk.auth.logout();
      setIsLoggedIn(false);
      window.location.href = `/${countryCode}`;
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center w-full p-8 h-24">
      <div className="flex items-center gap-6 flex-1">
        <a href={`/${countryCode}/store`} className="text-sm hover:underline">
          Products
        </a>
        <a href={`/${countryCode}/register`} className="text-sm hover:underline">
          Register
        </a>
        {!isAuthLoading && !isLoggedIn && (
          <a href={`/${countryCode}/login`} className="text-sm hover:underline">
            Login
          </a>
        )}
        {!isAuthLoading && isLoggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        )}
        {!isAuthLoading && isLoggedIn && (
          <a href={`/${countryCode}/account`} className="ml-2 text-gray-700 hover:text-black flex items-center" aria-label="Account">
            <UserIcon />
          </a>
        )}
      </div>

      <a
        href={`/${countryCode}`}
        className="text-sm font-bold uppercase tracking-wide"
      >
        Astro Medusa Store
      </a>

      <div className="flex items-center gap-6 flex-1 justify-end">
        <button
          onClick={handleCartClick}
          className="text-sm hover:underline relative"
          aria-label={`Shopping cart with ${cartItemCount} item${cartItemCount !== 1 ? "s" : ""}`}
        >
          <span aria-live="polite" aria-atomic="true">
            Cart ({cartItemCount})
          </span>
        </button>
      </div>
    </header>
  );
};

export default Nav;
