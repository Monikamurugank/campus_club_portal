const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { signup, login, getMe, changePassword } = require('../controllers/authController');

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number');

router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  passwordRules,
], validate, signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.get('/me', protect, getMe);

router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRules.optional().isLength({ min: 8 }),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('New password must contain a number'),
], validate, changePassword);

module.exports = router;
