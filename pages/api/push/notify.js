import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const SUBS_FILE = path.join(process.cwd(), 'push-subscriptions.json');

function loadSubs() {
  try {
    if (fs.existsSync(SUBS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, body, url } = req.body;
  const subs = loadSubs();

  if (subs.length === 0) {
    return res.status(200).json({ message: 'No subscribers' });
  }

  const payload = JSON.stringify({ title, body, url: url || '/admin' });

  const results = await Promise.allSettled(
    subs.map(sub => webpush.sendNotification(sub, payload))
  );

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.error('Failed push notifications:', failed.length);
  }

  return res.status(200).json({ sent: subs.length - failed.length, failed: failed.length });
}
