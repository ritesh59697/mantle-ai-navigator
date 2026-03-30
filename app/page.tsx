'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const dataRes = await fetch('/api/mantle')
      const mantleData = await dataRes.json()
      setData(mantleData)
      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mantleData })
      })
      const aiData = await aiRes.json()
      setAnalysis(aiData.analysis)
      setLoading(false)
    }
    loadDashboard()
  }, [])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0a0a0a',color:'#00ff88',fontSize:'1.2rem',fontFamily:'monospace'}}>
      ⬡ Analyzing Mantle Network...
    </div>
  )

  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'40px 20px',fontFamily:'monospace',background:'#0a0a0a',minHeight:'100vh',color:'#fff'}}>
      <h1 style={{fontSize:'2rem',color:'#00ff88',marginBottom:'8px'}}>⬡ Mantle AI Navigator</h1>
      <p style={{color:'#666',marginBottom:'40px'}}>Real-time AI analysis of Mantle Network activity</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'20px'}}>
          <p style={{color:'#666',fontSize:'0.85rem'}}>Active Wallets</p>
          <p style={{fontSize:'1.8rem',fontWeight:'bold',color:'#00ff88'}}>{data.walletActivity.activeWallets.toLocaleString()}</p>
          <p style={{color:'#00ff88',fontSize:'0.85rem'}}>{data.walletActivity.change}</p>
        </div>
        <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'20px'}}>
          <p style={{color:'#666',fontSize:'0.85rem'}}>DeFi Volume</p>
          <p style={{fontSize:'1.8rem',fontWeight:'bold',color:'#00ff88'}}>{data.defiVolume.total}</p>
          <p style={{color:'#00ff88',fontSize:'0.85rem'}}>{data.defiVolume.change}</p>
        </div>
        <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'20px'}}>
          <p style={{color:'#666',fontSize:'0.85rem'}}>Network Speed</p>
          <p style={{fontSize:'1.8rem',fontWeight:'bold',color:'#00ff88'}}>{data.networkStats.tps}</p>
          <p style={{color:'#00ff88',fontSize:'0.85rem'}}>{data.networkStats.blockTime}</p>
        </div>
      </div>

      <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'24px',marginBottom:'20px'}}>
        <h2 style={{color:'#fff',fontSize:'1rem',marginBottom:'20px'}}>Recent Mantle Activity</h2>
        {data.recentTransactions.map((tx, i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #1a1a1a'}}>
            <span style={{color:'#00ff88'}}>{tx.type}</span>
            <span>{tx.value}</span>
            <span style={{color:'#444',fontSize:'0.8rem'}}>{tx.hash}</span>
            <span style={{color:'#555',fontSize:'0.8rem'}}>{tx.time}</span>
          </div>
        ))}
      </div>

      <div style={{background:'#0d1f17',border:'1px solid #00ff8833',borderRadius:'12px',padding:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'1rem',marginBottom:'16px'}}>🤖 AI Analysis</h2>
        <p style={{color:'#aaa',lineHeight:'1.9',whiteSpace:'pre-wrap'}}>{analysis}</p>
      </div>
    </div>
  )
}