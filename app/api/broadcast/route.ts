export async function POST(request: Request) {
  const requestJson = await request.json()
  const rawTx = requestJson.rawTx
  const network = requestJson.network || 'testnet'

  if (!rawTx) {
    return new Response('rawTx is required', { status: 400 })
  }

  const url = network === 'testnet' ? `https://mempool.space/testnet/api/tx` : `https://mempool.space/api/tx`
  const res: any = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'plain/text',
    },
    body: rawTx,
  }).then((res) => res)

  if (res.status === 400) {
    return new Response(await res.text(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 400,
    })
  }

  return new Response(JSON.stringify(res), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
