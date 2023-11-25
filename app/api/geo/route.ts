import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(request.geo?.country || 'unknown'), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
