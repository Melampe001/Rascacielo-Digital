'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Algo salió mal</h2>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-800"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
