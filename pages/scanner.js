import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Scanner() {
  const [result, setResult] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [scannerReady, setScannerReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/minified/html5-qrcode.min.js'
      script.onload = () => {
        if (typeof Html5Qrcode !== 'undefined') {
          setScannerReady(true)
          initScanner()
        }
      }
      document.body.appendChild(script)
      return () => { if (script) document.body.removeChild(script) }
    }
  }, [])

  const initScanner = () => {
    try {
      const scanner = new Html5Qrcode("qr-reader")
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decoded) => {
          await handleScan(decoded)
          scanner.stop()
        },
        () => {}
      ).catch(err => {
        document.getElementById('qr-reader').innerHTML = 'Camera access denied. Use manual entry.'
      })
    } catch (e) {
      document.getElementById('qr-reader').innerHTML = 'Camera not available.'
    }
  }

  const handleScan = async (code) => {
    const res = await fetch('/api/admin/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin_token_simulated' },
      body: JSON.stringify({ ticket_code: code })
    })
    const data = await res.json()
    if (data.already_checked) setResult(`⚠️ Already checked in - ${data.ticket_code}`)
    else if (data.message) setResult(`✅ ${data.message} - ${data.ticket_code}`)
    else setResult(`❌ ${data.error || 'Failed'}`)
  }

  const verifyManual = () => {
    if (manualCode.trim()) handleScan(manualCode.trim())
  }

  return (
    <>
      <Head><title>QR Scanner</title></Head>
      <nav className="navbar"><div className="logo">🎟️ EventTick</div><div className="nav-links"><a href="/" className="btn-outline">Events</a><a href="/admin" className="btn-solid">Admin</a></div></nav>
      <div className="container scanner-container">
        <div className="page-header"><h1>📷 Scan QR Code</h1><p>Point your camera at the ticket QR code</p></div>
        <div id="qr-reader" style={{maxWidth:400,margin:'0 auto',borderRadius:16,overflow:'hidden'}}></div>
        {result && <div className={`scan-result ${result.startsWith('✅')?'scan-success':result.startsWith('⚠️')?'scan-already':'scan-error'}`}>{result}</div>}
        <div style={{marginTop:16}}>
          <input type="text" value={manualCode} onChange={e=>setManualCode(e.target.value)} placeholder="Or enter ticket code" style={{width:'100%',padding:12,border:'2px solid #e8ecf1',borderRadius:10,textAlign:'center',fontFamily:'monospace'}} />
          <button className="btn-solid" onClick={verifyManual} style={{width:'100%',marginTop:8,padding:12,borderRadius:20}}>✅ Verify & Mark</button>
        </div>
        <button className="btn-outline" onClick={() => window.location.href='/'} style={{marginTop:16}}>← Back to Events</button>
      </div>
    </>
  )
}
