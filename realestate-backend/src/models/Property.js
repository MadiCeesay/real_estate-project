import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    type: {
      type: String,
      enum: ['sale', 'rent'],
      required: [true, 'Type (sale or rent) is required'],
    },
    category: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'commercial', 'land', 'studio'],
      required: [true, 'Category is required'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: 0,
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [1, 'Area must be at least 1 square meter'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: ([lng, lat]) =>
            lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
          message: 'Invalid coordinates',
        },
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          'parking', 'pool', 'gym', 'garden', 'balcony', 'elevator',
          'security', 'furnished', 'petFriendly', 'airConditioning',
          'heating', 'internet', 'laundry',
        ],
      },
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent reference is required'],
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'sold', 'rented'],
      default: 'active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    virtualTourUrl: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

propertySchema.index({ location: '2dsphere' });
propertySchema.index({ agent: 1, status: 1 });
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ 'address.city': 1, status: 1 });

const  Property = mongoose.model('Property', propertySchema);
export default Property;
