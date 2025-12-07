import { NextRequest, NextResponse } from "next/server";
import emailjs from "@emailjs/browser";
import sanityClient from "@sanity/client";

// Initialize Sanity client
const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-12-07",
  token: process.env.SANITY_WRITE_TOKEN, // server-side only
});

export async function POST(req: NextRequest) {
  try {
    // Optional: validate webhook secret
    const secret = req.headers.get("x-sanity-secret");
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, url } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Missing title or url" }, { status: 400 });
    }

    // Fetch all subscriber emails
    const subscribers = await client.fetch(`*[_type=="subscriber"]{email}`);
    const emails = subscribers.map((s: { email: string }) => s.email);

    // Send email notifications via EmailJS
    for (const email of emails) {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        { to_email: email, post_title: title, post_url: url },
        process.env.EMAILJS_PUBLIC_KEY!
      );
    }

    return NextResponse.json({ message: "Notifications sent" }, { status: 200 });
  } catch (err) {
    console.error("NotifySubscribers Error:", err);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
