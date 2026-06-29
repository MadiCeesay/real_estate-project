import { sendContactEmail } from '../services/email.service.js';
import { asyncHandler, sendSuccess } from '../utils/apiResponse.js';

// POST /api/v1/contact
export const submitContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  await sendContactEmail({ firstName, lastName, email, message }).catch((err) => {
    console.error('Contact email failed:', err.message);
    throw err;
  });

  sendSuccess(res, null, 'Your message has been sent. We will get back to you within 24 hours.');
});
