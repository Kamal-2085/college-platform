"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function SiteHeader() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, status, clearUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    setMenuOpen(false);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      clearUser();
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="text-lg font-semibold text-white transition hover:text-zinc-200"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            College Compass
          </button>

          {menuOpen && status === "authenticated" && user ? (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute left-0 top-[calc(100%+0.75rem)] w-56 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{user.email}</p>
              </div>
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
              >
                My profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                role="menuitem"
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          <Link className="hover:text-white" href="/college">
            Colleges
          </Link>
          <Link className="hover:text-white" href="/compare">
            Compare
          </Link>
          <Link className="hover:text-white" href="/predictor">
            Predictor
          </Link>
          <Link className="hover:text-white" href="/discussions">
            Discussions
          </Link>
          <Link className="hover:text-white" href="/saved-colleges">
            Saved Colleges
          </Link>
          <Link className="hover:text-white" href="/saved-comparisons">
            Saved Comparisons
          </Link>

          {status === "authenticated" && user ? (
            <Link
              href="/saved-colleges"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-sm font-semibold text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] transition hover:border-emerald-300 hover:bg-emerald-400/20"
              aria-label={`${user.name} account`}
              title={user.name}
            >
              {initial}
            </Link>
          ) : status === "loading" ? (
            <span className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900/80" />
          ) : (
            <>
              <Link className="hover:text-white" href="/login">
                Login
              </Link>
              <Link
                className="rounded-full border border-zinc-600 px-3 py-1 hover:border-white hover:text-white"
                href="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
