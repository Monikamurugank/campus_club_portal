const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getClubs, getClubById, createClub, updateClub, deleteClub } = require('../controllers/clubController');

router.get('/', getClubs);           // public
router.get('/:id', getClubById);     // public

router.post('/', protect, adminOnly, createClub);
router.put('/:id', protect, adminOnly, updateClub);
router.delete('/:id', protect, adminOnly, deleteClub);

module.exports = router;
