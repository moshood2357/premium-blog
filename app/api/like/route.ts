import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { postId, ip } = await req.json();

    if (!postId) {
      return Response.json({ error: "postId is required" }, { status: 400 });
    }

    if (!writeClient) {
      return Response.json(
        { error: "Sanity write client is not configured" },
        { status: 500 }
      );
    }

    await writeClient.create({
      _type: "like",
      post: { _type: "reference", _ref: postId },
      ipAddress: ip ?? null,
    });

    return Response.json({ success: true });
  } catch (error: unknown) {
    // Narrow error type safely
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Fallback for unexpected types
    return Response.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
