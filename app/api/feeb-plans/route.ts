export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const network = searchParams.get('network') || 'livenet'

  const url =
    network === 'testnet'
      ? `https://api.unisat.io/testnet/wallet-v4/default/fee-summary`
      : `https://api.unisat.io/wallet-v4/default/fee-summary`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Client': 'UniSat Wallet',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    },
  }).then((res) => {
    return res.json()
  })

  return new Response(JSON.stringify(res), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
