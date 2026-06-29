import { z } from 'zod';

export const createBookingSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  viewingDate: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, 'Viewing date must be in the future'),
  viewingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (e.g. 10:00)'),
  message: z.string().max(500).optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum(['confirmed', 'completed', 'cancelled']),
  cancelReason: z.string().max(300).optional(),
  agentNotes: z.string().max(500).optional(),
});
