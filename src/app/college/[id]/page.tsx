import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";
import SaveCollegeButton from "./SaveCollegeButton";
import { headers } from "next/headers";

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
async function getcollege(id: string) {
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") || "http";
  const host = hdrs.get("host") || "localhost:3000";
  const base = `${proto}://${host}`;

  try {
    const res = await fetch(`${base}/api/colleges/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null };
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { data: null };
    }

    return await res.json();
  } catch (err) {
    return { data: null };
  }
}

export default async function collegepage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getcollege(id);

  const college = result.data;

  if (!college) {
    return (
      <div className="min-h-screen bg-[#f4efe7] px-6 py-20 text-red-700">
        College not found
      </div>
    );
  }

  return (
    <div
      className={`${sora.className} min-h-screen bg-[#f4efe7] text-zinc-900`}
    >
      <div className="bg-[radial-gradient(80%_60%_at_50%_0%,#f5d6a4_0%,#f4efe7_55%,#efe9dd_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12">
          <Link href="/college" className="text-sm font-semibold text-zinc-600">
            ← Back to listings
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                College profile
              </p>
              <h1
                className={`${fraunces.className} mt-4 text-4xl font-semibold leading-tight sm:text-5xl`}
              >
                {college.name}
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                {college.location || "Location not listed"}
              </p>
              <p className="mt-6 max-w-2xl text-base text-zinc-700">
                {college.overview || "Overview not available yet."}
              </p>
              <div className="mt-6">
                <SaveCollegeButton collegeId={college._id} />
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-zinc-500">
                      Fees
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      {formatCurrency(college.fees)}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Annual
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-zinc-500">
                      Rating
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      {formatRating(college.rating)}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Overall
                  </span>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-zinc-500">
                    Placements
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">
                    {college.placements || "Placement data not available."}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-zinc-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">
                    {college.location || "Location not listed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-sm">
            <h2 className={`${fraunces.className} text-2xl font-semibold`}>
              Courses
            </h2>
            {college.courses?.length ? (
              <ul className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                {college.courses.map((course: string, index: number) => (
                  <li
                    key={index}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Course list is being updated.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-sm">
            <h2 className={`${fraunces.className} text-2xl font-semibold`}>
              Reviews
            </h2>
            {college.reviews?.length ? (
              <div className="mt-4 space-y-3">
                {college.reviews.map((review: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
                  >
                    {review}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Reviews will appear once students add feedback.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
