@"
import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  const auth = req.headers.authorization
  if (auth !== 'Bearer admin_token_simulated') return res.status(401).json({ error: 'Unauthorized' })

  const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: totalTickets } = await supabase.from('tickets').select('*', { count: 'exact', head: true })
  const { count: checkedIn } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('checked_in', true)

  const { data: recent } = await supabase
    .from('tickets')
    .select('*, events!inner(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  res.json({
    totalEvents: totalEvents || 0,
    totalTickets: totalTickets || 0,
    checkedIn: checkedIn || 0,
    pendingCheckIn: (totalTickets || 0) - (checkedIn || 0),
    recentTickets: recent || []
  })
}
"@ | Out-File -FilePath pages/api/admin/dashboard.js -Encoding utf8