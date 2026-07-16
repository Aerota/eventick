@"
import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  const auth = req.headers.authorization
  if (auth !== 'Bearer admin_token_simulated') return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const { ticket_code } = req.body
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_code', ticket_code)
      .single()

    if (error || !ticket) return res.status(404).json({ error: 'Ticket not found' })
    if (ticket.checked_in) {
      return res.json({ already_checked: true, message: 'Already checked in', ticket_code: ticket.ticket_code, buyer_name: ticket.buyer_name, checked_in_at: ticket.checked_in_at })
    }

    const { error: updateError } = await supabase
      .from('tickets')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', ticket.id)
    if (updateError) return res.status(500).json({ error: updateError.message })

    const { data: event } = await supabase.from('events').select('name').eq('id', ticket.event_id).single()
    return res.json({ message: 'Attendance marked!', ticket_code: ticket.ticket_code, buyer_name: ticket.buyer_name, event_name: event?.name || 'Event' })
  }
  res.status(405).end()
}
"@ | Out-File -FilePath pages/api/admin/attendance.js -Encoding utf8