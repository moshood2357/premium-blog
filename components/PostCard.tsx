import Image from "next/image";
import { urlFor } from "../sanity/lib/urlFor";

export type Post = {
  title: string;
  slug: { current: string };
  mainImage?: { asset: { _ref?: string; _id?: string; url?: string } };
  excerpt?: string;
  categories?: string[];
};

type Props = { post: Post };

export default function PostCard({ post }: Props) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      <div className="aspect-video overflow-hidden">
        {post.mainImage?.asset?.url ? (
          <Image
            src={urlFor(post.mainImage).width(800).height(450).url()}
            alt={post.title}
            width={800}
            height={450}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 mt-3 line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </div>
  );
}
