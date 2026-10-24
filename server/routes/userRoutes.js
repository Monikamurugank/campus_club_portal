const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.use(protect, adminOnly); // All user management routes are admin-only

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
