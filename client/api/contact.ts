import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body as ContactBody;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, message: 'Email service is not configured.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['Prithwin0146@gmail.com'],
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #171a21; border-radius: 8px; padding: 32px; color: #c7d5e0;">
              <h2 style="color: #66c0f4; margin: 0 0 24px 0; font-size: 20px;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #8f98a0; font-size: 13px; width: 80px;">Name</td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8f98a0; font-size: 13px;">Email</td>
                  <td style="padding: 8px 0; color: #66c0f4; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #66c0f4; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8f98a0; font-size: 13px;">Subject</td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #2a475e;">
                <p style="color: #8f98a0; font-size: 13px; margin: 0 0 8px 0;">Message</p>
                <p style="color: #c7d5e0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #2a475e; text-align: center;">
                <p style="color: #4a5568; font-size: 11px; margin: 0;">Sent from prithwin.vercel.app</p>
              </div>
            </div>
          </div>
        `,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}
