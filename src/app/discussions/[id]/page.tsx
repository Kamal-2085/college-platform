"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

type Answer = {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchDiscussion = async () => {
    setError("");
    try {
      const res = await fetch(`/api/discussions/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load discussion");
        return;
      }
      setDiscussion(data?.discussion || null);
      setAnswers(data?.answers || []);
    } catch (err) {
      setError("Failed to load discussion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDiscussion();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, authorName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to post answer");
        return;
      }

      setAnswers((prev) => [...prev, data.data]);
      setBody("");
      setAuthorName("");
      setNotice("Answer posted.");
      setDiscussion((prev) =>
        prev
          ? {
              ...prev,
              answerCount: prev.answerCount + 1,
              updatedAt: new Date().toISOString(),
            }
          : prev,
      );
    } catch (err) {
      setError("Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}
    >
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-16">
          <Link
            href="/discussions"
            className="text-sm font-semibold text-zinc-600"
          >
            {"<-"} Back to discussions
          </Link>

          {loading ? (
            <p className="mt-6 text-sm text-zinc-600">Loading discussion...</p>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {discussion ? (
            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Discussion
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-3xl font-semibold`}
              >
                {discussion.title}
              </h1>
              <p className="mt-4 text-base text-zinc-700">{discussion.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span>Asked by {discussion.authorName}</span>
                <span>{formatDate(discussion.createdAt)}</span>
                <span>{discussion.answerCount} replies</span>
              </div>
            </div>
          ) : null}

          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <h2 className={`${fraunces.className} text-2xl font-semibold`}>
              Add your answer
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Your answer
                </label>
                <textarea
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Share your thoughts or recommendations."
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
                className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Posting..." : "Post answer"}
              </button>
              {notice ? (
                <p className="text-sm text-emerald-700">{notice}</p>
              ) : null}
            </form>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className={`${fraunces.className} text-2xl font-semibold`}>
              Answers
            </h2>
            {!answers.length ? (
              <p className="text-sm text-zinc-600">
                No answers yet. Be the first to reply.
              </p>
            ) : null}
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm"
              >
                <p className="text-sm text-zinc-700">{answer.body}</p>
                <div className="mt-4 text-xs text-zinc-500">
                  {answer.authorName} · {formatDate(answer.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
