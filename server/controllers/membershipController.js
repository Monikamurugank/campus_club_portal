const Membership = require('../models/Membership');

// POST /api/memberships — student joins a club
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.body;
    const membership = await Membership.create({ userId: req.user._id, clubId });
    res.status(201).json(membership);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already joined this club' });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/memberships/my — get current user's memberships
const getMyMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.user._id }).populate('clubId');
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/memberships — admin: all memberships
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate('userId', 'name email').populate('clubId', 'name');
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/memberships/:id — leave a club
const leaveClub = async (req, res) => {
  try {
    const membership = await Membership.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.json({ message: 'Left club successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { joinClub, getMyMemberships, getAllMemberships, leaveClub };
