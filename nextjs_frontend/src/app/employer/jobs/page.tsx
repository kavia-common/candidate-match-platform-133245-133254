"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Api, Job } from "@/lib/api";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.employerListJobs();
      // For demo, fake employer-owned filter by taking first N
      setJobs((res.jobs || []).slice(0, 6));
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to load jobs";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="section">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="title">Manage Jobs</h1>
          <p className="subtitle mt-1">Review and manage your posted jobs.</p>
        </div>
        <Link className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700" href="/employer/jobs/post">
          Post New Job
        </Link>
      </div>

      {message && <div className="card-muted">{message}</div>}

      <div className="grid-cards">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-lg border bg-white p-5">
            <header className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{job.title}</h3>
                <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
              </div>
              <span className="text-xs text-slate-500">ID: {job.id ?? "N/A"}</span>
            </header>
            <p className="mt-3 text-sm text-slate-700 line-clamp-3">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="rounded-md bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200" href={`/employer/candidates?jobId=${job.id}`}>View Candidates</Link>
              <Link className="rounded-md bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200" href={`/employer/candidates/matches?jobId=${job.id}`}>View Matches</Link>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={async () => {
                await Api.employerCloseJob();
                setMessage(`Closed job ${job.title}`);
              }}>Close</Button>
            </div>
          </article>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <div className="card p-6 text-sm">
          You have no jobs yet. <Link className="link" href="/employer/jobs/post">Post your first job</Link>.
        </div>
      )}
    </div>
  );
}
