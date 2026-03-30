import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  const { address } = await request.json()

  if (!address) {
    return Response.json({ error: 'No address provided' }, { status: 400 })
  }

  try {
    const rpc = 'https://rpc.mantle.xyz'

    const txCountRes = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc:'2.0', method:'eth_getTransactionCount', params:[address, 'latest'], id:1 })
    })
    const txCountData = await txCountRes.json()
    const txCount = parseInt(txCountData.result, 16)

    const balanceRes = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc:'2.0', method:'eth_getBalance', params:[address, 'latest'], id:2 })
    })
    const balanceData = await balanceRes.json()
    const rawBalance = parseInt(balanceData.result, 16) / 1e18
    const balance = rawBalance.toFixed(4)

    // Simple status — no AI words
    let status = ''
    if (rawBalance === 0 && txCount === 0) {
      status = 'Empty wallet — no balance and no activity found.'
    } else if (rawBalance === 0) {
      status = 'No MNT balance. Wallet has made ' + txCount + ' transactions.'
    } else if (txCount === 0) {
      status = 'Has balance but no transactions yet.'
    } else {
      status = 'Active wallet with ' + txCount + ' transactions on Mantle.'
    }

    return Response.json({
      address,
      balance: balance + ' MNT',
      txCount,
      analysis: status
    })
  } catch {
    return Response.json({ error: 'Could not fetch wallet data' }, { status: 500 })
  }
}