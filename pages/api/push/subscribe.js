export default async function handler(req, res) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (req.method === 'POST') {
    try {
      const r = await fetch(`${BASE_URL}/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const r = await fetch(`${BASE_URL}/push/subscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
