export const dynamic = 'force-dynamic'

import { DOMAIN } from '@/app/data/constants'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const runename = searchParams.get('runename')

  const sp = new URLSearchParams()
  sp.append('limit', '5')
  if (runename) {
    sp.append('runename', runename)
  }
  const url = `${DOMAIN}/runes/info-list?${sp.toString()}`
  const res: any = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Client': 'UniSat Wallet',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      Authorization: 'Bearer 9e73bfef04b578ac0d7a95f3bdde48c409a68486e32ceb7afb756657a12fb3a5',
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
