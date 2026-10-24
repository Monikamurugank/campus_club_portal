const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { joinClub, getMyMemberships, getAllMemberships, leaveClub } = require('../controllers/membershipController');

router.post('/', protect, joinClub);
router.get('/my', protect, getMyMemberships);
router.get('/', protect, adminOnly, getAllMemberships);
router.delete('/:id', protect, leaveClub);

module.exports = router;
