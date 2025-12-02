import { createClient } from "next-sanity";

// PUBLIC READ CLIENT (frontend)
export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// PRIVATE WRITE CLIENT (server-only)
export const writeClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN!, // safe on server only
  useCdn: false,
});
