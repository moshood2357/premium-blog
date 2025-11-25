export const allPostsQuery = `
  *[_type == "post"]{
    title,
    slug { current },
    excerpt,
    featured,
    publishedAt,
    mainImage{
      asset->{_id, url}
    },
    categories,
    tags
  }
`;



export const singlePostQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug { current },
  excerpt,
  featured,
  publishedAt,
  mainImage{
    asset->{ _id, url }
  },
  categories,
  tags,
  body
}`;



export const featuredPostsQuery = `
  *[_type == "post" && featured == true] | order(publishedAt desc){
    title,
    slug { current },
    excerpt,
    mainImage{
      asset->{ _id, url }
    },
    featured,
    publishedAt
  }
`;

export const relatedPostsQuery = `
  *[_type == "post" && slug.current != $slug && count(categories[@ in $categories]) > 0] | order(publishedAt desc)[0...3]{
    title,
    slug { current },
    excerpt,
    mainImage { asset->{_id, url} },
  }
`;


// export const allCategoriesQuery = `
//   *[_type == "category"]{
//     title,
//     description,
//     slug
//   }
// `;
