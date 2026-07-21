import transporter from '../../../lib/mailer';

const STATUS_LABELS = {
  CONFIRMED: { label: 'Confirmed', color: '#4ade80', message: 'Great news! Your appointment has been confirmed by our team. We look forward to seeing you.' },
  CANCELLED: { label: 'Cancelled', color: '#f87171', message: 'Unfortunately your appointment has been cancelled. Please contact us to reschedule.' },
  COMPLETED: { label: 'Completed', color: '#a78bfa', message: 'Thank you for visiting DHB Davilas! We hope you loved your experience.' },
  NO_SHOW:   { label: 'No Show',   color: '#fb923c', message: 'We missed you today! Please contact us to reschedule your appointment.' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, clientEmail, stylistName, serviceName, date, time, status } = req.body;

  if (!clientEmail || !clientName || !status) {
    return res.status(400).json({ error: 'clientEmail, clientName, and status are required' });
  }

  const statusInfo = STATUS_LABELS[status];
  if (!statusInfo) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await transporter.sendMail({
      from: `"DHB Davilas" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `Appointment ${statusInfo.label} — DHB Davilas`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #f0ece4; padding: 2.5rem;">
          <div style="border-bottom: 1px solid #2e2e2e; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <h1 style="font-size: 24px; color: #d4af37; margin: 0;">DHB Davilas</h1>
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin: 0.25rem 0 0;">Hair &amp; Beauty</p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <h2 style="font-size: 20px; color: #f0ece4; margin: 0;">Appointment ${statusInfo.label}</h2>
            <span style="background: ${statusInfo.color}22; color: ${statusInfo.color}; border: 1px solid ${statusInfo.color}44; padding: 2px 10px; border-radius: 2px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">${statusInfo.label}</span>
          </div>

          <p style="color: #888; font-size: 15px; line-height: 1.6;">
            Hi <strong style="color: #f0ece4;">${clientName}</strong>, ${statusInfo.message}
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
            If you have any questions, don't hesitate to reach out to us.
          </p>

          <div style="border-top: 1px solid #2e2e2e; padding-top: 1.5rem; margin-top: 1.5rem;">
            <p style="font-size: 12px; color: #888; margin: 0;">DHB Davilas Hair &amp; Beauty</p>
            <p style="font-size: 12px; color: #888; margin: 0.25rem 0 0;">davilasbarack@gmail.com</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Status update email sent' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}