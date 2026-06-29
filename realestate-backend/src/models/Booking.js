import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    viewingDate: {
      type: Date,
      required: [true, 'Viewing date is required'],
    },
    viewingTime: {
      type: String,
      required: [true, 'Viewing time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String, // Agent-only internal notes
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    cancelledBy: {
      type: String,
      enum: ['buyer', 'agent', null],
      default: null,
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

bookingSchema.index({ buyer: 1, status: 1 });
bookingSchema.index({ agent: 1, status: 1 });
bookingSchema.index({ property: 1, viewingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
