import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";


// Initialize Sanity client (server-only)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2025-12-08",
  token: process.env.SANITY_WRITE_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }
    

    const safeId = email.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `subscriber-${safeId}`;

    // Create subscriber if it doesn't exist
    await client.createIfNotExists({
      _id: docId,
      _type: "newsletterSubscriber",
      email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Saved to Sanity successfully" }, { status: 200 });
  } catch (err) {
    console.error("Sanity Save Error:", err);
    return NextResponse.json({ message: "Failed to save to Sanity" }, { status: 500 });
  }
}
