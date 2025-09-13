import type { Metadata } from "next";
import React from "react";
import Layout from "@/components/Layout";

/**
 * PUBLIC_INTERFACE
 * Metadata for Applicant segment.
 */
export const metadata: Metadata = {
  title: {
    default: "Applicant",
    template: "%s | Applicant | CareerMatch",
  },
  description: "Applicant panel for CareerMatch",
  alternates: {
    canonical: "/applicant",
  },
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
