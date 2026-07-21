import transporter from '../../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, clientEmail, stylistName, serviceName, date, time } = req.body;

  if (!clientEmail || !clientName) {
    return res.status(400).json({ error: 'clientEmail and clientName are required' });
  }

  try {
    await transporter.sendMail({
      from: `"DHB Davilas" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: 'Your Appointment is Booked — DHB Davilas',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #f0ece4; padding: 2.5rem;">
          <div style="border-bottom: 1px solid #2e2e2e; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <h1 style="font-size: 24px; color: #d4af37; margin: 0;">DHB Davilas</h1>
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin: 0.25rem 0 0;">Hair &amp; Beauty</p>
          </div>

          <h2 style="font-size: 20px; color: #f0ece4; margin: 0 0 1rem;">Appointment Booked ✦</h2>

          <p style="color: #888; font-size: 15px; line-height: 1.6;">
            Hi <strong style="color: #f0ece4;">${clientName}</strong>, your appointment has been booked successfully. Here are your details:
          </p>

          <div style="background: #1a1a1a; border: 1px solid #2e2e2e; border-radius: 4px; padding: 1.25rem; margin: 1.5rem 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 0.5rem 0; color: #888; border-bottom: 1px solid #2e2e2e;">Service</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right; border-bottom: 1px solid #2e2e2e;">${serviceName || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #888; border-bottom: 1px solid #2e2e2e;">Stylist</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right; border-bottom: 1px solid #2e2e2e;">${stylistName || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #888; border-bottom: 1px solid #2e2e2e;">Date</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right; border-bottom: 1px solid #2e2e2e;">${date || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #888;">Time</td>
                <td style="padding: 0.5rem 0; color: #f0ece4; text-align: right;">${time || '—'}</td>
              </tr>
            </table>
          </div>

          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            We look forward to seeing you. If you need to make any changes, please contact us as soon as possible.
          </p>

          <div style="border-top: 1px solid #2e2e2e; padding-top: 1.5rem; margin-top: 1.5rem;">
            <p style="font-size: 12px; color: #888; margin: 0;">DHB Davilas Hair &amp; Beauty</p>
            <p style="font-size: 12px; color: #888; margin: 0.25rem 0 0;">davilasbarack@gmail.com</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Booking confirmation email sent' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}