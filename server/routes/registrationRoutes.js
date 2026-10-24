const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { registerForEvent, getMyRegistrations, getAllRegistrations, cancelRegistration } = require('../controllers/registrationController');

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/', protect, adminOnly, getAllRegistrations);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
