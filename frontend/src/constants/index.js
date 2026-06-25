// ── Centralized constants — single source of truth for magic strings ─────────
// Why this file exists: prevents typos like 'Buyer' vs 'buyer' causing silent
// bugs in role checks across 20+ components. Change a value once, here.

export const ROLES = {
  BUYER: 'buyer',
  AGENT: 'agent',
  ADMIN: 'admin',
}

export const PROPERTY_TYPES = {
  SALE: 'sale',
  RENT: 'rent',
}

export const PROPERTY_CATEGORIES = [
  { value: 'apartment',  label: 'Apartment' },
  { value: 'house',      label: 'House' },
  { value: 'villa',      label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land',       label: 'Land' },
  { value: 'studio',     label: 'Studio' },
]

export const PROPERTY_STATUS = {
  ACTIVE:  'active',
  PENDING: 'pending',
  SOLD:    'sold',
  RENTED:  'rented',
}

export const BOOKING_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const AMENITIES = [
  'parking', 'pool', 'gym', 'garden', 'balcony', 'elevator',
  'security', 'furnished', 'petFriendly', 'airConditioning',
  'heating', 'internet', 'laundry',
]

export const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest first' },
  { value: 'price_asc',   label: 'Price: low to high' },
  { value: 'price_desc',  label: 'Price: high to low' },
  { value: 'most_viewed', label: 'Most viewed' },
]

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER:          'user',
  THEME:         'theme',
}
