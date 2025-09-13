"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * Global error boundary for the Next.js App Router.
 * This component catches runtime errors thrown in the current segment and displays a friendly message.
 * Provides a reset() callback to retry rendering.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("GlobalError captured:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4 text-sm text-gray-600">
            An unexpected error occurred. You can try again.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
