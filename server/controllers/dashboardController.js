const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// GET /api/dashboard — admin only
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalClubs, totalEvents, totalRegistrations] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Club.countDocuments(),
      Event.countDocuments(),
      EventRegistration.countDocuments(),
    ]);
    res.json({ totalUsers, totalClubs, totalEvents, totalRegistrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
