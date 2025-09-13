import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Employer | CareerMatch",
  description: "Employer panel for CareerMatch",
};

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-inner flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CareerMatch <span className="text-xs rounded bg-slate-100 px-1.5 py-0.5 align-top ml-1">Employer</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4 text-sm">
            <Link className="hover:text-blue-600 transition-colors" href="/employer/dashboard">Dashboard</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/employer/jobs">Jobs</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/employer/candidates">Candidates</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/employer/login">Login</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/employer/register">Register</Link>
          </nav>
        </div>
      </header>
      <main className="shell-main">{children}</main>
      <footer className="shell-footer">
        <div className="shell-inner py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerMatch for Employers.
        </div>
      </footer>
    </div>
  );
}
