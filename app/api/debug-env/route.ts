
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    tokenExists: !!process.env.SANITY_WRITE_TOKEN,
    token: process.env.SANITY_WRITE_TOKEN ? "LOADED" : "NOT FOUND",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    hasWriteToken: !!process.env.SANITY_WRITE_TOKEN,
  });
}
