"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = Boolean(email && password);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to log in");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}>
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Welcome back
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Continue building your shortlist.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Log in to access saved colleges and comparisons across devices.
              </p>
              <p className="mt-6 text-sm text-zinc-600">
                New here?{" "}
                <Link className="font-semibold text-zinc-900" href="/signup">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              {error ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Email
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@email.com"
                    type="email"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Password
                  </label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    type="password"
                  />
                </div>

                <button
                  className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  onClick={handleLogin}
                  disabled={loading || !canSubmit}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
