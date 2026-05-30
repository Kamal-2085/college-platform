"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

type SavedCollege = {
  id: string;
  collegeId: string;
  college: {
    _id: string;
    name: string;
    overview?: string;
  } | null;
};

export default function SavedCollegesPage() {
  const [items, setItems] = useState<SavedCollege[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/saved-colleges");
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setNeedsAuth(true);
            setError("Please log in to view your saved colleges.");
          } else {
            setError(data?.message || "Failed to load saved colleges");
          }
          return;
        }
        setItems(data?.data || []);
      } catch (err) {
        setError("Failed to load saved colleges");
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  return (
    <div className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}>
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Your shortlist
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Saved colleges
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Keep track of the colleges you want to revisit.
              </p>
            </div>

            <Link
              href="/college"
              className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
            >
              Browse colleges
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
            {needsAuth ? (
              <Link className="ml-2 font-semibold text-red-700" href="/login">
                Log in
              </Link>
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`saved-skeleton-${index}`}
                className="h-40 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : null}

        {!items.length && !error && !loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 text-sm text-zinc-600 shadow-sm">
            No saved colleges yet. Start exploring and save your favorites.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {item.college?.name || "College"}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 line-clamp-3">
                {item.college?.overview || "No overview available."}
              </p>
              {item.college?._id ? (
                <Link
                  className="mt-4 inline-flex text-sm font-semibold text-zinc-900"
                  href={`/college/${item.college._id}`}
                >
                  View details →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
