import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  const auth = req.headers.authorization
  if (auth !== 'Bearer admin_token_simulated') return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, events(name)')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ tickets })
  }
  res.status(405).end()
}
