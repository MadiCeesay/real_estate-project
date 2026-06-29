import { config } from '../config/env.js';

const MAPS_BASE = 'https://maps.googleapis.com/maps/api';

// ── Geocode an address string to coordinates 
export const geocodeAddress = async (address) => {
  const url = `${MAPS_BASE}/geocode/json?address=${encodeURIComponent(address)}&key=${config.googleMaps.apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results.length) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const { lat, lng } = data.results[0].geometry.location;
  return {
    lat,
    lng,
    formattedAddress: data.results[0].formatted_address,
  };
};

// ── Get nearby places (schools, transit, shops)
export const getNearbyPlaces = async (lat, lng, type = 'school', radius = 1000) => {
  const url = `${MAPS_BASE}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${config.googleMaps.apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results) return [];

  return data.results.slice(0, 5).map((place) => ({
    name: place.name,
    vicinity: place.vicinity,
    rating: place.rating,
    distance: null, // Distance Matrix API needed for exact distance
  }));
};

// ── Reverse geocode coordinates to address ────────────────────────────────────
export const reverseGeocode = async (lat, lng) => {
  const url = `${MAPS_BASE}/geocode/json?latlng=${lat},${lng}&key=${config.googleMaps.apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results.length) return null;

  return data.results[0].formatted_address;
};
