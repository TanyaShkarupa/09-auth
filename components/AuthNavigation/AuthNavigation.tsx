"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>
            Register
          </Link>
        </div>

        <div className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>
            Login
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink}>
          Profile
        </Link>
      </div>

      <div className={css.navigationItem}>
        <span className={css.userEmail}>{user?.email}</span>
      </div>

      <div className={css.navigationItem}>
        <button
          type="button"
          onClick={handleLogout}
          className={css.logoutButton}
        >
          Logout
        </button>
      </div>
    </>
  );
}
