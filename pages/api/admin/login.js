export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body
  if (username === 'admin' && password === 'admin123') {
    return res.status(200).json({ token: 'admin_token_simulated' })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}
