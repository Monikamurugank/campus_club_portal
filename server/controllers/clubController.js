const Club = require('../models/Club');

// GET /api/clubs — public
const getClubs = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    const clubs = await Club.find(filter).sort({ createdAt: -1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/clubs/:id — public
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/clubs — admin only
const createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json(club);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Club name already exists' });
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/clubs/:id — admin only
const updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/clubs/:id — admin only
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ message: 'Club deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClubs, getClubById, createClub, updateClub, deleteClub };
