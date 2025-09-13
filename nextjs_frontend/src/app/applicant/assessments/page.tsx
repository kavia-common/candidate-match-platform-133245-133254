"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";

export default function ApplicantAssessmentsPage() {
  const [candidateId, setCandidateId] = React.useState("u1");
  const [assessmentId, setAssessmentId] = React.useState("a1");
  const [answers, setAnswers] = React.useState("A,B,C");
  const [score, setScore] = React.useState<number | undefined>(75);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await Api.submitAssessment(
        candidateId,
        assessmentId,
        answers.split(",").map((s) => s.trim()),
        score
      );
      setMessage(`Submitted! ${result?.result ? `Result: ${result.result}` : ""} ${result?.score !== undefined ? `(Score: ${result.score})` : ""}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assessments</h1>
        <p className="text-slate-600 mt-1">Complete assessments to improve your job matches.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-lg border bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Candidate ID" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
          <Input label="Assessment ID" value={assessmentId} onChange={(e) => setAssessmentId(e.target.value)} />
        </div>
        <Input label="Answers (CSV)" value={answers} onChange={(e) => setAnswers(e.target.value)} hint="e.g., A,B,C" />
        <Input label="Score (optional)" type="number" value={score?.toString() ?? ""} onChange={(e) => setScore(e.target.value ? Number(e.target.value) : undefined)} />
        <Button type="submit" loading={loading}>Submit Assessment</Button>
      </form>

      {message && (
        <div className="rounded-md border bg-slate-50 p-4 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
