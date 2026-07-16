@"
import { useState } from 'react'

export default function PurchaseModal({ event, onClose, onPurchase }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', quantity:1, notes:'' })
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('event_id', event.id)
    fd.append('buyer_name', form.name)
    fd.append('buyer_email', form.email)
    fd.append('buyer_phone', form.phone)
    fd.append('quantity', form.quantity)
    fd.append('notes', form.notes)
    if (file) fd.append('receipt', file)

    const res = await fetch('/api/tickets/purchase', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      onPurchase(data.ticket)
    } else {
      alert(data.error || 'Purchase failed')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Purchase Ticket - {event.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Full Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label>Phone *</label><input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label>Number of Tickets</label><input type="number" min="1" max="10" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
            <div className="form-group">
              <label>Upload Payment Receipt (Image/PDF)</label>
              <div className="file-upload-area" onClick={() => document.getElementById('receiptInput').click()}>
                <div style={{fontSize:'2rem'}}>📎</div>
                <p>Click to upload<br/><small>JPG, PNG, PDF (max 5MB)</small></p>
                <input id="receiptInput" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) {
                    if (f.size > 5*1024*1024) { alert('File too large'); return }
                    setFile(f)
                    setFileName(f.name)
                  }
                }} style={{display:'none'}} />
                {fileName && <div style={{marginTop:8, fontWeight:600, color:'#00b894'}}>✅ {fileName}</div>}
              </div>
            </div>
            <div className="form-group"><label>Special Requests (optional)</label><textarea rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            <button type="submit" className="btn-solid" style={{width:'100%',padding:14,borderRadius:24}}>🎫 Get My Ticket</button>
          </form>
        </div>
      </div>
    </div>
  )
}
"@ | Out-File -FilePath components/PurchaseModal.js -Encoding utf8