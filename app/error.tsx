"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-sm font-medium">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 text-sm underline underline-offset-2"
      >
        Retry
      </button>
    </div>
  );
}
