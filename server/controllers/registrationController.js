const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');

// POST /api/registrations — student registers for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check capacity — count confirmed registrations
    const count = await EventRegistration.countDocuments({ eventId, status: 'confirmed' });
    if (count >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const registration = await EventRegistration.create({ userId: req.user._id, eventId });
    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/registrations/my — current user's registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.user._id })
      .populate({ path: 'eventId', populate: { path: 'clubId', select: 'name' } });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/registrations — admin: all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find()
      .populate('userId', 'name email')
      .populate({ path: 'eventId', select: 'title date', populate: { path: 'clubId', select: 'name' } });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/registrations/:id — cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const reg = await EventRegistration.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, getAllRegistrations, cancelRegistration };
