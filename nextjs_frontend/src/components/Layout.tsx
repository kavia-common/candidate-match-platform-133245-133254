"use client";

import React from "react";
import Link from "next/link";

// PUBLIC_INTERFACE
export default function Layout({ children }: { children: React.ReactNode }) {
  /**
   * Application shell for the applicant area.
   *
   * Renders a header with navigation, a main content container for children,
   * and a footer. This is a client component to allow interactive nav in
   * all child pages.
   *
   * Returns: JSX.Element
   */
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-inner flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CareerMatch
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4 text-sm">
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/jobs">
              Jobs
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/assessments">
              Assessments
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/login">
              Login
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="/applicant/register">
              Register
            </Link>
          </nav>
        </div>
      </header>
      <main className="shell-main">{children}</main>
      <footer className="shell-footer">
        <div className="shell-inner py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerMatch. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
