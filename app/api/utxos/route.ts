export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const network = searchParams.get('network') || 'livenet'

  if (!address) {
    return new Response('address is required', { status: 400 })
  }

  // proxy to unisat.io
  type SimpleUtxo = {
    txId: string
    scriptPk: string
    satoshis: number
    outputIndex: number
    addressType: number
  }
  const url =
    network === 'testnet'
      ? `https://api.unisat.io/testnet/wallet-v4/address/btc-utxo?address=${address}`
      : `https://api.unisat.io/wallet-v4/address/btc-utxo?address=${address}`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Client': 'UniSat Wallet',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
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
