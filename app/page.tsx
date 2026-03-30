'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [wallet, setWallet] = useState<string>('')
  const [walletResult, setWalletResult] = useState<any>(null)
  const [walletLoading, setWalletLoading] = useState<boolean>(false)

  useEffect(() => {
    async function loadDashboard() {
      const dataRes = await fetch('/api/mantle-data')
      const mantleData = await dataRes.json()
      setData(mantleData)

      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mantleData })
      })
      const aiData = await aiRes.json()
      setAnalysis(aiData)
      setLoading(false)
    }
    loadDashboard()
  }, [])

  async function analyzeWallet() {
    if (!wallet) return
    setWalletLoading(true)
    setWalletResult(null)
    const res = await fetch('/api/wallet-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: wallet })
    })
    const result = await res.json()
    setWalletResult(result)
    setWalletLoading(false)
  }

  const severityColor: any = { high: '#ff4444', medium: '#ffaa00', low: '#00ff88' }

 if (loading) return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0a0a0a',fontFamily:'monospace',gap:'20px'}}>
      <img 
        src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png" 
        alt="Mantle"
        style={{width:'64px',height:'64px',borderRadius:'50%',animation:'pulse 1.5s ease-in-out infinite'}}
      />
      <p style={{color:'#00ff88',fontSize:'1.2rem',margin:'0'}}>Analyzing Mantle Network...</p>
      <p style={{color:'#333',fontSize:'0.8rem',margin:'0'}}>Fetching live blockchain data</p>
    </div>
  )

  return (
    <div style={{maxWidth:'960px',margin:'0 auto',padding:'40px 20px',fontFamily:'monospace',background:'#0a0a0a',minHeight:'100vh',color:'#fff'}}>

      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'4px'}}>
  <img 
    src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png"
    alt="Mantle" 
    style={{width:'40px',height:'40px',borderRadius:'50%'}}
  />
  <h1 style={{fontSize:'2rem',color:'#00ff88',margin:'0'}}>Mantle AI Navigator</h1>
