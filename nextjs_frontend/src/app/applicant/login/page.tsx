"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Api } from "@/lib/api";

export default function ApplicantLoginPage() {
  const [email, setEmail] = React.useState("alice@example.com");
  const [password, setPassword] = React.useState("secret");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await Api.login(email, password);
      setMessage(`Welcome ${res.user?.name ?? "Applicant"}! Token: ${res.token}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md">
      <h1 className="title">Login</h1>
      <p className="subtitle mt-1">Access your applicant dashboard.</p>

      <form onSubmit={onSubmit} className="mt-6 form">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" loading={loading}>Login</Button>
      </form>

      {message && (
        <div className="mt-4 card-muted">
          {message}
        </div>
      )}
    </div>
  );
}
