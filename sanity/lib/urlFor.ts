import imageUrlBuilder from "@sanity/image-url";
import { readClient as client } from "./client";

const builder = imageUrlBuilder(client);

type SanityImageSource = {
  _type?: "image";
  asset: {
    _ref?: string;
    _id?: string;
  };
};

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
