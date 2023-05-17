import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 参数：limit, before, after
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || 20
  const before = searchParams.get('before')

  // 查询数据库
  const { rows: psbts } = await sql`
    SELECT id, tx_hex as "txHex", created_at as "createdAt"
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
  await sql`INSERT INTO psbt (tx_hex) VALUES (${txHex})`

  return NextResponse.json({ success: true })
}
