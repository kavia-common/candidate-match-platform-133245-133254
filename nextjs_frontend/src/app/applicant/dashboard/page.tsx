"use client";

import Link from "next/link";
import React from "react";

export default function ApplicantDashboardPage() {
  // Mock dashboard status
  const stats = [
    { label: "Applications", value: 3 },
    { label: "Matches", value: 5 },
    { label: "Assessments Completed", value: 2 },
  ];

  return (
    <div className="section">
      <div>
        <h1 className="title">Dashboard</h1>
        <p className="subtitle mt-1">Welcome back! Track your progress and continue your journey.</p>
      </div>

      <div className="grid-stats">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-4">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-5">
          <h2 className="text-lg font-medium">Recommended Actions</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Complete pending assessments</li>
            <li>Review your job matches</li>
            <li>Update your profile</li>
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Link className="link" href="/applicant/assessments">Go to Assessments</Link>
            <span className="text-slate-400">•</span>
            <Link className="link" href="/applicant/jobs?tab=matches">View Matches</Link>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <h2 className="text-lg font-medium">Quick Links</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="rounded-md bg-slate-100 px-3 py-1.5 hover:bg-slate-200" href="/applicant/jobs">Browse Jobs</Link>
            <Link className="rounded-md bg-slate-100 px-3 py-1.5 hover:bg-slate-200" href="/applicant/login">Login</Link>
            <Link className="rounded-md bg-slate-100 px-3 py-1.5 hover:bg-slate-200" href="/applicant/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
