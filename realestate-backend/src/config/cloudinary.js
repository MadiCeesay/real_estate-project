import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.js';

// Configure once at startup. The config object (not process.env) is the source
// of truth — this keeps all secret access in one place.
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true, // Always use HTTPS URLs
});

export default cloudinary;
