import { supabase } from '../../../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { event_id, buyer_name, buyer_email, buyer_phone, quantity, notes } = req.body

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single()
  if (eventError || !event) return res.status(404).json({ error: 'Event not found' })

  const ticket_code = 'TCK-' + uuidv4().slice(0, 8).toUpperCase()

  const { data: ticket, error: insertError } = await supabase
    .from('tickets')
    .insert({
      ticket_code,
      event_id,
      buyer_name,
      buyer_email,
      buyer_phone,
      quantity: quantity || 1,
      notes
    })
    .select()
    .single()

  if (insertError) return res.status(500).json({ error: insertError.message })

  const fullTicket = {
    ...ticket,
    event_name: event.name,
    event_venue: event.venue,
    event_date: event.event_date,
    event_time: event.event_time,
    price: event.price,
    color: event.color
  }
  return res.status(200).json({ ticket: fullTicket })
}
