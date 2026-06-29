import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(150),
  description: z.string().min(30, 'Description must be at least 30 characters').max(3000),
  type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial']),
  status: z.enum(['for-sale', 'for-rent']).default('for-sale'),
  price: z.number().positive('Price must be positive'),
  priceUnit: z.enum(['total', 'per-month', 'per-year']).default('total'),
  location: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().default('Gambia'),
    zipCode: z.string().optional(),
    coordinates: z.object({
      coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
      ]),
    }),
  }),
  details: z.object({
    bedrooms: z.number().min(0).default(0),
    bathrooms: z.number().min(0).default(0),
    area: z.number().min(0).optional(),
    floors: z.number().min(1).default(1),
    yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
    parking: z.number().min(0).default(0),
  }),
  amenities: z
    .array(
      z.enum([
        'pool','gym','garden','balcony','garage','security',
        'elevator','air-conditioning','furnished','internet',
        'generator','borehole',
      ])
    )
    .optional(),
  virtualTour: z
    .object({
      url: z.string().url().optional(),
      embedCode: z.string().optional(),
    })
    .optional(),
  isFeatured: z.boolean().default(false),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  status: z.enum(['for-sale', 'for-rent', 'sold', 'rented']).optional(),
  type: z.enum(['house','apartment','condo','townhouse','villa','land','commercial']).optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minBedrooms: z.coerce.number().min(0).optional(),
  minArea: z.coerce.number().min(0).optional(),
  amenities: z.string().optional(), // comma-separated
  search: z.string().optional(),
  sort: z.enum(['price-asc','price-desc','newest','oldest','popular']).default('newest'),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().default(10), // km
});
