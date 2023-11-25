import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

export async function GET(request: Request) {
  const geo = geolocation(request)

  return new Response(JSON.stringify(geo.country || 'unknown'), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
