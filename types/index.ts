import type { PortableTextBlock } from "@portabletext/types";

export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };

  //  Sanity returns objects, not strings
  categories?: {
    _id: string;
    title: string;
    slug?: { current: string };
  }[];

  tags?: string[];

  body?: PortableTextBlock[];
  publishedAt?: string;
  image?: string; // for featuredPostsQuery
};

export type RelatedPost = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: {
    asset?: { url?: string };
  };
};
