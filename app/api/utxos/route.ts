export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
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
  const url = `https://unisat.io/testnet/wallet-api-v4/address/btc-utxo?address=${address}`
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
