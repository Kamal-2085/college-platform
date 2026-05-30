"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";

export function SiteHeader() {
  const { user, status } = useAuth();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          College Compass
        </Link>
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
