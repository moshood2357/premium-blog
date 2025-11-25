"use client";

import { useState } from "react";
import PostCard, { Post } from "./PostCard";
import Link from "next/link";

type Props = { posts: Post[] };

export default function BlogList({ posts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.categories || []))
  );

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.categories?.includes(selectedCategory))
    : posts;

  return (
    <div>
      {/* Category Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded ${
            selectedCategory === null ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Render Filtered Posts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug.current}
            href={`/blog/${post.slug.current}`}
            className="block"
          >
            <PostCard post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
}
