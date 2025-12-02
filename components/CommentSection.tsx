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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>({});

  // Build tree
  function buildTree(list: Comment[]) {
    const map: Record<string, Comment> = {};
    const roots: Comment[] = [];
    list.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    list.forEach((c) =>
      c.parent?._id ? map[c.parent._id].replies!.push(map[c._id]) : roots.push(map[c._id])
    );
    return roots;
  }

  // Load comments
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data: Comment[] = await res.json();

      const tree = buildTree(data);

      // Initialize collapsed state: hide all replies by default
      const collapsedState: Record<string, boolean> = {};
      const initCollapse = (list: Comment[]) => {
        list.forEach((c) => {
          if (c.replies && c.replies.length > 0) {
            collapsedState[c._id] = true; // hide replies initially
            initCollapse(c.replies);
          }
        });
      };
      initCollapse(tree);

      setComments(tree);
      setCollapsed(collapsedState);
    }
    load();
  }, [postId]);

  // Submit comment/reply
  async function submitComment(
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) {
    e.preventDefault();
    const formId = parentId || "root";
    setSubmittingIds((prev) => ({ ...prev, [formId]: true }));

    try {
      const formData = new FormData(e.currentTarget);

      await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          postId,
          parentId,
          name: formData.get("name"),
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const reload = await fetch(`/api/comments?postId=${postId}`);
      setComments(buildTree(await reload.json()));

      e.currentTarget.reset();
      setReplyTo(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [formId]: false }));
    }
  }

  // Edit comment
  async function handleEdit(id: string, message: string) {
    await fetch("/api/comment", {
      method: "PATCH",
      body: JSON.stringify({ id, message }),
      headers: { "Content-Type": "application/json" },
    });

    const update = (list: Comment[]): Comment[] =>
      list.map((c) => ({
        ...c,
        message: c._id === id ? message : c.message,
        replies: c.replies ? update(c.replies) : [],
      }));

    setComments((prev) => update(prev));
    setEditing(null);
  }

  // Delete comment
  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;

    await fetch(`/api/comment?id=${id}`, { method: "DELETE" });

    const remove = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c._id !== id)
        .map((c) => ({ ...c, replies: c.replies ? remove(c.replies) : [] }));

    setComments((prev) => remove(prev));
  }

  // Recursive Comment Renderer
  const RenderComment = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div
        className="mt-6 transition-all duration-300 ease-out"
        style={{
          marginLeft: depth * 20,
          borderLeft: depth > 0 ? "1px solid #e5e7eb" : "none",
          paddingLeft: depth > 0 ? 16 : 0,
        }}
      >
        <p className="font-semibold">{comment.name}</p>

        {/* Edit Mode */}
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
            <button className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
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

        {/* Reply/Edit/Delete */}
        <div className="flex gap-4 mt-1">
          <button className="text-blue-600 text-sm" onClick={() => setReplyTo(comment._id)}>
            Reply
          </button>
          {editing !== comment._id && (
            <>
              <button className="text-green-600 text-sm" onClick={() => setEditing(comment._id)}>
                Edit
              </button>
              <button className="text-red-600 text-sm" onClick={() => handleDelete(comment._id)}>
                Delete
              </button>
            </>
          )}
        </div>

        {/* Replies Toggle */}
        {hasReplies && (
          <button
            onClick={() =>
              setCollapsed((prev) => ({ ...prev, [comment._id]: !prev[comment._id] }))
            }
            className="text-sm text-gray-600 mt-2"
          >
            {collapsed[comment._id]
              ? `Show Replies (${comment.replies!.length}) ▼`
              : `Hide Replies ▲`}
          </button>
        )}

        {/* Replies */}
        {!collapsed[comment._id] && (
          <div className="mt-4 ml-4 border-l pl-4 animate-fade-slide space-y-4">
            {/* Reply Form */}
            {replyTo === comment._id && (
              <form className="space-y-2" onSubmit={(e) => submitComment(e, comment._id)}>
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
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  disabled={submittingIds[comment._id]}
                >
                  {submittingIds[comment._id] ? "Submitting..." : "Submit Reply"}
                </button>
              </form>
            )}

            {/* Nested Replies */}
            {hasReplies &&
              comment.replies!.map((reply) => (
                <RenderComment key={reply._id} comment={reply} depth={depth + 1} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>

      {/* New Comment Form */}
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={submittingIds["root"]}
        >
          {submittingIds["root"] ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Render Comments */}
      {comments.map((comment) => (
        <RenderComment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}
