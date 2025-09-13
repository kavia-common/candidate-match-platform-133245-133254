"use client";

import Link from "next/link";
import React from "react";

export default function EmployerDashboardPage() {
  const stats = [
    { label: "Active Jobs", value: 4 },
    { label: "New Candidates", value: 12 },
    { label: "Interviews Scheduled", value: 3 },
  ];

  return (
    <div className="section">
      <div>
        <h1 className="title">Employer Dashboard</h1>
        <p className="subtitle mt-1">Overview of your hiring pipeline.</p>
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
          <h2 className="text-lg font-medium">Quick Actions</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="rounded-md bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700" href="/employer/jobs/post">Post a Job</Link>
            <Link className="rounded-md bg-slate-100 px-3 py-1.5 hover:bg-slate-200" href="/employer/jobs">Manage Jobs</Link>
            <Link className="rounded-md bg-slate-100 px-3 py-1.5 hover:bg-slate-200" href="/employer/candidates">View Candidates</Link>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <h2 className="text-lg font-medium">Tips</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Use clear titles and concise descriptions when posting jobs.</li>
            <li>Review matched candidates regularly to reduce time-to-hire.</li>
            <li>Keep candidates engaged throughout the process.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
