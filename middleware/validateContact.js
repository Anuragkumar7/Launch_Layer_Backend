const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-()]{7,20}$/;

const PROJECT_TYPES = [
  'Website',
  'Web Application',
  'SaaS Platform',
  'E-commerce',
  'UI/UX Design',
  'API Development',
  'Maintenance',
  'Other',
];

const BUDGET_OPTIONS = [
  'Under ₹5,000',
  '₹5,000 - ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+',
  'Not sure yet',
];

export function validateContact(req, res, next) {
  const { fullName, email, phone, projectType, budget, message } = req.body;
  const errors = [];

  if (!fullName?.trim() || fullName.trim().length < 2) {
    errors.push('Full name is required (min 2 characters)');
  }

  if (!email?.trim() || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Valid email is required');
  }

  if (phone?.trim() && !PHONE_REGEX.test(phone.trim())) {
    errors.push('Invalid phone number format');
  }

  if (!projectType || !PROJECT_TYPES.includes(projectType)) {
    errors.push('Valid project type is required');
  }

  if (!budget || !BUDGET_OPTIONS.includes(budget)) {
    errors.push('Valid budget range is required');
  }

  if (!message?.trim() || message.trim().length < 10) {
    errors.push('Message is required (min 10 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. '),
      errors,
    });
  }

  req.body = {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone?.trim() || '',
    companyName: req.body.companyName?.trim() || 'Not provided',
    projectType,
    budget,
    message: message.trim(),
  };

  next();
}
