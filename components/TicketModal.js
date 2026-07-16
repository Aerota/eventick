import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function TicketModal({ ticket, onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && ticket.ticket_code) {
      QRCode.toCanvas(canvasRef.current, ticket.ticket_code, { width: 140 })
    }
  }, [ticket])

  const eventColor = ticket.color || '#6C5CE7'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:550}} onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2>🎉 Your Ticket</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="ticket-wrapper">
            <div className="ticket">
              <div className="ticket-header" style={{background:`linear-gradient(135deg, ${eventColor}, ${adjustColor(eventColor,-40)})`}}>
                <div className="event-name">{ticket.event_name}</div>
                <div style={{position:'relative',zIndex:3}}>{new Date(ticket.event_date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} at {ticket.event_time}</div>
              </div>
              <div className="ticket-body">
                <div className="ticket-info">
                  <div className="info-row"><div className="info-label">Venue</div><div className="info-value">{ticket.event_venue}</div></div>
                  <div className="info-row"><div className="info-label">Holder</div><div className="info-value">{ticket.buyer_name}</div></div>
                  <div className="info-row"><div className="info-label">Email</div><div className="info-value">{ticket.buyer_email}</div></div>
                  <div className="info-row"><div className="info-label">Quantity</div><div className="info-value">{ticket.quantity}</div></div>
                  <div className="info-row"><div className="info-label">Price</div><div className="info-value">{ticket.price ? '$'+ticket.price : 'Free'}</div></div>
                </div>
                <div className="ticket-qr"><canvas ref={canvasRef}></canvas></div>
              </div>
              <div className="ticket-footer">
                <span style={{fontFamily:'monospace'}}>#{ticket.ticket_code}</span>
                <span className="status-active">✓ Active</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:'0 24px 20px',textAlign:'center'}}>
          <button className="btn-solid" onClick={window.print}>🖨️ Print</button>
          <button className="btn-outline" onClick={onClose} style={{marginLeft:8}}>Close</button>
        </div>
      </div>
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
