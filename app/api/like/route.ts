import { writeClient, readClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId, ip } = await req.json();

    if (!postId || !ip) {
      return NextResponse.json({ error: "Missing postId or IP" }, { status: 400 });
    }

    // Check if user already liked this post
    const existing = await readClient.fetch(
      `*[_type == "like" && post._ref == $postId && ipAddress == $ip][0]`,
      { postId, ip }
    );

    if (existing) {
      return NextResponse.json({ message: "Already liked" });
    }

    // Create new like
    await writeClient.create({
      _type: "like",
      post: { _type: "reference", _ref: postId },
      ipAddress: ip,
    });

    // Count total likes
    const totalLikes: number = await readClient.fetch(
      `count(*[_type == "like" && post._ref == $postId])`,
      { postId }
    );

    return NextResponse.json({ message: "Liked", likes: totalLikes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
