import { sendContactEmail } from '../services/emailService.js';

export async function submitContact(req, res, next) {
  try {
    await sendContactEmail(req.body);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    next(error);
  }
}
