"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

  const sendNewsletter = async () => {
    if (!subject || !content) {
      toast.error("Subject and content required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Newsletter queued 🚀");
        setSubject("");
        setContent("");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Test email
  const sendTest = async () => {
    const email = prompt("Enter test email:");
    if (!email) return;

    try {
      const res = await fetch("/api/admin/newsletter/test", {
        method: "POST",
        body: JSON.stringify({ subject, content, email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Test email sent ✉️");
      } else {
        toast.error("Failed to send test");
      }
    } catch {
      toast.error("Test failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      {/* LEFT: Editor */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Send Newsletter</h1>

        <input
          placeholder="Subject"
          className="w-full border p-2 mb-3 rounded-md"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="HTML Content"
          className="w-full border p-2 mb-3 h-60 rounded-md font-mono text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={sendNewsletter}
            className="bg-black text-white px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {loading ? "Sending..." : "Send"}
          </button>

          {/* ✅ NEW BUTTON */}
          <button onClick={sendTest} className="border px-4 py-2 rounded-md">
            Test
          </button>
        </div>
      </div>

      {/* RIGHT: Preview */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Email Preview</h2>

          {/* ✅ NEW: Preview toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`px-2 py-1 border rounded ${
                previewMode === "desktop" ? "bg-black text-white" : ""
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`px-2 py-1 border rounded ${
                previewMode === "mobile" ? "bg-black text-white" : ""
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        <div
          className={`border rounded-md shadow-sm ${
            previewMode === "mobile" ? "max-w-sm mx-auto" : ""
          }`}
        >
          <div className="border-b p-3 text-sm" style={{ color: "gray" }}>
            <strong>Subject:</strong> {subject || "(No subject)"}
          </div>

          <div
            className="p-4 text-sm prose max-w-none text-gray-800 overflow-auto"
            dangerouslySetInnerHTML={{
              __html: content || "<p style='color:gray'>No content yet...</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
}
