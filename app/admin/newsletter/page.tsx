"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNewsletter = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/newsletter/send", {
      method: "POST",
      body: JSON.stringify({ subject, content }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("Newsletter sent 🚀");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Send Newsletter</h1>

      <input
        placeholder="Subject"
        className="w-full border p-2 mb-3"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="HTML Content"
        className="w-full border p-2 mb-3 h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={sendNewsletter}
        className="bg-black text-white px-4 py-2"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Newsletter"}
      </button>
    </div>
  );
}
