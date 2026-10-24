const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  facultyCoordinator: {
    type: String,
    required: [true, 'Faculty coordinator is required'],
    trim: true,
  },
  meetingDetails: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Club', ClubSchema);
