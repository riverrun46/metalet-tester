export const dynamic = 'force-dynamic'

import { type RunestoneSpec, encodeRunestone } from '@/runestone'

export async function POST(request: Request) {
  const requestJson = await request.json()
  const runestoneSpec = requestJson.runestoneSpec as RunestoneSpec

  if (!runestoneSpec) {
    return new Response('runestoneSpec is required', { status: 400 })
  }

  const { encodedRunestone } = encodeRunestone(runestoneSpec)
  const script = encodedRunestone.toString('hex')

  return new Response(JSON.stringify({ script }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
