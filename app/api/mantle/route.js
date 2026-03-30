export async function GET() {
  const simulatedData = {
    recentTransactions: [
      { hash: "0xabc...123", type: "Transfer", value: "1.5 MNT", time: "2 mins ago" },
      { hash: "0xdef...456", type: "DeFi Swap", value: "320 USDT", time: "8 mins ago" },
      { hash: "0xghi...789", type: "Liquidity Add", value: "500 MNT", time: "15 mins ago" },
      { hash: "0xjkl...012", type: "Transfer", value: "75 MNT", time: "22 mins ago" },
    ],
    walletActivity: { activeWallets: 12400, change: "+8% today" },
    defiVolume: { total: "$2.1M", change: "+12% today" },
    networkStats: { tps: "142 TPS", blockTime: "2s avg" }
  }
  return Response.json(simulatedData)
}