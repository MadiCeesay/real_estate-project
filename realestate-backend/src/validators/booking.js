import { z } from 'zod';

export const createBookingSchema = z.object({
  propertyId: z.string().length(24, 'Invalid property ID'),
  viewingDate: z
    .string()
    .refine(
      (date) => new Date(date) > new Date(),
      'Viewing date must be in the future'
    ),
  viewingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed']),
  notes: z.string().max(500).optional(),
});
