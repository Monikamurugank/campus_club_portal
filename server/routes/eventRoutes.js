const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);          // public
router.get('/:id', getEventById);    // public

router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
