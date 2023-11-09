export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const network = searchParams.get('network') || 'livenet'

  if (!address) {
    return new Response('address is required', { status: 400 })
  }

  const url =
    network === 'testnet'
      ? `https://mempool.space/testnet/api/address/${address}/txs`
      : `https://mempool.space/api/address/${address}/txs`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

  return new Response(JSON.stringify(res), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
