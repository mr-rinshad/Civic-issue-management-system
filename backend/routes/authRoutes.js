const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
  getAllCitizens,
  toggleUserSuspension,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

// Admin Citizen Management Routes
router.get('/citizens', protect, authorize('admin'), getAllCitizens);
router.put('/citizens/:id/suspend', protect, authorize('admin'), toggleUserSuspension);

module.exports = router;
