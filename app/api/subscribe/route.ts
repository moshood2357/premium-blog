import { NextRequest, NextResponse } from "next/server";
import emailjs from "@emailjs/browser";
import sanityClient from "@sanity/client";

// Sanity client
const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-12-07",
  token: process.env.SANITY_WRITE_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Optionally save to Sanity
    await client.createIfNotExists({
      _id: email,
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });

    // Optionally send a welcome email
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      { user_email: email, date: new Date().toLocaleString() },
      process.env.EMAILJS_PUBLIC_KEY!
    );

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });
  } catch (err) {
    console.error("Subscribe Error:", err);
    return NextResponse.json({ message: "Failed to subscribe" }, { status: 500 });
  }
}
