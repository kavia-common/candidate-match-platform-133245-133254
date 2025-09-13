"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";

export default function ApplicantRegisterPage() {
  const [name, setName] = React.useState("Alice Applicant");
  const [email, setEmail] = React.useState("alice@example.com");
  const [password, setPassword] = React.useState("secret");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.register(name, email, password);
      setMessage(`Registered ${res.user?.name ?? "Applicant"} successfully! Token: ${res.token}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-slate-600 mt-1">Join CareerMatch and start applying today.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border bg-white p-6">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
