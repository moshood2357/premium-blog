// import { client } from "@/sanity/lib/client";
import { featuredPostsQuery } from "@/sanity/lib/queries";
import FeaturedCard, { Post } from "@/components/FeaturedCard";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/sanityClient";


export default async function Home() {
  const featured: Post[] = await client.fetch(featuredPostsQuery);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900 to-blue-950 opacity-90"></div>

        <Image
          src="/banner.jpg"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Background"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Discover Insightful Stories & Expert Knowledge
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Stay informed with deep dives, tutorials, and trending
            updates—crafted for curious minds.
          </p>

          <Link
            href="/blog"
            className="mt-8 inline-block px-8 py-3 text-lg rounded-full bg-white text-blue-900 font-semibold hover:bg-gray-100 duration-300 transition-all transform hover:scale-105"
          >
            Explore Blog →
          </Link>
        </div>
      </section>

      {/* FEATURED POSTS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10">Featured Posts</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((post) => (
            <FeaturedCard key={post.slug.current} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
