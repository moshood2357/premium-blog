import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { postId, ip } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  // Check if user already liked
  const existing = await client.fetch(
    `*[_type == "like" && post._ref == $postId && ipAddress == $ip][0]`,
    { postId, ip }
  );

  if (existing) {
    return NextResponse.json({ message: "Already liked" });
  }

  await client.create({
    _type: "like",
    post: { _type: "reference", _ref: postId },
    ipAddress: ip,
  });

  return NextResponse.json({ message: "Liked" });
}
