import { createClient } from "next-sanity";

// Public read client – safe for frontend
export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-11-15",
  useCdn: false,
});

// Server-only write client – ONLY use in API routes
export const writeClient = process.env.SANITY_WRITE_TOKEN
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,   // FIXED
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,       // FIXED
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-11-15",
      token: process.env.SANITY_WRITE_TOKEN!,
      useCdn: false,
    })
  : null;
