"use client";

import React, { Suspense } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function MatchesContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") ?? "job-1";
  const [jobId, setJobId] = React.useState(initialJobId);
  const [minScore, setMinScore] = React.useState<number | undefined>(80);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [matches, setMatches] = React.useState<Array<{ id: string; name: string; score: number }>>([]);

  const fetchMatches = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.employerGetMatchesForJob(jobId, minScore);
      setMatches(res.candidates);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to load matches";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="title">Matched Candidates</h1>
          <p className="subtitle mt-1">Candidates recommended for your job based on assessments.</p>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
          <Input
            label="Minimum Score"
            type="number"
            value={minScore?.toString() ?? ""}
            onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <Button onClick={fetchMatches} loading={loading}>Refresh</Button>
      </div>

      {message && <div className="card-muted">{message}</div>}

      <div className="grid-cards">
        {matches.map((m) => (
          <article key={m.id} className="rounded-lg border bg-white p-5">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{m.name}</h3>
              <div className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                Score: {m.score}
              </div>
            </header>
            <p className="mt-3 text-sm text-slate-700">Strong fit for this role based on assessments.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">View Profile</Button>
              <Button>Invite</Button>
            </div>
          </article>
        ))}
        {matches.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-sm text-slate-600">
            No matches meet the criteria. Try lowering the minimum score.
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployerMatchesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Loading matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
