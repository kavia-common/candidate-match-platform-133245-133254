"use client";

import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CareerMatch
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/dashboard">Dashboard</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/jobs">Jobs</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/assessments">Assessments</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/login">Login</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/register">Register</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerMatch. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
