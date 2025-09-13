"use client";

import React, { Suspense } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function CandidatesContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") ?? "job-1";
  const [jobId, setJobId] = React.useState(initialJobId);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [candidates, setCandidates] = React.useState<Array<{ id: string; name: string; email: string; score: number }>>([]);

  const fetchCandidates = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.employerGetCandidatesForJob();
      setCandidates(res.candidates);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to load candidates";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="section">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="title">Candidates</h1>
          <p className="subtitle mt-1">View applicants who applied to your job.</p>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
        </div>
        <Button onClick={fetchCandidates} loading={loading}>Refresh</Button>
      </div>

      {message && <div className="card-muted">{message}</div>}

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Email</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.score}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary">View</Button>
                    <Button>Invite</Button>
                  </div>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td className="text-slate-500" colSpan={4}>No candidates yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EmployerCandidatesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Loading candidates...</div>}>
      <CandidatesContent />
    </Suspense>
  );
}
