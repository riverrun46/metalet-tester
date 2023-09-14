export async function GET(request: Request) {
  // 8561c3fb-5d1d-4981-a0cf-02d4fc4cf286
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CMC_PRO_API_KEY': '8561c3fb-5d1d-4981-a0cf-02d4fc4cf286',
    },
  })
    .then((res) => res.json())
    .then((res) => res.data[0].quote.USD.price)
    .then((price) => Math.round(price))

  return new Response(JSON.stringify(res), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    status: 200,
  })
}
