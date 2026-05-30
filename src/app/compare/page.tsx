"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

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

export default function ComparePage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [college1, setCollege1] = useState<any | null>(null);
  const [college2, setCollege2] = useState<any | null>(null);
  const [college3, setCollege3] = useState<any | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const tableRef = useRef<HTMLDivElement | null>(null);

  const selectedIds = new Set(
    [college1?._id, college2?._id, college3?._id].filter(Boolean)
  );

  const isDisabledOption = (id: string, currentId?: string) =>
    id !== currentId && selectedIds.has(id);

  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch("/api/colleges");
        const data = await res.json();
        setColleges(data.data || []);
      } catch (err) {
        setColleges([]);
      }
    }

    fetchColleges();
  }, []);

  const handleCompare = () => {
    if (college1 && college2) {
      setSaveStatus("");
      setSaveError("");
      setShowComparison(true);
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleClear = () => {
    setCollege1(null);
    setCollege2(null);
    setCollege3(null);
    setShowComparison(false);
    setSaveStatus("");
    setSaveError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveComparison = async () => {
    if (!college1 || !college2) {
      return;
    }

    setSaving(true);
    setSaveStatus("");
    setSaveError("");

    try {
      const ids = [college1._id, college2._id, college3?._id].filter(
        Boolean
      );

      const res = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds: ids }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data?.message || "Failed to save comparison");
        return;
      }

      setSaveStatus("Comparison saved");
    } catch (err) {
      setSaveError("Failed to save comparison");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}>
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12">
          <Link href="/college" className="text-sm font-semibold text-zinc-600">
            ← Back to listings
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Compare colleges
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Side-by-side comparison, without spreadsheet fatigue.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Pick two or three colleges and compare fees, placements,
                ratings, and locations in one glance.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-zinc-700">
                Quick tips
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>Start with two colleges, add a third if needed.</li>
                <li>Save comparisons to revisit later.</li>
                <li>Filters carry over from your listings search.</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  College 1
                </label>
                <select
                  value={college1?._id || ""}
                  onChange={(e) =>
                    setCollege1(
                      colleges.find((c) => c._id === e.target.value) || null,
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <option value="">Select College 1</option>
                  {colleges.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      disabled={isDisabledOption(c._id, college1?._id)}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  College 2
                </label>
                <select
                  value={college2?._id || ""}
                  onChange={(e) =>
                    setCollege2(
                      colleges.find((c) => c._id === e.target.value) || null,
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <option value="">Select College 2</option>
                  {colleges.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      disabled={isDisabledOption(c._id, college2?._id)}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  College 3 (optional)
                </label>
                <select
                  value={college3?._id || ""}
                  onChange={(e) =>
                    setCollege3(
                      colleges.find((c) => c._id === e.target.value) || null,
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <option value="">Select College 3</option>
                  {colleges.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      disabled={isDisabledOption(c._id, college3?._id)}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!showComparison ? (
                <button
                  onClick={handleCompare}
                  className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white"
                >
                  Compare
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleClear}
                    className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"
                  >
                    Clear comparison
                  </button>
                  <button
                    onClick={handleSaveComparison}
                    disabled={saving}
                    className="rounded-full border border-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save comparison"}
                  </button>
                </div>
              )}
              {saveStatus ? (
                <span className="text-sm font-semibold text-emerald-600">
                  {saveStatus}
                </span>
              ) : null}
              {saveError ? (
                <span className="text-sm font-semibold text-red-600">
                  {saveError}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {showComparison && college1 && college2 ? (
        <div
          ref={tableRef}
          className="mx-auto w-full max-w-6xl px-6 pb-16"
        >
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 shadow-sm">
            <div className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] gap-0 border-b border-zinc-200 bg-white/70 text-sm font-semibold text-zinc-600 sm:grid-cols-[200px_repeat(2,minmax(0,1fr))]">
              <div className="px-4 py-4">Feature</div>
              <div className="px-4 py-4 text-zinc-900">{college1.name}</div>
              <div className="px-4 py-4 text-zinc-900">{college2.name}</div>
              {college3 ? (
                <div className="px-4 py-4 text-zinc-900">{college3.name}</div>
              ) : null}
            </div>

            <div
              className={`grid gap-0 border-b border-zinc-200 text-sm text-zinc-700 ${
                college3
                  ? "grid-cols-[160px_repeat(3,minmax(0,1fr))] sm:grid-cols-[200px_repeat(3,minmax(0,1fr))]"
                  : "grid-cols-[160px_repeat(2,minmax(0,1fr))] sm:grid-cols-[200px_repeat(2,minmax(0,1fr))]"
              }`}
            >
              <div className="bg-white/70 px-4 py-4 font-semibold text-zinc-600">
                Location
              </div>
              <div className="px-4 py-4">{college1.location || "—"}</div>
              <div className="px-4 py-4">{college2.location || "—"}</div>
              {college3 ? (
                <div className="px-4 py-4">{college3.location || "—"}</div>
              ) : null}
            </div>

            <div
              className={`grid gap-0 border-b border-zinc-200 text-sm text-zinc-700 ${
                college3
                  ? "grid-cols-[160px_repeat(3,minmax(0,1fr))] sm:grid-cols-[200px_repeat(3,minmax(0,1fr))]"
                  : "grid-cols-[160px_repeat(2,minmax(0,1fr))] sm:grid-cols-[200px_repeat(2,minmax(0,1fr))]"
              }`}
            >
              <div className="bg-white/70 px-4 py-4 font-semibold text-zinc-600">
                Fees
              </div>
              <div className="px-4 py-4">{formatCurrency(college1.fees)}</div>
              <div className="px-4 py-4">{formatCurrency(college2.fees)}</div>
              {college3 ? (
                <div className="px-4 py-4">{formatCurrency(college3.fees)}</div>
              ) : null}
            </div>

            <div
              className={`grid gap-0 border-b border-zinc-200 text-sm text-zinc-700 ${
                college3
                  ? "grid-cols-[160px_repeat(3,minmax(0,1fr))] sm:grid-cols-[200px_repeat(3,minmax(0,1fr))]"
                  : "grid-cols-[160px_repeat(2,minmax(0,1fr))] sm:grid-cols-[200px_repeat(2,minmax(0,1fr))]"
              }`}
            >
              <div className="bg-white/70 px-4 py-4 font-semibold text-zinc-600">
                Rating
              </div>
              <div className="px-4 py-4">{formatRating(college1.rating)}</div>
              <div className="px-4 py-4">{formatRating(college2.rating)}</div>
              {college3 ? (
                <div className="px-4 py-4">{formatRating(college3.rating)}</div>
              ) : null}
            </div>

            <div
              className={`grid gap-0 text-sm text-zinc-700 ${
                college3
                  ? "grid-cols-[160px_repeat(3,minmax(0,1fr))] sm:grid-cols-[200px_repeat(3,minmax(0,1fr))]"
                  : "grid-cols-[160px_repeat(2,minmax(0,1fr))] sm:grid-cols-[200px_repeat(2,minmax(0,1fr))]"
              }`}
            >
              <div className="bg-white/70 px-4 py-4 font-semibold text-zinc-600">
                Placements
              </div>
              <div className="px-4 py-4">{college1.placements || "—"}</div>
              <div className="px-4 py-4">{college2.placements || "—"}</div>
              {college3 ? (
                <div className="px-4 py-4">{college3.placements || "—"}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
