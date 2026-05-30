"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

type Discussion = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DiscussionsPage() {
  const [items, setItems] = useState<Discussion[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchDiscussions = async () => {
    setError("");
    try {
      const res = await fetch("/api/discussions");
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load discussions");
        return;
      }
      setItems(data?.data || []);
    } catch (err) {
      setError("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, authorName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to create discussion");
        return;
      }

      setItems((prev) => [data.data, ...prev]);
      setTitle("");
      setBody("");
      setAuthorName("");
      setNotice("Question posted. Check back for replies.");
    } catch (err) {
      setError("Failed to create discussion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}
    >
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Q&A Discussion
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Ask questions, share answers, learn together.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Start a discussion about admissions, colleges, or programs and
                get feedback from other students.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Question title
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Best colleges for B.Tech with rank 120?"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Details
                  </label>
                  <textarea
                    className="mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Share your context so others can answer clearly."
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Your name (optional)
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    placeholder="Use your name or stay anonymous"
                  />
                </div>

                <button
                  className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Posting..." : "Post question"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10">
            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            {notice ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </div>
            ) : null}

            {loading ? (
              <p className="text-sm text-zinc-600">Loading discussions...</p>
            ) : null}

            {!loading && !items.length ? (
              <p className="text-sm text-zinc-600">
                No discussions yet. Be the first to ask a question.
              </p>
            ) : null}

            <div className="grid gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/discussions/${item.id}`}
                  className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600">
                        {item.body.length > 140
                          ? `${item.body.slice(0, 140)}...`
                          : item.body}
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {item.answerCount} replies
                      </span>
                      <p className="mt-2">{formatDate(item.updatedAt)}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Asked by {item.authorName}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
