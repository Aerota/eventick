import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('adminToken')
    if (saved) setToken(saved)
  }, [])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    const headers = { 'Authorization': `Bearer ${token}` }
    let url = ''
    if (tab === 'dashboard') url = '/api/admin/dashboard'
    else if (tab === 'events') url = '/api/admin/events'
    else if (tab === 'tickets') url = '/api/admin/tickets'

    if (url) {
      fetch(url, { headers })
        .then(res => res.json())
        .then(res => { setData(res); setLoading(false) })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token, tab])

  const login = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const d = await res.json()
    if (d.token) {
      localStorage.setItem('adminToken', d.token)
      setToken(d.token)
    } else {
      alert('Invalid credentials')
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setTab('dashboard')
    setData({})
  }

  if (!token) {
    return (
      <>
        <Head><title>Admin Login</title></Head>
        <nav className="navbar"><div className="logo">🎟️ EventTick</div><div className="nav-links"><a href="/" className="btn-outline">Events</a></div></nav>
        <div style={{maxWidth:400,margin:'40px auto',padding:20}}>
          <h1 style={{textAlign:'center'}}>🔐 Admin Login</h1>
          <form onSubmit={login} style={{background:'#fff',padding:24,borderRadius:16,boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
            <div className="form-group"><label>Username</label><input type="text" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            <button type="submit" className="btn-solid" style={{width:'100%',padding:14}}>Login</button>
          </form>
          <p style={{textAlign:'center',fontSize:'0.8rem',color:'#999',marginTop:12}}>Default: admin / admin123</p>
        </div>
      </>
    )
  }

  // Admin Dashboard Content
  return (
    <>
      <Head><title>Admin Panel</title></Head>
      <nav className="navbar">
        <div className="logo">🎟️ EventTick</div>
        <div className="nav-links">
          <a href="/" className="btn-outline">Events</a>
          <a href="/admin" className="btn-solid">Dashboard</a>
          <a href="/scanner" className="btn-outline">📷 Scanner</a>
          <button onClick={logout} className="btn-accent">Logout</button>
        </div>
      </nav>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav>
            <a className={tab==='dashboard'?'active':''} onClick={()=>setTab('dashboard')}>📊 Dashboard</a>
            <a className={tab==='events'?'active':''} onClick={()=>setTab('events')}>📅 Events</a>
            <a className={tab==='tickets'?'active':''} onClick={()=>setTab('tickets')}>🎫 All Tickets</a>
            <a className={tab==='addEvent'?'active':''} onClick={()=>setTab('addEvent')}>➕ Add Event</a>
          </nav>
        </aside>
        <main className="admin-content">
          {loading && <p>Loading...</p>}
          {!loading && tab==='dashboard' && data && (
            <>
              <h2>📊 Dashboard</h2>
              <div className="stats-row">
                <div className="stat-card"><div className="stat-value">{data.totalEvents}</div><div className="stat-label">Events</div></div>
                <div className="stat-card" style={{borderLeftColor:'#00b894'}}><div className="stat-value">{data.totalTickets}</div><div className="stat-label">Tickets Sold</div></div>
                <div className="stat-card" style={{borderLeftColor:'#f39c12'}}><div className="stat-value">{data.checkedIn}</div><div className="stat-label">Checked In</div></div>
                <div className="stat-card" style={{borderLeftColor:'#e17055'}}><div className="stat-value">{data.pendingCheckIn}</div><div className="stat-label">Pending</div></div>
              </div>
              <h3>Recent Tickets</h3>
              <div className="table-container">
                <table>
                  <thead><tr><th>Code</th><th>Buyer</th><th>Event</th><th>Status</th></tr></thead>
                  <tbody>
                    {(data.recentTickets||[]).map(t => (
                      <tr key={t.id}>
                        <td>#{t.ticket_code}</td>
                        <td>{t.buyer_name}</td>
                        <td>{t.events?.name}</td>
                        <td><span className={`badge ${t.checked_in?'badge-success':'badge-pending'}`}>{t.checked_in?'Checked In':'Pending'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {!loading && tab==='events' && data.events && (
            <>
              <h2>📅 Manage Events</h2>
              <button className="btn-solid" onClick={()=>setTab('addEvent')} style={{marginBottom:16}}>➕ Add Event</button>
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Date</th><th>Venue</th><th>Price</th><th>Sold</th></tr></thead>
                  <tbody>
                    {data.events.map(ev => (
                      <tr key={ev.id}>
                        <td><strong>{ev.name}</strong></td>
                        <td>{new Date(ev.event_date).toLocaleDateString()}</td>
                        <td>{ev.venue}</td>
                        <td>${parseFloat(ev.price).toFixed(2)}</td>
                        <td>{ev.ticket_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {!loading && tab==='tickets' && data.tickets && (
            <>
              <h2>🎫 All Tickets</h2>
              <div className="table-container">
                <table>
                  <thead><tr><th>Code</th><th>Buyer</th><th>Event</th><th>Status</th></tr></thead>
                  <tbody>
                    {data.tickets.map(t => (
                      <tr key={t.id}>
                        <td>#{t.ticket_code}</td>
                        <td>{t.buyer_name}</td>
                        <td>{t.events?.name}</td>
                        <td><span className={`badge ${t.checked_in?'badge-success':'badge-pending'}`}>{t.checked_in?'Checked In':'Pending'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tab==='addEvent' && (
            <AddEventForm onDone={() => setTab('events')} token={token} />
          )}
        </main>
      </div>
    </>
  )
}

function AddEventForm({ onDone, token }) {
  const [form, setForm] = useState({ name:'', event_date:'', event_time:'18:00', venue:'', price:'0', description:'', max_tickets:'0', color:'#6C5CE7' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({...form, price: parseFloat(form.price), max_tickets: parseInt(form.max_tickets)})
    })
    if (res.ok) {
      onDone()
    } else {
      const err = await res.json()
      alert(err.error)
    }
  }

  return (
    <>
      <h2>➕ Add New Event</h2>
      <form onSubmit={handleSubmit} style={{maxWidth:600,background:'#fff',padding:24,borderRadius:16,boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>
        <div className="form-group"><label>Event Name *</label><input type="text" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div>
        <div className="form-group"><label>Date *</label><input type="date" required value={form.event_date} onChange={e=>setForm({...form, event_date:e.target.value})} /></div>
        <div className="form-group"><label>Time</label><input type="time" value={form.event_time} onChange={e=>setForm({...form, event_time:e.target.value})} /></div>
        <div className="form-group"><label>Venue *</label><input type="text" required value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} /></div>
        <div className="form-group"><label>Price ($) *</label><input type="number" step="0.01" min="0" required value={form.price} onChange={e=>setForm({...form, price:e.target.value})} /></div>
        <div className="form-group"><label>Description</label><textarea rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div>
        <div className="form-group"><label>Max Tickets (0 = unlimited)</label><input type="number" min="0" value={form.max_tickets} onChange={e=>setForm({...form, max_tickets:e.target.value})} /></div>
        <div className="form-group">
          <label>Color Theme</label>
          <div className="color-options">
            {['#6C5CE7','#FF6B6B','#00b894','#fdcb6e','#0984e3'].map(c => (
              <div key={c} className={`color-option ${form.color===c?'selected':''}`} style={{background:c}} onClick={()=>setForm({...form, color:c})}></div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-solid" style={{width:'100%',padding:14,borderRadius:24}}>✅ Create Event</button>
      </form>
    </>
  )
}
