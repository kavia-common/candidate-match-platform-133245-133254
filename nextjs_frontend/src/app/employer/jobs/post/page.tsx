"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EmployerPostJobPage() {
  const [title, setTitle] = React.useState("Frontend Engineer");
  const [company, setCompany] = React.useState("Acme Inc.");
  const [location, setLocation] = React.useState("Remote");
  const [description, setDescription] = React.useState("We are looking for a talented frontend engineer...");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.employerCreateJob({ title, company, location, description });
      setMessage(`Job posted! ID: ${res.job.id}`);
      setTimeout(() => router.push("/employer/jobs"), 900);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Failed to post job";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl section">
      <div>
        <h1 className="title">Post a Job</h1>
        <p className="subtitle mt-1">Create a new job listing for candidates.</p>
      </div>

      <form onSubmit={onSubmit} className="form">
        <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" loading={loading}>Publish Job</Button>
      </form>

      {message && (
        <div className="card-muted">
          {message}
        </div>
      )}
    </div>
  );
}
