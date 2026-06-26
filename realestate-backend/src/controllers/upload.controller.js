import cloudinary from '../config/cloudinary.js';
import { asyncHandler, sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// ── Upload buffer to Cloudinary as a stream ──────────────────────────────────
const uploadToCloudinary = (buffer, folder = 'realestate/properties') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(new AppError('Image upload failed: ' + error.message, 500));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

// POST /api/v1/upload/images
export const uploadPropertyImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('Please select at least one image to upload', 400);
  }

  // Upload all files concurrently
  const uploads = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file.buffer))
  );

  sendSuccess(res, { images: uploads }, `${uploads.length} image(s) uploaded successfully`);
});

// DELETE /api/v1/upload/images/:publicId
export const deleteImage = asyncHandler(async (req, res) => {
  // publicId contains a slash (folder/filename) so it's base64-encoded in the URL
  const publicId = Buffer.from(req.params.publicId, 'base64').toString('utf-8');

  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    throw new AppError('Image deletion failed or image not found', 404);
  }

  sendSuccess(res, null, 'Image deleted successfully');
});
