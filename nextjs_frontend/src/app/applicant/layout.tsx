import type { Metadata } from "next";
import React from "react";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Applicant | CareerMatch",
  description: "Applicant panel for CareerMatch",
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
