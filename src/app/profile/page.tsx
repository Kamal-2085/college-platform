"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function ProfilePage() {
  const { user, status } = useAuth();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "";

  return (
    <div className="min-h-screen bg-[#f4efe7] text-zinc-900">
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-4xl px-6 pb-16 pt-14">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Account
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            My profile
          </h1>

          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-sm backdrop-blur">
            {status === "authenticated" && user ? (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-2xl font-semibold text-emerald-500">
                  {initial}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Name
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {user.name}
                  </p>
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </p>
                  <p className="mt-1 text-base text-zinc-700">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">Loading profile...</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/saved-colleges"
                className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
              >
                Saved colleges
              </Link>
              <Link
                href="/saved-comparisons"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                Saved comparisons
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
