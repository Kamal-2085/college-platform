"use client";

import { useState } from "react";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

export default function PredictorPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResponseText("");
    setLoading(true);

    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: exam.trim(),
          rank: rank.trim(),
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          try {
            const parsed = JSON.parse(text);
            setError(
              String(parsed?.message || text || "Failed to fetch predictions"),
            );
          } catch {
            setError(text || "Failed to fetch predictions");
          }
        } else {
          setError(text || "Failed to fetch predictions");
        }
        return;
      }

      setResponseText(text);
    } catch (err) {
      setError("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}
    >
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Predictor tool
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Enter your exam and rank. Get a shortlist that fits.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Enter your exam and optional rank. The tool will send it to
                ChatGPT and show the response as-is.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Exam
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    placeholder="e.g. JEE Main, CAT, NEET"
                    value={exam}
                    onChange={(event) => setExam(event.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Rank (optional)
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    placeholder="e.g. 12"
                    value={rank}
                    onChange={(event) => setRank(event.target.value)}
                    inputMode="numeric"
                  />
                </div>

                <button
                  className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Finding matches..." : "Get recommendations"}
                </button>

                <p className="text-xs text-zinc-500">
                  Tip: Add your exam name in plain text and leave rank empty if
                  you do not want to specify one.
                </p>
              </form>
            </div>
          </div>

          <div className="mt-10">
            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {responseText ? (
              <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  ChatGPT response
                </p>
                <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                  {responseText}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
