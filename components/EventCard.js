@"
export default function EventCard({ event, onBuy }) {
  const dateStr = new Date(event.event_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
  return (
    <div className="event-card">
      <div className="card-banner" style={{background: `linear-gradient(135deg, ${event.color || '#6C5CE7'}, ${adjustColor(event.color||'#6C5CE7', -30)})`}}>
        <span style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.95)',color:'#2d3436',padding:'8px 14px',borderRadius:20,fontWeight:700,fontSize:'0.85rem'}}>📅 {dateStr}</span>
        <div className="banner-content"><h2 style={{color:'#fff'}}>{event.name}</h2></div>
      </div>
      <div className="card-body">
        <h3>{event.name}</h3>
        <div className="event-meta"><span>📍 {event.venue || 'TBA'}</span><span>🕐 {event.event_time || 'TBA'}</span></div>
        <div className="price-tag">{event.price > 0 ? '$'+parseFloat(event.price).toFixed(2) : 'Free'}</div>
      </div>
      <div className="card-footer"><button className="btn-solid" onClick={onBuy}>🎫 Buy Ticket</button></div>
    </div>
  )
}

function adjustColor(hex, amt) {
  let num = parseInt(hex.slice(1),16)
  let r = Math.min(255,Math.max(0,(num>>16)+amt))
  let g = Math.min(255,Math.max(0,((num>>8)&0x00FF00)+amt))
  let b = Math.min(255,Math.max(0,(num&0x0000FF)+amt))
  return `rgb(${r},${g},${b})`
}
"@ | Out-File -FilePath components/EventCard.js -Encoding utf8