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
  const [editing, setEditing] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  async function submitComment(e: React.FormEvent<HTMLFormElement>, parentId?: string) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString();
    const message = formData.get("message")?.toString();

    await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ postId, parentId, name, message }),
      headers: { "Content-Type": "application/json" },
    });

    const reload = await fetch(`/api/comments?postId=${postId}`);
    setComments(buildTree(await reload.json()));
    form.reset();
    setReplyTo(null);
    setSubmitting(false);
  }

  // Delete comment
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const res = await fetch(`/api/comment?id=${id}`, { method: "DELETE" });
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== id));
  }

  // Edit comment
  async function handleEdit(id: string, newMessage: string) {
    const res = await fetch("/api/comment", {
      method: "PATCH",
      body: JSON.stringify({ id, message: newMessage }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, message: newMessage } : c))
      );
      setEditing(null);
    }
  }

  // Recursive comment component
  const RenderComment = ({ comment }: { comment: Comment }) => (
    <div className="border-l pl-4 mt-4">
      <p className="font-semibold">{comment.name}</p>

      {/* Edit form */}
      {editing === comment._id ? (
        <form
          className="mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleEdit(comment._id, formData.get("message")!.toString());
          }}
        >
          <textarea
            name="message"
            defaultValue={comment.message}
            className="border px-2 py-1 rounded w-full"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded">
            Save
          </button>
          <button
            type="button"
            className="bg-gray-300 px-2 py-1 rounded ml-2"
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <p>{comment.message}</p>
      )}

      {/* Reply button */}
      <button
        className="text-blue-600 text-sm mt-1"
        onClick={() => setReplyTo(comment._id)}
      >
        Reply
      </button>

      {/* Edit & Delete buttons */}
      {!replyTo && editing !== comment._id && (
        <div className="flex gap-2 mt-1">
          <button
            className="text-green-600 text-sm"
            onClick={() => setEditing(comment._id)}
          >
            Edit
          </button>
          <button
            className="text-red-600 text-sm"
            onClick={() => handleDelete(comment._id)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Reply form */}
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
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Reply"}
          </button>
        </form>
      )}

      {/* Render replies recursively */}
      {comment.replies?.map((reply) => (
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Render threads */}
      {comments.map((comment) => (
        <RenderComment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}
