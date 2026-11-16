"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm shadow disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? "Memproses..." : "Daftar Sekarang"}
    </button>
  );
}
