export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const network = searchParams.get('network') || 'testnet'

  const url =
    network === 'testnet'
      ? `https://unisat.io/testnet/wallet-api-v4/default/fee-summary`
      : `https://unisat.io/wallet-api-v4/default/fee-summary`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Client': 'UniSat Wallet',
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
