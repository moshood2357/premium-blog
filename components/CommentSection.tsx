"use client";

import { useState, useEffect } from "react";

interface Comment {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
  parent?: { _id: string };
  replies?: Comment[];
}

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Convert flat comments → nested structure
  function buildTree(list: Comment[]) {
    const map: Record<string, Comment> = {};
    const roots: Comment[] = [];

    list.forEach((comment) => (map[comment._id] = { ...comment, replies: [] }));

    list.forEach((comment) => {
      if (comment.parent?._id) {
        map[comment.parent._id]?.replies?.push(map[comment._id]);
      } else {
        roots.push(map[comment._id]);
      }
    });

    return roots;
  }

  // Load comments
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(buildTree(data));
    }
    load();
  }, [postId]);

  // Submit comment or reply
  async function submitComment(
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString();
    const message = formData.get("message")?.toString();

    // const res = await fetch("/api/comment", {
    //   method: "POST",
    //   body: JSON.stringify({ postId, parentId, name, message }),
    //   headers: { "Content-Type": "application/json" },
    // });

    await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ postId, parentId, name, message }),
      headers: { "Content-Type": "application/json" },
    });

    // Reload comments
    const reload = await fetch(`/api/comments?postId=${postId}`);
    setComments(buildTree(await reload.json()));


    setReplyTo(null);
    form.reset();
  }

  // Recursive comment component
  const RenderComment = ({ comment }: { comment: Comment }) => (
    <div className="border-l pl-4 mt-4">
      <p className="font-semibold">{comment.name}</p>
      <p>{comment.message}</p>
      <button
        className="text-blue-600 text-sm mt-1"
        onClick={() => setReplyTo(comment._id)}
      >
        Reply
      </button>

      {replyTo === comment._id && (
        <form
          className="mt-2 space-y-2"
          onSubmit={(e) => submitComment(e, comment._id)}
        >
          <input
            name="name"
            className="border px-2 py-1 rounded w-full"
            placeholder="Your name"
            required
          />
          <textarea
            name="message"
            className="border px-2 py-1 rounded w-full"
            placeholder="Reply..."
            required
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Submit Reply
          </button>
        </form>
      )}

      {/* Render replies recursively */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <RenderComment key={reply._id} comment={reply} />
        ))}
    </div>
  );

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>

      {/* Comment form */}
      <form className="space-y-4 mb-6" onSubmit={(e) => submitComment(e)}>
        <input
          name="name"
          placeholder="Your name"
          className="border px-4 py-2 w-full rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Write a comment..."
          className="border px-4 py-2 w-full rounded h-24"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* Render threads */}
      {comments.map((comment) => (
        <RenderComment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}
