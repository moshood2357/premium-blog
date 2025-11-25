import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/urlFor"; // Sanity image URL helper

// Types
export type SanityImageSource = {
  _type?: "image";
  asset: {
    _ref?: string;
    _id?: string;
  };
};

export type Author = {
  name: string;
  image: SanityImageSource;
};

export type Post = {
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  excerpt?: string;
  author?: Author;
  featured?: boolean;
};

type Props = {
  post: Post;
};

export default function FeaturedCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <div className="aspect-video overflow-hidden">
        <Image
          src={urlFor(post.mainImage).width(800).height(450).url()}
          alt={post.title}
          width={800}
          height={450}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-gray-600 mt-3 line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
