"use client";

import { useState } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const canSendOtp = Boolean(name && email && dob);
  const canVerifyOtp = Boolean(email && otp);
  const canCreateAccount = Boolean(
    name && email && dob && otpToken && password && confirmPassword
  );

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, dob }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to send OTP");
        return;
      }

      setStep(2);
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to verify OTP");
        return;
      }

      setOtpToken(data.otpToken);
      setStep(3);
    } catch (err) {
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/create-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          dob,
          password,
          confirmPassword,
          otpToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to create account");
        return;
      }

      setStep(1);
      setName("");
      setEmail("");
      setDob("");
      setOtp("");
      setOtpToken("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("Account created. You can now log in.");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}>
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Create account
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                Join College Compass in minutes.
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-600">
                Verify your email, set a password, and start saving colleges and
                comparisons.
              </p>

              <div className="mt-8 flex items-center gap-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      step === item
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-300 text-zinc-500"
                    }`}
                  >
                    {item}
                  </div>
                ))}
                <span className="text-sm text-zinc-600">
                  {step === 1
                    ? "Your details"
                    : step === 2
                    ? "Verify OTP"
                    : "Secure password"}
                </span>
              </div>

              <p className="mt-6 text-sm text-zinc-600">
                Already have an account?{" "}
                <Link className="font-semibold text-zinc-900" href="/login">
                  Log in
                </Link>
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              {error ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Name
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                    />
                  </div>

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
                      Date of birth
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      type="date"
                    />
                  </div>

                  <button
                    className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={handleSendOtp}
                    disabled={loading || !canSendOtp}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      OTP
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="6 digit code"
                    />
                  </div>

                  <p className="text-xs text-zinc-500">
                    Sent to {email || "your email"}. Check spam if it is missing.
                  </p>

                  <button
                    className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={handleVerifyOtp}
                    disabled={loading || !canVerifyOtp}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Create password
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      type="password"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Confirm password
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repeat password"
                      type="password"
                    />
                  </div>

                  <button
                    className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={handleCreateAccount}
                    disabled={loading || !canCreateAccount}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
