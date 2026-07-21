import transporter from '../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  try {
    await transporter.sendMail({
      from: `"DHB Davilas Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #f0ece4; padding: 2.5rem;">
          <div style="border-bottom: 1px solid #2e2e2e; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <h1 style="font-size: 24px; color: #d4af37; margin: 0;">DHB Davilas</h1>
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin: 0.25rem 0 0;">Hair &amp; Beauty</p>
          </div>

          <h2 style="font-size: 20px; color: #f0ece4; margin: 0 0 1rem;">Nouveau message ✦</h2>

          <div style="background: #1a1a1a; border: 1px solid #2e2e2e; border-radius: 4px; padding: 1.25rem; margin: 1.5rem 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 0.5rem 0; color: #888; border-bottom: 1px solid #2e2e2e;">Nom</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right; border-bottom: 1px solid #2e2e2e;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #888; border-bottom: 1px solid #2e2e2e;">Email</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right; border-bottom: 1px solid #2e2e2e;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #888;">Téléphone</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right;">${phone || '—'}</td>
              </tr>
            </table>
          </div>

          <div style="background: #1a1a1a; border: 1px solid #2e2e2e; border-radius: 4px; padding: 1.25rem;">
            <p style="color: #888; font-size: 12px; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
            <p style="color: #f0ece4; font-size: 14px; line-height: 1.7; margin: 0;">${message}</p>
          </div>

          <div style="border-top: 1px solid #2e2e2e; padding-top: 1.5rem; margin-top: 1.5rem;">
            <p style="font-size: 12px; color: #888; margin: 0;">DHB Davilas Hair &amp; Beauty</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}