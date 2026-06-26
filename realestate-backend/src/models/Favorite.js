import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
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

// Compound unique index prevents duplicate favorites
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Static helper used by property controller to annotate listings
favoriteSchema.statics.isFavorited = async function (userId, propertyId) {
  if (!userId) return false;
  const exists = await this.findOne({ user: userId, property: propertyId });
  return Boolean(exists);
};

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
