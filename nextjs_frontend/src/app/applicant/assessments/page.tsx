"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";

type AssessmentListItem = {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  questionCount?: number;
};

type AssessmentDefinition = {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  questions: Array<{
    id: string;
    type: "mcq" | string;
    question: string;
    options: string[];
  }>;
};

type ResultsPayload = {
  candidateId: string;
  assessmentId: string;
  attempts: number;
  latest: {
    id: string;
    candidateId: string;
    assessmentId: string;
    answersCount: number;
    correctCount: number;
    totalQuestions: number;
    score: number;
    submittedAt: string;
    breakdown: Array<{
      questionId: string;
      selectedIndex: number | null;
      correct: boolean;
      correctOptionIndex: number;
    }>;
  } | null;
  chart: {
    labels: string[];
    datasets: Array<{ label: string; data: number[]; backgroundColor?: string[] }>;
  };
  perQuestion: {
    labels: string[];
    datasets: Array<{ label: string; data: number[]; backgroundColor?: string[] }>;
  };
};

function useAssessments() {
  const [list, setList] = React.useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${Api.base()}/assessments/list`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load assessments (${res.status})`);
        const data = await res.json();
        if (mounted) setList(data.assessments || []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load assessments";
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { list, loading, error };
}

export default function ApplicantAssessmentsPage() {
  const [candidateId, setCandidateId] = React.useState("u1");

  const { list, loading: loadingList, error: listError } = useAssessments();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [definition, setDefinition] = React.useState<AssessmentDefinition | null>(null);
  const [loadingDef, setLoadingDef] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<ResultsPayload | null>(null);

  // answers state: map questionId -> selectedIndex
  const [answers, setAnswers] = React.useState<Record<string, number | null>>({});

  // Fetch definition when selectedId changes
  React.useEffect(() => {
    if (!selectedId) return;
    let mounted = true;
    (async () => {
      setLoadingDef(true);
      setResults(null); // clear previous results if switching
      try {
        const res = await fetch(`${Api.base()}/assessments/${encodeURIComponent(selectedId)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load assessment (${res.status})`);
        const data: { assessment?: AssessmentDefinition } = await res.json();
        const def: AssessmentDefinition | undefined = data.assessment;
        if (def && mounted) {
          setDefinition(def);
          // init answers map
          const init: Record<string, number | null> = {};
          def.questions.forEach((q) => (init[q.id] = null));
          setAnswers(init);
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        if (mounted) setLoadingDef(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  const canSubmit = React.useMemo(() => {
    if (!definition) return false;
    return definition.questions.every((q) => typeof answers[q.id] === "number");
  }, [definition, answers]);

  const handleSelect = (qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!definition || !selectedId) return;
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      // Build answers array matching backend schema: [{questionId, selectedIndex}]
      const payloadAnswers = definition.questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] as number,
      }));
      // Submit
      await fetch(`${Api.base()}/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          assessmentId: selectedId,
          answers: payloadAnswers,
        }),
      }).then(async (r) => {
        if (!r.ok) throw new Error(`Submit failed (${r.status})`);
        return r.json();
      });

      // Fetch results immediately
      const params = new URLSearchParams({ candidateId, assessmentId: selectedId });
      const res = await fetch(`${Api.base()}/assessments/results?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Result fetch failed (${res.status})`);
      const data: ResultsPayload = await res.json();
      setResults(data);
      // Scroll to chart area for better UX
      document.getElementById("result-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      setSubmitError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl section space-y-6">
      <div>
        <h1 className="title">Assessments</h1>
        <p className="subtitle mt-1">Choose an assessment, answer MCQs, and see your results instantly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 space-y-3">
          <Input
            label="Candidate ID"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Available Assessments</p>
            <div className="space-y-2">
              {loadingList && <p className="text-sm text-slate-500">Loading...</p>}
              {listError && <p className="text-sm text-red-600">{listError}</p>}
              {!loadingList && !listError && list.length === 0 && (
                <p className="text-sm text-slate-500">No assessments available.</p>
              )}
              <ul className="space-y-1">
                {list.map((a) => (
                  <li key={a.id}>
                    <button
                      className={`w-full text-left rounded-md px-3 py-2 text-sm border ${
                        selectedId === a.id ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <div className="font-medium">{a.title}</div>
                      {a.description && <div className="text-xs text-slate-600">{a.description}</div>}
                      <div className="text-xs text-slate-500">
                        {a.questionCount ?? 0} questions{a.durationMinutes ? ` • ${a.durationMinutes} min` : ""}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          {!selectedId && (
            <div className="card-muted">
              <p className="text-sm text-slate-600">Select an assessment to begin.</p>
            </div>
          )}
          {selectedId && loadingDef && <p className="text-sm text-slate-500">Loading assessment...</p>}

          {definition && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <div>
                  <h2 className="text-base font-semibold">{definition.title}</h2>
                  {definition.description && (
                    <p className="text-sm text-slate-600">{definition.description}</p>
                  )}
                </div>

                <ol className="space-y-4">
                  {definition.questions.map((q, qi) => (
                    <li key={q.id} className="space-y-2">
                      <div className="font-medium">
                        Q{qi + 1}. {q.question}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, idx) => {
                          const name = `q-${q.id}`;
                          const checked = answers[q.id] === idx;
                          return (
                            <label
                              key={idx}
                              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                                checked ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={name}
                                value={idx}
                                checked={checked || false}
                                onChange={() => handleSelect(q.id, idx)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="flex items-center gap-3">
                  <Button type="submit" loading={submitLoading} disabled={!canSubmit}>
                    Submit Answers
                  </Button>
                  {!canSubmit && (
                    <span className="text-xs text-slate-500">Answer all questions to enable submission</span>
                  )}
                </div>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Results */}
      <div id="result-panel" className="space-y-4">
        {results && results.latest && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Results</h3>
                <p className="text-sm text-slate-600">
                  Attempt #{results.attempts} • Score: <span className="font-medium">{results.latest.score}%</span>
                </p>
              </div>
              <div className="text-sm text-slate-500">
                Correct {results.latest.correctCount}/{results.latest.totalQuestions}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DonutChart
                title="Correct vs Wrong"
                labels={results.chart.labels}
                data={results.chart.datasets[0]?.data || []}
                colors={results.chart.datasets[0]?.backgroundColor || ["#22c55e", "#ef4444"]}
              />
              <BarChart
                title="Per-question correctness"
                labels={results.perQuestion.labels}
                data={results.perQuestion.datasets[0]?.data || []}
                colors={results.perQuestion.datasets[0]?.backgroundColor}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Lightweight, dependency-free SVG Donut and Bar charts
 * to avoid adding external packages and keep CI simple.
 */
function DonutChart({
  title,
  labels,
  data,
  colors = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"],
}: {
  title?: string;
  labels: string[];
  data: number[];
  colors?: string[];
}) {
  const size = 160;
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((a, b) => a + b, 0) || 1;

  let offset = 0;

  return (
    <div className="space-y-2">
      {title && <div className="text-sm font-medium">{title}</div>}
      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
            {data.map((value, i) => {
              const length = (value / total) * circumference;
              const dashArray = `${length} ${circumference - length}`;
              const circle = (
                <circle
                  key={i}
                  r={radius}
                  cx={0}
                  cy={0}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth={stroke}
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                />
              );
              offset += length;
              return circle;
            })}
          </g>
        </svg>
        <div className="space-y-1">
          {labels.map((l, i) => (
            <div key={l} className="flex items-center gap-2 text-xs text-slate-600">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              {l}: <span className="font-medium">{data[i] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChart({
  title,
  labels,
  data,
  colors,
}: {
  title?: string;
  labels: string[];
  data: number[];
  colors?: string[] | undefined;
}) {
  const width = 320;
  const height = 160;
  const padding = 20;
  const barGap = 8;

  const maxVal = Math.max(1, ...data);
  const barWidth = (width - padding * 2 - barGap * (data.length - 1)) / Math.max(1, data.length);

  return (
    <div className="space-y-2">
      {title && <div className="text-sm font-medium">{title}</div>}
      <svg width={width} height={height} className="bg-white border border-slate-200 rounded-md">
        {/* axis line */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
        />
        {data.map((v, i) => {
          const x = padding + i * (barWidth + barGap);
          const h = ((v / maxVal) * (height - padding * 2)) | 0;
          const y = height - padding - h;
          const fill = colors?.[i] || (v > 0 ? "#22c55e" : "#ef4444");
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} fill={fill} rx={3} />
              <text x={x + barWidth / 2} y={height - padding + 12} fontSize="10" fill="#64748b" textAnchor="middle">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


