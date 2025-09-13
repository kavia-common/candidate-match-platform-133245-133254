import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * PUBLIC_INTERFACE
 * App-level metadata for SEO and social sharing.
 */
export const metadata: Metadata = {
  title: {
    default: "CareerMatch",
    template: "%s | CareerMatch",
  },
  description: "Modern hiring platform for job seekers and recruiters",
  applicationName: "CareerMatch",
  robots: { index: true, follow: true },
  openGraph: {
    title: "CareerMatch",
    description:
      "Modern hiring platform for job seekers and recruiters",
    type: "website",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

/**
 * PUBLIC_INTERFACE
 * Viewport definition for responsive rendering and stable hydration.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
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
