import { writeClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

// CREATE a comment
export async function POST(req: Request) {
  const { postId, parentId, name, message } = await req.json();

  if (!name || !message)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const newComment = await writeClient.create({
    _type: "comment",
    post: { _type: "reference", _ref: postId },
    parent: parentId ? { _type: "reference", _ref: parentId } : null,
    name,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(newComment);
}

// EDIT a comment
export async function PATCH(req: Request) {
  const { id, message } = await req.json();
  if (!id || !message)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    const updatedComment = await writeClient.patch(id).set({ message }).commit();
    return NextResponse.json(updatedComment);
  } catch (err) {
    console.error("Error editing comment:", err);
    return NextResponse.json({ error: "Failed to edit comment" }, { status: 500 });
  }
}

// DELETE a comment
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });

  try {
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
