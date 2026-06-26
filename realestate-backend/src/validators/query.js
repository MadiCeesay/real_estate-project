import { z } from 'zod';

export const searchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['sale', 'rent']).optional(),
  category: z.enum(['apartment', 'house', 'villa', 'commercial', 'land', 'studio']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  minArea: z.coerce.number().min(0).optional(),
  maxArea: z.coerce.number().min(0).optional(),
  amenities: z.string().optional(), // comma-separated list
  isFeatured: z.coerce.boolean().optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'oldest', 'most_viewed'])
    .default('newest'),
  lat: z.coerce.number().optional(), // for nearby search
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).max(100).optional(), // km
  status: z.enum(['active', 'pending', 'sold', 'rented', 'all']).optional(),
});
