"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

type College = {
  _id: string;
  name: string;
  location?: string;
  fees?: number;
  rating?: number;
  description?: string;
  imageurl?: string;
};

type Filters = {
  search: string;
  location: string;
  minRating: string;
  maxFees: string;
};

const initialFilters: Filters = {
  search: "",
  location: "",
  minRating: "",
  maxFees: "",
};

const formatCurrency = (value?: number) => {
  if (!value) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatRating = (value?: number) => {
  if (value === undefined || value === null) return "—";
  return value.toFixed(2);
};

export default function CollegeListingPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [draft, setDraft] = useState<Filters>(initialFilters);
  const [items, setItems] = useState<College[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = (pageNumber: number) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.location) params.set("location", filters.location);
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.maxFees) params.set("maxFees", filters.maxFees);

    params.set("page", pageNumber.toString());
    params.set("limit", "12");

    return params.toString();
  };

  const fetchColleges = async (
    pageNumber: number,
    replace: boolean,
    signal?: AbortSignal
  ) => {
    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError("");

    try {
      const res = await fetch(`/api/colleges?${buildQuery(pageNumber)}`,
        { signal }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to load colleges");
        return;
      }

      const nextItems: College[] = data?.data || [];
      setHasMore(pageNumber < (data?.totalPages || 1));
      setTotal(data?.total || nextItems.length);

      if (replace) {
        setItems(nextItems);
      } else {
        setItems((prev) => [...prev, ...nextItems]);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Failed to load colleges");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setPage(1);
    fetchColleges(1, true, controller.signal);
    return () => controller.abort();
  }, [filters]);

  useEffect(() => {
    if (page === 1) return;
    fetchColleges(page, false);
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  const applyFilters = () => {
    setFilters(draft);
  };

  const resetFilters = () => {
    setDraft(initialFilters);
    setFilters(initialFilters);
  };

  const removeFilter = (key: keyof Filters) => {
    const next = { ...filters, [key]: "" };
    setDraft(next);
    setFilters(next);
  };

  const activeFilters = [
    filters.search ? { key: "search", label: `Search: ${filters.search}` } : null,
    filters.location
      ? { key: "location", label: `Location: ${filters.location}` }
      : null,
    filters.minRating
      ? { key: "minRating", label: `Rating ≥ ${filters.minRating}` }
      : null,
    filters.maxFees
      ? { key: "maxFees", label: `Fees ≤ ₹${filters.maxFees}` }
      : null,
  ].filter(Boolean) as Array<{ key: keyof Filters; label: string }>;

  return (
    <div
      className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}
    >
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Discover programs
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Search colleges with confidence, not chaos.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Filter by location, fees, and ratings. Compare options fast and
                build a shortlist that makes sense for you.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-700">
                  Results
                </p>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {total ? `${total} colleges` : "Loading"}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-600">
                Showing {items.length} results. Use filters to narrow down.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Trusted listings from verified data sources.
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Filters update instantly with no page reload.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Search
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
                  value={draft.search}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      search: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") applyFilters();
                  }}
                  placeholder="IIT, Delhi, medical"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Location
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
                  value={draft.location}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                  placeholder="Chennai, Mumbai"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Min Rating
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
                  value={draft.minRating}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      minRating: event.target.value,
                    }))
                  }
                  placeholder="70"
                  type="number"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Max Fees
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
                  value={draft.maxFees}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxFees: event.target.value,
                    }))
                  }
                  placeholder="250000"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={applyFilters}
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Apply filters
              </button>
              <button
                onClick={resetFilters}
                className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500"
              >
                Reset
              </button>
              <span className="text-xs text-zinc-500">
                Tip: Press Enter in search to apply.
              </span>
            </div>

            {activeFilters.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => removeFilter(filter.key)}
                    className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-600"
                  >
                    {filter.label} ×
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!items.length && !loading && !error ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No colleges found. Try adjusting your filters.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((college) => (
            <article
              key={college._id}
              className="fade-in-up rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-100">
                  {college.imageurl ? (
                    <img
                      src={college.imageurl}
                      alt={college.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {college.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {college.location || "Location not listed"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                  Rating: {formatRating(college.rating)}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                  Fees: {formatCurrency(college.fees)}
                </span>
              </div>

              <p className="mt-4 text-sm text-zinc-600 line-clamp-3">
                {college.description || "No description available."}
              </p>

              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
                href={`/college/${college._id}`}
              >
                View details
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}

          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-56 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm animate-pulse"
                />
              ))
            : null}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          {hasMore ? (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loadingMore}
              className="rounded-full border border-zinc-900 px-6 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          ) : (
            <p className="text-sm text-zinc-500">You have reached the end.</p>
          )}
          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}
