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
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (liked) return;

    // Optimistically update the UI
    setLikes((prev) => prev + 1);
    setLiked(true);

    try {
      // Get user IP
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipRes.json();

      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, ip }),
      });

      const data = await res.json();

      if (data.message === "Already liked") {
        // If already liked, revert the optimistic update
        setLikes((prev) => prev - 1);
      } else if (data.likes !== undefined) {
        // Ensure UI reflects the latest likes from backend
        setLikes(data.likes);
      }
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert optimistic update on error
      setLikes((prev) => prev - 1);
      setLiked(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://blog.r2systemsolution.co.uk/blog/${slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy link. Please copy manually.");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded text-white ${
          liked ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 cursor-pointer"
        }`}
      >
        ❤️ {liked ? "Liked" : "Like"} ({likes})
      </button>

      {/* Share Buttons */}
      <div className="flex gap-4">
        <a
          href={`https://twitter.com/intent/tweet?url=https://blog.r2systemsolution.co.uk/blog/${slug}`}
          target="_blank"
          className="underline text-blue-500 cursor-pointer"
        >
          Share on Twitter
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://blog.r2systemsolution.co.uk/blog/${slug}`}
          target="_blank"
          className="underline text-blue-700 cursor-pointer"
        >
          Share on Facebook
        </a>

        <button
          onClick={handleCopy}
          className="underline text-gray-700 cursor-pointer"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
