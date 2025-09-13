"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function EmployerCandidatesPage() {
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
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Candidates</h1>
          <p className="text-slate-600 mt-1">View applicants who applied to your job.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
        </div>
        <Button onClick={fetchCandidates} loading={loading}>Refresh</Button>
      </div>

      {message && <div className="rounded-md border bg-slate-50 p-4 text-sm">{message}</div>}

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-4 py-2">Candidate</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Score</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.score}</td>
                <td className="px-4 py-2">
                  <Button variant="secondary" className="mr-2">View</Button>
                  <Button>Invite</Button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={4}>No candidates yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
