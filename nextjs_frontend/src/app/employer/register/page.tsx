"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";

export default function EmployerRegisterPage() {
  const [name, setName] = React.useState("Eve Employer");
  const [email, setEmail] = React.useState("recruiter@example.com");
  const [password, setPassword] = React.useState("secret");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.employerRegister(name, email, password);
      setMessage(`Registered ${res.user?.name ?? "Employer"} successfully! Token: ${res.token}`);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Registration failed";
      setMessage(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Create your employer account</h1>
      <p className="text-slate-600 mt-1">Post jobs and manage candidates on CareerMatch.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border bg-white p-6">
        <Input label="Company / Recruiter Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Work Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" loading={loading}>Create account</Button>
      </form>

      {message && (
        <div className="mt-4 rounded-md border bg-slate-50 p-4 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
