import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['buyer', 'agent', 'admin'],
      default: 'buyer',
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // ── Agent-specific fields ─────────────────────────────────────────────
    agencyName: String,
    licenseNumber: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    // ── Refresh token (stored hashed) ─────────────────────────────────────
    // We store ONE refresh token per user. On rotation, old token is invalidated.
    // Never store the raw token — if DB is breached, tokens stay useless.
    refreshToken: {
      type: String,
      select: false,
    },

    // ── Password reset ────────────────────────────────────────────────────
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    lastLogin: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      // Remove sensitive fields whenever user object is serialized
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Pre-save hook: hash password before storing ───────────────────────────────
// Only runs when password field is modified — prevents re-hashing on every save.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // 12 rounds = ~250ms
  next();
});

// ── Instance method: compare plain password against stored hash ───────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Virtual: full name ────────────────────────────────────────────────────────
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ── Index on email for fast login lookups ─────────────────────────────────────
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
