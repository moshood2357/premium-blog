// app/blog/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { singlePostQuery, relatedPostsQuery } from "@/sanity/lib/queries";
import { Post, RelatedPost } from "@/types";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import PostInteractions from "@/components/PostInteractions";
import CommentSection from "@/components/CommentSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ----------------------
// SEO Metadata
// ----------------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await client.fetch(singlePostQuery, { slug });

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || "Read this insightful post on our blog.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read this insightful post on our blog.",
      url: `https://blog.r2systemsolution.co.uk/blog/${post.slug.current}`,
      images: post.mainImage?.asset?.url
        ? [{ url: post.mainImage.asset.url, width: 800, height: 450 }]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read this insightful post on our blog.",
      images: post.mainImage?.asset?.url ? [post.mainImage.asset.url] : [],
    },
  };
}

// ----------------------
// Blog Post Server Component
// ----------------------
export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  // Fetch post
  const post: Post | null = await client.fetch(singlePostQuery, { slug });
  if (!post) return <p>Post not found.</p>;

  // Fetch related posts
  const relatedPosts: RelatedPost[] = await client.fetch(relatedPostsQuery, {
    slug,
    categories: post.categories || [],
  });

  // Fetch likes count
  const likes: number = await client.fetch(
    `count(*[_type == "like" && post._ref == $id])`,
    { id: post._id }
  );


  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Post Content */}
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.mainImage?.asset?.url && (
          <Image
            src={post.mainImage.asset.url}
            alt={post.title}
            width={800}
            height={450}
            className="w-full h-auto mb-6 rounded"
          />
        )}

        {/* PortableText expects PortableTextBlock[] */}
        {post.body && <PortableText value={post.body} />}

        {/* Client-Side Likes & Share */}
        <PostInteractions
          postId={post._id} // <- must exist in Post type
          slug={post.slug.current}
          initialLikes={likes}
          
        />
      </article>

      {/* Comments */}
      <CommentSection postId={post._id} />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Related Posts</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug.current}
                href={`/blog/${rp.slug.current}`}
                className="block p-4 border rounded hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <h4 className="font-bold">{rp.title}</h4>
                {rp.mainImage?.asset?.url && (
                  <Image
                    src={rp.mainImage.asset.url}
                    alt={rp.title}
                    width={400}
                    height={200}
                    className="w-full h-auto mt-2 rounded"
                  />
                )}
                {rp.excerpt && (
                  <p className="mt-2 text-gray-600">{rp.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
