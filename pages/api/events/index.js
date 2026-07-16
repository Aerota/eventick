import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ events })
  }
  res.status(405).end()
}
