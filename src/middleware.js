import { NextResponse } from 'next/server';

export function middleware(req) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', 'https://praxaurus.vercel.app'); // Replace with your frontend domain
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: response.headers });
  }

  return response;
}