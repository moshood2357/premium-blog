"use client";

import { useState } from "react";

interface Props {
  postId: string;
  slug: string;
  initialLikes: number;
}

export default function PostInteractions({
  postId,
  slug,
  initialLikes,
}: Props) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Like Button */}
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={async () => {
          await fetch("/api/like", {
            method: "POST",
            body: JSON.stringify({ postId }),
          });
          setLikes(likes + 1);
        }}
      >
        ❤️ Like ({likes})
      </button>

      {/* Share Buttons */}
      <div className="flex gap-4">
        <a
          href={`https://twitter.com/intent/tweet?url=https://yourdomain.com/blog/${slug}`}
          target="_blank"
          className="underline text-blue-500"
        >
          Share on Twitter
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://yourdomain.com/blog/${slug}`}
          target="_blank"
          className="underline text-blue-700"
        >
          Share on Facebook
        </a>

        <button
          onClick={() =>
            navigator.clipboard.writeText(`https://yourdomain.com/blog/${slug}`)
          }
          className="underline text-gray-700"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
