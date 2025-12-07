import { NextRequest, NextResponse } from "next/server";
import emailjs from "@emailjs/browser";

export async function POST(req: NextRequest) {
  try {
    // Check Sanity webhook secret
    const secret = req.headers.get("x-sanity-secret");
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Send email via EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        user_email: email,
        date: new Date().toLocaleString(),
      },
      process.env.EMAILJS_PUBLIC_KEY!
    );

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to subscribe" }, { status: 500 });
  }
}
