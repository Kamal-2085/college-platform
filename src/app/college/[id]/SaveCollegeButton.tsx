"use client";

import { useEffect, useState } from "react";

type SavedCollege = {
  id: string;
  collegeId: string;
};

export default function SaveCollegeButton({
  collegeId,
}: {
  collegeId: string;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/saved-colleges");
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        const items: SavedCollege[] = data?.data || [];
        setIsSaved(items.some((item) => item.collegeId === collegeId));
      } catch (err) {
        setIsSaved(false);
      }
    }

    fetchSaved();
  }, [collegeId]);

  const handleToggle = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/saved-colleges", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to update saved list");
        return;
      }

      setIsSaved(!isSaved);
    } catch (err) {
      setError("Failed to update saved list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error ? (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="rounded-full border border-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : isSaved
          ? "Saved"
          : "Save college"}
      </button>
    </div>
  );
}
