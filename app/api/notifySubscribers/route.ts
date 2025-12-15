import { NextRequest, NextResponse } from "next/server";
import sanityClient from "@sanity/client";

// Sanity client
const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-12-07",
  token: process.env.SANITY_WRITE_TOKEN,
});

interface Subscriber {
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 Verify Sanity webhook
    const secret = req.headers.get("x-sanity-secret");
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url } = await req.json();
    if (!title || !url) {
      return NextResponse.json(
        { error: "Missing title or url" },
        { status: 400 }
      );
    }

    // 👥 Fetch subscribers
    const subscribers: Subscriber[] = await client.fetch(
      `*[_type=="newsletterSubscriber" && defined(email)]{email}`
    );

    // ✅ Filter valid emails
    const emails: string[] = subscribers
      .map((s) => s.email)
      .filter((e): e is string => !!e && e.includes("@"));

    // 📧 Send emails via EmailJS
    await Promise.all(
      emails.map((email) =>
        fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            template_params: {
              to_email: email,
              post_title: title,
              post_url: url,
            },
          }),
        })
      )
    );

    return NextResponse.json({
      message: `Notified ${emails.length} subscribers`,
    });
  } catch (err) {
    console.error("NotifySubscribers Error:", err);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
