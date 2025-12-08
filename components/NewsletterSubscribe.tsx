"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const SERVICE_ID = "service_n9qfh8j";
  const TEMPLATE_ID = "template_ceokmiq";
  const PUBLIC_KEY = "haApIcl_okl18mmq8";

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      // 1️⃣ Send welcome email via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { email }, PUBLIC_KEY);

      // 2️⃣ Save subscriber to Sanity
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Sanity save error:", data.message);
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md">
      <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
      <p className="text-gray-600 text-sm mb-4">
        Get updates when new posts are published.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-600 text-sm mt-2">Subscribed successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">Failed to subscribe. Try again.</p>
      )}
    </div>
  );
}
