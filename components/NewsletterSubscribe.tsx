"use client";

import { useState } from "react";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md">
      <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-600 text-sm mt-2">
          You’ll be notified when we publish new posts 📬
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">
          Failed to subscribe. Try again.
        </p>
      )}
    </div>
  );
}
