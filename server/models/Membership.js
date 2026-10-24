const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index prevents a student from joining the same club twice
MembershipSchema.index({ userId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model('Membership', MembershipSchema);
