import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerMatch",
  description: "Modern hiring platform for job seekers and recruiters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
