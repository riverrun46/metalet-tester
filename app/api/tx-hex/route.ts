export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const txId = searchParams.get('id')
  const network = searchParams.get('network') || 'testnet'

  const url =
    network === 'testnet'
      ? `https://mempool.space/testnet/api/tx/${txId}/hex`
      : `https://mempool.space/api/tx/${txId}/hex`
  const txHex: string = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.text())

  return new Response(txHex, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
