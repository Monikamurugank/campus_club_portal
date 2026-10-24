const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index prevents duplicate registrations for the same event
EventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);
