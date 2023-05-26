import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 参数：limit, before, after
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || 20
  const before = searchParams.get('before')

  // 查询数据库
  const { rows: psbts } = await sql`
    SELECT id, psbt_raw as "psbtRaw", address, order_state as "orderState", order_type as "orderType", tick, created_at as "createdAt", coin_amount as "coinAmount", coin_decimal as "coinDecimal", coin_rate_price as "coinRatePrice"
    FROM ask_psbt
    ORDER BY id DESC
    LIMIT ${limit};
    `
  // 返回结果
  return new Response(JSON.stringify(psbts))
}

export async function POST(request: Request) {
  const { psbtRaw, address, orderState, orderType, tick } = await request.json()
  // coinAmount在 50到2000之间取随机数
  const coinAmount = Math.floor(Math.random() * (2000 - 50 + 1) + 50)
  const coinDecimal = 18
  // coinRatePrice在 0.0001到0.0005之间取随机数
  const coinRatePrice = Math.random() * (0.0005 - 0.0001) + 0.0001

  // 存入数据库
  await sql`INSERT INTO ask_psbt (psbt_raw, address, order_state, order_type, tick, coin_amount, coin_decimal, coin_rate_price) VALUES (${psbtRaw}, ${address}, ${orderState}, ${orderType}, ${tick}, ${coinAmount}, ${coinDecimal}, ${coinRatePrice})`

  return NextResponse.json({ success: true })
}