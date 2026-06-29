import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().optional(),
});

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  price: z.number().positive('Price must be a positive number'),
  type: z.enum(['sale', 'rent']),
  category: z.enum(['apartment', 'house', 'villa', 'commercial', 'land', 'studio']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  area: z.number().positive('Area must be a positive number'),
  address: addressSchema,
  coordinates: coordinatesSchema,
  amenities: z
    .array(z.enum([
      'parking', 'pool', 'gym', 'garden', 'balcony', 'elevator',
      'security', 'furnished', 'petFriendly', 'airConditioning',
      'heating', 'internet', 'laundry',
    ]))
    .optional()
    .default([]),
  virtualTourUrl: z.string().url('Must be a valid URL').optional(),
  status: z.enum(['active', 'pending', 'sold', 'rented']).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['active', 'pending', 'sold', 'rented']),
});
