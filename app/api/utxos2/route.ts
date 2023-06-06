export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const network = searchParams.get('network') || 'testnet'

  if (!address) {
    return new Response('address is required', { status: 400 })
  }

  // proxy to unisat.io
  type SimpleUtxo = {
    txid: string
    value: number
    vout: number
  }
  const url =
    network === 'testnet'
      ? `https://mempool.space/testnet/api/address/${address}/utxo`
      : `https://mempool.space/api/address/${address}/utxo`
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
