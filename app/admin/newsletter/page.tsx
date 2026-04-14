"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
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

        <button
          onClick={sendNewsletter}
          className="bg-black text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {loading ? "Sending..." : "Send Newsletter"}
        </button>
      </div>

      {/* RIGHT: Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Email Preview</h2>

        <div className="border rounded-md bg- shadow-sm">
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
