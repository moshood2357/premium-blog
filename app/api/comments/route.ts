import { readClient as client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  const comments = await client.fetch(
    `*[_type == "comment" && post._ref == $postId] | order(createdAt desc){
      _id,
      name,
      message,
      createdAt,
      parent->{_id}
    }`,
    { postId }
  );

  return Response.json(comments);
}
