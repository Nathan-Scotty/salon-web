import fs from 'fs';
import path from 'path';

const SUBS_FILE = path.join(process.cwd(), 'push-subscriptions.json');

function loadSubs() {
  try {
    if (fs.existsSync(SUBS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

function saveSubs(subs) {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    const subs = loadSubs();
    const exists = subs.find(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      subs.push(subscription);
      saveSubs(subs);
    }
    return res.status(201).json({ message: 'Subscribed' });
  }

  if (req.method === 'DELETE') {
    const { endpoint } = req.body;
    const subs = loadSubs().filter(s => s.endpoint !== endpoint);
    saveSubs(subs);
    return res.json({ message: 'Unsubscribed' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
