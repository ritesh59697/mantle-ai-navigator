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

  if (loading) {
    return (
      <div className="cyber-bg grid-lines"
        style={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          height:'100vh',
          gap:'24px'
        }}
      >

        <img
          src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png"
          alt="Mantle"
          style={{
            width:'72px',
            height:'72px',
            borderRadius:'50%',
            animation:'pulse-glow 1.5s ease-in-out infinite'
          }}
        />

        <p className="neon-text"
          style={{
            fontSize:'1.2rem',
            letterSpacing:'0.2em'
          }}
        >
          ANALYZING MANTLE NETWORK...
        </p>

        <p
          style={{
            color:'rgba(255,255,255,0.3)',
            fontSize:'0.75rem',
            letterSpacing:'0.15em'
          }}
        >
          FETCHING LIVE BLOCKCHAIN DATA
        </p>

      </div>
    )
  }

  return (
    <div className="cyber-bg grid-lines"
      style={{
        minHeight:'100vh',
        padding:'40px 20px'
      }}
    >

      <div
        style={{
          maxWidth:'1100px',
          margin:'0 auto'
        }}
      >

        {/* Header */}
        <div
          style={{
            textAlign:'center',
            marginBottom:'52px'
          }}
        >

          <div
            style={{
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              gap:'16px',
              marginBottom:'14px',
              flexWrap:'wrap'
            }}
          >

            <img
              src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png"
              alt="Mantle"
              style={{
                width:'52px',
                height:'52px',
                borderRadius:'50%',
                boxShadow:'0 0 24px rgba(34,197,94,0.7)'
              }}
            />

            <h1
              style={{
                fontSize:'clamp(1.8rem, 5vw, 3rem)',
                fontWeight:'bold',
                color:'#22c55e',
                textShadow:'0 0 20px rgba(34,197,94,0.8),0 0 40px rgba(34,197,94,0.4)',
                letterSpacing:'0.04em'
              }}
            >
              Mantle AI Navigator
            </h1>

          </div>

          <p
            style={{
              color:'rgba(255,255,255,0.4)',
              fontSize:'0.8rem',
              letterSpacing:'0.25em',
              textTransform:'uppercase'
            }}
          >
            Block #{data?.blockNumber?.toLocaleString()} · Live Mantle Network Analysis
          </p>

        </div>

        {/* Metrics */}
        <div
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
            gap:'20px',
            marginBottom:'24px'
          }}
        >

          {[
            {
              label:'Active Wallets',
              value:data?.walletActivity?.activeWallets?.toLocaleString(),
              sub:data?.walletActivity?.change
            },
            {
              label:'DeFi Volume',
              value:data?.defiVolume?.total,
              sub:data?.defiVolume?.change
            },
            {
              label:'Network Speed',
              value:data?.networkStats?.tps,
              sub:data?.networkStats?.blockTime
            }
          ].map((m, i) => (

            <div key={i}
              className="metric-card"
              style={{
                padding:'28px 24px',
                textAlign:'center'
              }}
            >

              <p className="metric-label">{m.label}</p>
              <p className="metric-number">{m.value}</p>
              <div className="metric-sub">{m.sub}</div>

            </div>

          ))}

        </div>

        {/* Recent Activity */}
        <div
          className="glass-card"
          style={{
            padding:'28px',
            marginBottom:'24px'
          }}
        >

          <p className="section-title">📡 Recent Mantle Activity</p>

          {data?.recentTransactions?.map((tx: any, i: number) => (

            <div key={i} className="tx-row">

              <span
                style={{
                  color:'#4ade80',
                  fontSize:'0.82rem',
                  fontWeight:'bold'
                }}
              >
                {tx.type}
              </span>

              <span style={{color:'#ffffff',fontSize:'0.82rem'}}>
                {tx.value}
              </span>

              <span
                style={{
                  color:'rgba(255,255,255,0.35)',
                  fontSize:'0.78rem',
                  fontFamily:'monospace'
                }}
              >
                {tx.hash}
              </span>

              <span
                style={{
                  color:'rgba(255,255,255,0.3)',
                  fontSize:'0.75rem',
                  textAlign:'right'
                }}
              >
                {tx.time}
              </span>

            </div>

          ))}

        </div>

        {/* Wallet Analyzer */}
        <div className="glass-card" style={{padding:'28px',marginBottom:'24px'}}>

          <p className="section-title">🔍 Wallet Analyzer</p>

          <p
            style={{
              color:'rgba(255,255,255,0.5)',
              fontSize:'0.82rem',
              marginBottom:'16px',
              letterSpacing:'0.02em'
            }}
          >
            Enter any Mantle wallet address to get instant on-chain analysis
          </p>

          <div
            style={{
              display:'flex',
              gap:'12px',
              marginBottom:'20px',
              flexWrap:'wrap'
            }}
          >

            <input
              type="text"
              placeholder="0x... Enter Mantle wallet address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="cyber-input"
            />

            <button
              onClick={analyzeWallet}
              disabled={walletLoading}
              className="glow-button"
            >
              {walletLoading ? 'ANALYZING...' : 'ANALYZE'}
            </button>

          </div>

          {walletResult && !walletResult.error && (

            <div
              style={{
                background:'rgba(0,0,0,0.4)',
                borderRadius:'12px',
                padding:'20px',
                border:'1px solid rgba(34,197,94,0.15)'
              }}
            >

              <div
                style={{
                  display:'flex',
                  gap:'40px',
                  marginBottom:'16px',
                  flexWrap:'wrap'
                }}
              >

                <div>

                  <p
                    style={{
                      color:'rgba(255,255,255,0.4)',
                      fontSize:'0.7rem',
                      letterSpacing:'0.15em',
                      textTransform:'uppercase',
                      marginBottom:'6px'
                    }}
                  >
                    Balance
                  </p>

                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>

                    <img
                      src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png"
                      style={{
                        width:'18px',
                        height:'18px',
                        borderRadius:'50%'
                      }}
                    />

                    <p
                      style={{
                        color:'#22c55e',
                        fontWeight:'bold',
                        fontSize:'1.1rem',
                        textShadow:'0 0 8px rgba(34,197,94,0.5)'
                      }}
                    >
                      {walletResult.balance}
                    </p>

                  </div>

                </div>

                <div>

                  <p
                    style={{
                      color:'rgba(255,255,255,0.4)',
                      fontSize:'0.7rem',
                      letterSpacing:'0.15em',
                      textTransform:'uppercase',
                      marginBottom:'6px'
                    }}
                  >
                    Total Transactions
                  </p>

                  <p
                    style={{
                      color:'#22c55e',
                      fontWeight:'bold',
                      fontSize:'1.1rem',
                      textShadow:'0 0 8px rgba(34,197,94,0.5)'
                    }}
                  >
                    {walletResult.txCount}
                  </p>

                </div>

              </div>

              <p
                style={{
                  color:'rgba(255,255,255,0.75)',
                  fontSize:'0.85rem',
                  lineHeight:'1.8'
                }}
              >
                {walletResult.analysis}
              </p>

            </div>

          )}

        </div>

        {/* Footer */}
        <div
          style={{
            paddingTop:'24px',
            borderTop:'1px solid rgba(34,197,94,0.1)',
            display:'flex',
            justifyContent:'center'
          }}
        >

          <a
            href="https://x.com/Ritesh5969"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:'flex',
              alignItems:'center',
              gap:'10px',
              textDecoration:'none',
              background:'rgba(34,197,94,0.05)',
              border:'1px solid rgba(34,197,94,0.2)',
              borderRadius:'50px',
              padding:'8px 20px 8px 10px'
            }}
          >

            <img
              src="https://pbs.twimg.com/profile_images/1944572785373728768/Qc4iOnla_400x400.jpg"
              alt="Ritesh"
              style={{
                width:'28px',
                height:'28px',
                borderRadius:'50%'
              }}
            />

            <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.78rem'}}>
              Built by
            </span>

            <span
              style={{
                color:'#22c55e',
                fontSize:'0.78rem',
                fontWeight:'bold'
              }}
            >
              @Ritesh5969
            </span>

          </a>

        </div>

      </div>

    </div>
  )
}