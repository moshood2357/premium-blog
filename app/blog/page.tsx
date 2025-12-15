import Link from "next/link"; // Import Link for navigation
import { readClient as client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";

import BlogList from "@/components/BlogList";
import { Post } from "@/components/PostCard";

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(allPostsQuery);

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      {/* Back to Homepage Button */}
      <div className="mb-6">
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ← Back to Homepage
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-10 tracking-tight">Latest Posts</h1>

      {/* Client-side filtering */}
      <BlogList posts={posts} />
    </main>
  );
}
