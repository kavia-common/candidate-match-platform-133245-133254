"use client";

import React, { Suspense } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api, Job } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function JobsContent() {
  const [q, setQ] = React.useState("");
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [matches, setMatches] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [candidateId, setCandidateId] = React.useState("u1");
  const [skills, setSkills] = React.useState("React,Node.js");
  const [score, setScore] = React.useState<number | undefined>(80);
  const [message, setMessage] = React.useState<string | null>(null);
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") === "matches" ? "matches" : "jobs";

  const fetchJobs = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await Api.listJobs(q || undefined);
      setJobs(data.jobs || []);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to load jobs";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await Api.matchJobs(candidateId, score, skills);
      setMatches(data.jobs || []);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to load matches";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "jobs") {
      fetchJobs();
    } else {
      fetchMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="title">Find Jobs</h1>
          <p className="subtitle mt-1">Search and discover roles that match your skills.</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-72">
            <Input label="Search" placeholder="Title, company or location" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button onClick={fetchJobs} variant="secondary" disabled={loading}>Search</Button>
          <div className="ml-auto flex gap-2 text-sm">
            <a href="/applicant/jobs?tab=jobs" className={`tab ${activeTab === "jobs" ? "tab-active" : ""}`}>Jobs</a>
            <a href="/applicant/jobs?tab=matches" className={`tab ${activeTab === "matches" ? "tab-active" : ""}`}>Matches</a>
          </div>
        </div>

        {activeTab === "matches" && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input label="Candidate ID" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
              <Input label="Skills (CSV)" value={skills} onChange={(e) => setSkills(e.target.value)} hint="e.g., React,Node.js,TypeScript" />
              <Input label="Min Score (optional)" type="number" value={score?.toString() ?? ""} onChange={(e) => setScore(e.target.value ? Number(e.target.value) : undefined)} />
              <Button onClick={fetchMatches} disabled={loading}>Refresh Matches</Button>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className="card-muted">{message}</div>
      )}

      <div className="grid-cards">
        {activeTab === "jobs" &&
          jobs.map((job, idx) => (
            <article key={job.id ?? idx} className="rounded-lg border bg-white p-5">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                </div>
                <span className="text-xs text-slate-500">ID: {job.id ?? "N/A"}</span>
              </header>
              <p className="mt-3 text-sm text-slate-700 line-clamp-3">{job.description}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary">View</Button>
                <Button>Apply</Button>
              </div>
            </article>
          ))
        }

        {activeTab === "matches" &&
          matches.map((job, idx) => (
            <article key={job.id ?? idx} className="rounded-lg border bg-white p-5">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                </div>
                <div className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                  Match Score: {job.score ?? "-"}
                </div>
              </header>
              <p className="mt-3 text-sm text-slate-700 line-clamp-3">{job.description}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary">View</Button>
                <Button>Apply</Button>
              </div>
            </article>
          ))
        }
      </div>
    </div>
  );
}

export default function ApplicantJobsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