</div>
      <p style={{color:'#444',marginBottom:'40px',fontSize:'0.85rem'}}>
        Block #{data?.blockNumber?.toLocaleString()} · Live Mantle Network Analysis
      </p>

      {/* Metrics */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        {[
          { label:'Active Wallets', value:data?.walletActivity?.activeWallets?.toLocaleString(), sub:data?.walletActivity?.change },
          { label:'DeFi Volume', value:data?.defiVolume?.total, sub:data?.defiVolume?.change },
          { label:'Network Speed', value:data?.networkStats?.tps, sub:data?.networkStats?.blockTime }
        ].map((m, i) => (
          <div key={i} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'20px'}}>
            <p style={{color:'#555',fontSize:'0.8rem',marginBottom:'8px'}}>{m.label}</p>
            <p style={{fontSize:'1.6rem',fontWeight:'bold',color:'#00ff88',margin:'4px 0'}}>{m.value}</p>
           <p style={{color:'#4ade80',background:'#052e16',padding:'2px 8px',borderRadius:'4px',fontSize:'0.75rem',display:'inline-block'}}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'0.95rem',marginBottom:'16px'}}>📡 Recent Mantle Activity</h2>
        {data?.recentTransactions?.map((tx: any, i: number) => (
        <div key={i} style={{display:'grid',gridTemplateColumns:'140px 180px 1fr 80px',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #1a1a1a',gap:'8px'}}>
  <span style={{color:'#00ff88',fontSize:'0.85rem'}}>{tx.type}</span>
  <span style={{color:'#fff',fontSize:'0.85rem'}}>{tx.value}</span>
  <span style={{color:'#333',fontSize:'0.8rem'}}>{tx.hash}</span>
  <span style={{color:'#444',fontSize:'0.8rem',textAlign:'right'}}>{tx.time}</span>
</div>
        ))}
      </div>

      {/* AI Alpha Signals */}
      <div style={{background:'#0d1f17',border:'1px solid #00ff8822',borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'0.95rem',marginBottom:'16px'}}>🤖 AI Alpha Signals</h2>
        <p style={{color:'#888',fontSize:'0.9rem',marginBottom:'20px',lineHeight:'1.7'}}>{analysis?.summary}</p>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {analysis?.signals?.map((signal: any, i: number) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',background:'#111',borderRadius:'8px',padding:'12px'}}>
              <span style={{color:severityColor[signal.severity]||'#00ff88',fontSize:'0.75rem',fontWeight:'bold',minWidth:'50px',marginTop:'2px'}}>
                {signal.severity?.toUpperCase()}
              </span>
              <div>
                <span style={{color:'#00ff88',fontSize:'0.8rem'}}>[{signal.type}] </span>
                <span style={{color:'#ccc',fontSize:'0.9rem'}}>{signal.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Analyzer */}
      <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'0.95rem',marginBottom:'16px'}}>🔍 Wallet Analyzer</h2>
        <div style={{display:'flex',gap:'12px',marginBottom:'20px'}}>
          <input
            type="text"
            placeholder="Enter Mantle wallet address (0x...)"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            style={{flex:1,background:'#0a0a0a',border:'1px solid #222',borderRadius:'8px',padding:'12px',color:'#fff',fontFamily:'monospace',fontSize:'0.85rem'}}
          />
          <button
            onClick={analyzeWallet}
            disabled={walletLoading}
            style={{background:'#00ff88',color:'#000',border:'none',borderRadius:'8px',padding:'12px 20px',fontFamily:'monospace',fontWeight:'bold',cursor:'pointer',fontSize:'0.85rem'}}
          >
            {walletLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {walletResult && !walletResult.error && (
          <div style={{background:'#0a0a0a',borderRadius:'8px',padding:'16px'}}>
            <div style={{display:'flex',gap:'24px',marginBottom:'16px',flexWrap:'wrap'}}>
              <div>
                <p style={{color:'#555',fontSize:'0.75rem'}}>Balance</p>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
  <img 
    src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png"
    style={{width:'16px',height:'16px',borderRadius:'50%'}}
  />
  <p style={{color:'#00ff88',fontWeight:'bold',margin:'0'}}>{walletResult.balance}</p>
</div>
              </div>
              <div>
                <p style={{color:'#555',fontSize:'0.75rem'}}>Total Transactions</p>
                <p style={{color:'#00ff88',fontWeight:'bold'}}>{walletResult.txCount}</p>
              </div>
            </div>
            <p style={{color:'#aaa',lineHeight:'1.8',fontSize:'0.9rem'}}>{walletResult.analysis}</p>
          </div>
        )}
        {walletResult?.error && (
          <p style={{color:'#ff4444'}}>Error: {walletResult.error}</p>
        )}
      </div> {/* Footer */}
<div style={{marginTop:'40px',paddingTop:'24px',borderTop:'1px solid #1a1a1a',display:'flex',justifyContent:'center',alignItems:'center'}}>
  <a 
    href="https://x.com/Ritesh5969" 
    target="_blank"
    rel="noopener noreferrer"
    style={{display:'flex',alignItems:'center',gap:'10px',textDecoration:'none',background:'#111',border:'1px solid #1a1a1a',borderRadius:'50px',padding:'8px 16px 8px 8px'}}
  >
    <img 
      src="https://pbs.twimg.com/profile_images/1944572785373728768/Qc4iOnla_400x400.jpg"
      alt="Ritesh"
      style={{width:'22px',height:'22px',borderRadius:'50%',border:'1px solid #00ff88'}}
    />
    <span style={{color:'#888',fontSize:'0.75rem'}}>Built by </span>
    <span style={{color:'#00ff88',fontSize:'0.75rem',fontWeight:'bold'}}>@Ritesh5969</span>
  </a>
</div>

    </div>
  )
}