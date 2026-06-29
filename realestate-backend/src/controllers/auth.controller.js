import crypto from 'crypto';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../middleware/auth.js';
import { sendWelcomeEmail, sendPasswordReset } from '../services/email.service.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

// ── Helper: issue both tokens and store hashed refresh token ─────────────────
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store hashed refresh token in DB — raw token only exists in the response
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 409);

  const user = await User.create({ firstName, lastName, email, password, role, phone });

  await sendWelcomeEmail(user).catch((err) =>
    console.warn('Welcome email failed:', err.message)
  );

  const { accessToken, refreshToken } = await issueTokens(user, res);

  sendCreated(res, {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  }, 'Registration successful');
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Select password explicitly (it's excluded by default)
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  if (!user.isActive) throw new AppError('Account has been deactivated', 403);

  const { accessToken, refreshToken } = await issueTokens(user, res);

  sendSuccess(res, {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }, 'Login successful');
});

// POST /api/v1/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // Decode without verification to get userId
  let decoded;
  try {
    const jwt = await import('jsonwebtoken');
    decoded = jwt.default.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || !user.refreshToken) throw new AppError('Refresh token not found', 401);

  // Verify the stored hash matches
  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) throw new AppError('Invalid refresh token', 401);

  // Rotate: invalidate old, issue new pair
  const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user, res);

  sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, 'Tokens refreshed');
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // Clear the stored refresh token — invalidates all future refresh attempts
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  sendSuccess(res, null, 'Logged out successfully');
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user }, 'User profile retrieved');
});

// PATCH /api/v1/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  if (!user) throw new AppError('User not found', 404);

  sendSuccess(res, { user }, 'Profile updated successfully');
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return 200 — don't reveal whether email exists
  if (!user) {
    return sendSuccess(res, null, 'If that email is registered, a reset link has been sent.');
  }

  // Generate a random token (not JWT — stored as hash in DB)
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  await sendPasswordReset(user, resetToken).catch(async (err) => {
    console.error('Password reset email failed:', err.message);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Email could not be sent. Please try again.', 500);
  });

  sendSuccess(res, null, 'If that email is registered, a reset link has been sent.');
});

// POST /api/v1/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // Invalidate all active sessions
  await user.save();

  sendSuccess(res, null, 'Password reset successful. Please log in again.');
});

// POST /api/v1/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 401);

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  sendSuccess(res, null, 'Password changed successfully. Please log in again.');
});
