@"
import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  const auth = req.headers.authorization
  if (auth !== 'Bearer admin_token_simulated') return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, tickets(count)')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    const formatted = events.map(ev => ({ ...ev, ticket_count: ev.tickets[0]?.count || 0 }))
    return res.json({ events: formatted })
  }

  if (req.method === 'POST') {
    const { name, event_date, event_time, venue, price, description, max_tickets, color } = req.body
    const { data, error } = await supabase
      .from('events')
      .insert({ name, event_date, event_time, venue, price, description, max_tickets, color })
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ event: data })
  }

  res.status(405).end()
}
"@ | Out-File -FilePath pages/api/admin/events.js -Encoding utf8