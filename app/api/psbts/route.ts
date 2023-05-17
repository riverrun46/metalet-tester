import { sql } from '@vercel/postgres'

export async function GET(request: Request) {
  // 参数：limit, before, after
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || 20
  const before = searchParams.get('before')

  // 查询数据库
  const { rows: psbts } = await sql`
    SELECT *
    FROM Psbt
    ORDER BY id DESC
    LIMIT ${limit};
    `
  // 返回结果
  return new Response(JSON.stringify(psbts))
}

export async function POST(request: Request) {
  const { txHex } = await request.json()

  // 存入数据库
  await sql`INSERT INTO Psbt (txHex) VALUES (${txHex})`

  return new Response('success')
}
