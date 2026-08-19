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
      from: '"DHB Davilas" <davilasbarack@gmail.com>',
      to: clientEmail,
      subject: 'Appointment Confirmed — DHB Davilas Hair & Beauty',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #f0ece4;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); padding: 2rem 2.5rem; border-bottom: 2px solid #d4af37;">
            <h1 style="font-size: 28px; color: #d4af37; margin: 0; letter-spacing: 0.05em;">DHB Davilas</h1>
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin: 0.3rem 0 0;">Hair &amp; Beauty</p>
          </div>

          <!-- Body -->
          <div style="padding: 2.5rem;">

            <!-- EN Greeting -->
            <h2 style="font-size: 22px; color: #d4af37; margin: 0 0 0.5rem;">✦ Appointment Confirmed</h2>
            <p style="color: #aaa; font-size: 15px; line-height: 1.7; margin: 0 0 0.25rem;">
              Hi <strong style="color: #f0ece4;">${clientName}</strong>, your appointment has been booked successfully.
            </p>

            <!-- FR Greeting -->
            <p style="color: #888; font-size: 13px; font-style: italic; margin: 0 0 2rem;">
              Bonjour <strong style="color: #d4af37;">${clientName}</strong>, votre rendez-vous a été confirmé avec succès.
            </p>

            <!-- Appointment Details Card -->
            <div style="background: #1a1a1a; border-radius: 6px; overflow: hidden; margin-bottom: 2rem; border: 1px solid #2e2e2e;">

              <!-- Card Header -->
              <div style="background: #d4af37; padding: 0.75rem 1.5rem;">
                <p style="margin: 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #0f0f0f; font-weight: bold;">
                  Appointment Details / Détails du rendez-vous
                </p>
              </div>

              <!-- Detail Rows -->
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr style="border-bottom: 1px solid #2e2e2e;">
                  <td style="padding: 1rem 1.5rem; width: 40%;">
                    <span style="color: #888; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; display: block;">Service</span>
                  </td>
                  <td style="padding: 1rem 1.5rem; text-align: right;">
                    <strong style="color: #f0ece4; font-size: 16px;">${serviceName || '—'}</strong>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #2e2e2e;">
                  <td style="padding: 1rem 1.5rem;">
                    <span style="color: #888; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; display: block;">Stylist / Styliste</span>
                  </td>
                  <td style="padding: 1rem 1.5rem; text-align: right;">
                    <strong style="color: #f0ece4; font-size: 16px;">${stylistName || '—'}</strong>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #2e2e2e;">
                  <td style="padding: 1rem 1.5rem;">
                    <span style="color: #888; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; display: block;">Date</span>
                  </td>
                  <td style="padding: 1rem 1.5rem; text-align: right;">
                    <strong style="color: #d4af37; font-size: 16px;">${date || '—'}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 1rem 1.5rem;">
                    <span style="color: #888; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; display: block;">Time / Heure</span>
                  </td>
                  <td style="padding: 1rem 1.5rem; text-align: right;">
                    <strong style="color: #d4af37; font-size: 16px;">${time || '—'}</strong>
                  </td>
                </tr>
              </table>
            </div>

            <!-- EN note -->
            <p style="color: #888; font-size: 14px; line-height: 1.7; margin: 0 0 0.5rem;">
              We look forward to seeing you. If you need to make any changes or cancel, please contact us as soon as possible.
            </p>

            <!-- FR note -->
            <p style="color: #666; font-size: 13px; font-style: italic; line-height: 1.7; margin: 0 0 2rem;">
              Nous avons hâte de vous accueillir. Si vous devez modifier ou annuler, veuillez nous contacter dès que possible.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 2rem 0;">
              <a href="https://dhbdavilashairbeauty.vercel.app/contact"
                style="display: inline-block; background: #d4af37; color: #0f0f0f; padding: 0.85rem 2.5rem; font-size: 12px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; border-radius: 3px;">
                Contact Us / Nous contacter
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #1a1a1a; border-top: 1px solid #2e2e2e; padding: 1.5rem 2.5rem; text-align: center;">
            <p style="font-size: 13px; color: #d4af37; margin: 0 0 0.5rem; letter-spacing: 0.1em;">DHB Davilas Hair &amp; Beauty</p>
            <p style="font-size: 12px; color: #666; margin: 0;">davilasbarack@gmail.com &nbsp;·&nbsp; +1 613 710 07-54</p>
            <p style="font-size: 11px; color: #444; margin: 0.75rem 0 0;">Gatineau-Ottawa, Canada</p>
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