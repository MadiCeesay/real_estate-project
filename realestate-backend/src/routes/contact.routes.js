import { Router } from 'express';
import { z } from 'zod';
import { authLimiter } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { submitContact } from '../controllers/contact.controller.js';

const router = Router();

const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

router.post('/', authLimiter, validate(contactSchema), submitContact);

export default router;
