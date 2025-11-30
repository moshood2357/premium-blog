// app/api/secret/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Access runtime env variable
  const secret = process.env.SECRET_KEY;

  return NextResponse.json({ secret });
}
