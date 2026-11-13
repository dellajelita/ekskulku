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
    <div className="max-w-md mx-auto mt-20 p-6 text-center bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-red-600 mb-2">
        Terjadi Kesalahan!
      </h2>
      <p className="text-gray-600 mb-4">Gagal memuat data ekstrakurikuler.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Coba lagi
      </button>
    </div>
  );
}
