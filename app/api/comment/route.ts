import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { postId, parentId, name, message } = await req.json();

  if (!name || !message)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const newComment = await client.create({
    _type: "comment",
    post: { _type: "reference", _ref: postId },
    parent: parentId ? { _type: "reference", _ref: parentId } : null,
    name,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(newComment);
}
