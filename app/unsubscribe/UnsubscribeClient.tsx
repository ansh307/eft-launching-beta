// /unsubscribe/UnsubscribeClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UnsubscribeClient() {
  const params = useSearchParams();
  const email = params.get("email");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleUnsub = async () => {
    if (!email) return;

    setLoading(true);

    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setDone(true);
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6 text-center">
        {!done ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">
              Unsubscribe from Emails
            </h1>

            <p className="text-neutral-400 text-sm mb-6">
              You are about to unsubscribe
            </p>

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mb-6 text-sm">
              {email || "No email found"}
            </div>

            <button
              onClick={handleUnsub}
              disabled={loading || !email}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Unsubscribing..." : "Confirm Unsubscribe"}
            </button>

            <p className="text-xs text-neutral-500 mt-4">
              You can resubscribe anytime from our website.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-2 text-green-400">
              You’re unsubscribed
            </h1>

            <p className="text-neutral-400 text-sm mb-6">
              You will no longer receive emails from us.
            </p>

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm">
              {email}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
