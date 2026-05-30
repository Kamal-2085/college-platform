import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 hero-gradient" />
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Built for students
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Find your best-fit college with clarity, not chaos.
            </h1>
            <p className="text-lg leading-8 text-zinc-300">
              Compare programs, costs, and campus culture in minutes. Save the
              colleges that match your goals and build a shortlist you can
              trust.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-semibold text-black transition hover:bg-emerald-300"
                href="/college"
              >
                Explore colleges
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white/60"
                href="/compare"
              >
                Start a comparison
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4 text-sm">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-white">2,400+</p>
                <p className="text-zinc-400">Colleges indexed</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-white">14</p>
                <p className="text-zinc-400">Key metrics tracked</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-white">98%</p>
                <p className="text-zinc-400">Profiles updated</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-white">1 tap</p>
                <p className="text-zinc-400">Save your shortlist</p>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Shortlist snapshot
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Pacific Ridge University
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
                      18k
                      <span className="block text-[11px] text-zinc-400">
                        Tuition
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
                      14:1
                      <span className="block text-[11px] text-zinc-400">
                        Ratio
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
                      89%
                      <span className="block text-[11px] text-zinc-400">
                        Grad
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Match score
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-emerald-300">
                      86%
                    </p>
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                      Strong fit
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[86%] rounded-full bg-emerald-300" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Next actions
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    <li>Schedule a virtual tour</li>
                    <li>Compare financial aid</li>
                    <li>Share with family</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="glow-orb float-slow absolute -right-6 -top-10 h-24 w-24 rounded-full" />
            <div className="glow-orb float-slower absolute -bottom-10 left-6 h-20 w-20 rounded-full" />
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Compare by what matters",
              body: "Side-by-side analysis for tuition, outcomes, campus vibes, and program depth.",
            },
            {
              title: "Save and organize",
              body: "Keep your shortlist tidy with one-tap saves and smart tags.",
            },
            {
              title: "Plan your next step",
              body: "Action checklists built around your deadlines and goals.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/10 via-white/5 to-cyan-400/10 p-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to build your college map?
          </h2>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">
            Create an account to save your progress and sync comparisons across
            devices.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200"
              href="/signup"
            >
              Get started
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:border-white"
              href="/login"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
