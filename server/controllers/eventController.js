const Event = require('../models/Event');

// GET /api/events — public
const getEvents = async (req, res) => {
  try {
    const { clubId, date } = req.query;
    const filter = {};
    if (clubId) filter.clubId = clubId;
    if (date) filter.date = { $gte: new Date(date) };
    const events = await Event.find(filter).populate('clubId', 'name').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:id — public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events — admin only
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/:id — admin only
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('clubId', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/events/:id — admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
