import { createTransporter } from '../config/email.js';

export async function sendContactEmail(data) {
  const transporter = createTransporter();
  const toEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

  const htmlContent = `
    <h2>New Contact Form Submission — Launch Layer</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${escapeHtml(data.fullName)}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${escapeHtml(data.phone || 'N/A')}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Company</td><td style="padding: 8px;">${escapeHtml(data.companyName)}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Project Type</td><td style="padding: 8px;">${escapeHtml(data.projectType)}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Budget</td><td style="padding: 8px;">${escapeHtml(data.budget)}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr>
    </table>
  `;

  const textContent = `
New Contact Form Submission — Launch Layer

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Company: ${data.companyName}
Project Type: ${data.projectType}
Budget: ${data.budget}

Message:
${data.message}
  `.trim();

  if (!transporter) {
    if (process.env.NODE_ENV === 'production') {
      const error = new Error('Email service is not configured');
      error.statusCode = 503;
      throw error;
    }
    console.log('--- DEV MODE: Contact form submission ---');
    console.log(textContent);
    console.log('----------------------------------------');
    return { devMode: true };
  }

  await transporter.sendMail({
    from: `"Launch Layer Website" <${process.env.SMTP_USER}>`,
    to: toEmail,
    replyTo: data.email,
    subject: `[Launch Layer] New inquiry from ${data.fullName}`,
    text: textContent,
    html: htmlContent,
  });

  if (process.env.SEND_AUTO_REPLY === 'true') {
    await transporter.sendMail({
      from: `"Launch Layer" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'We received your message — Launch Layer',
      text: `Hi ${data.fullName},\n\nThank you for reaching out to Launch Layer. We have received your inquiry and will respond within 24 business hours.\n\nBest regards,\nThe Launch Layer Team`,
      html: `<p>Hi ${escapeHtml(data.fullName)},</p><p>Thank you for reaching out to <strong>Launch Layer</strong>. We have received your inquiry and will respond within 24 business hours.</p><p>Best regards,<br>The Launch Layer Team</p>`,
    });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
