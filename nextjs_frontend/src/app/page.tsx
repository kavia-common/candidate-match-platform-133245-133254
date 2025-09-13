import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
          Find your next role with CareerMatch
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          A modern hiring platform connecting applicants with the right roles based on assessments and preferences.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/applicant/register" className="rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700">
            Get Started
          </Link>
          <Link href="/applicant/jobs" className="rounded-md bg-slate-100 text-slate-900 px-5 py-2.5 text-sm font-medium hover:bg-slate-200">
            Browse Jobs
          </Link>
        </div>
      </section>
    </main>
  );
}
