const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  verifyComplaint,
  assignComplaint,
  getDepartmentComplaints,
  updateComplaintProgress,
  completeComplaint,
  getComplaintById,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Citizen routes
router.post('/', protect, authorize('user'), upload.array('evidencePhotos', 5), createComplaint);
router.get('/my', protect, authorize('user'), getMyComplaints);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllComplaints);
router.put('/:id/verify', protect, authorize('admin'), verifyComplaint);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);

// Department routes
router.get('/department/assigned', protect, authorize('department', 'admin'), getDepartmentComplaints);
router.put('/:id/progress', protect, authorize('department'), updateComplaintProgress);
router.put('/:id/complete', protect, authorize('department'), upload.single('completionPhoto'), completeComplaint);

// Common detail route
router.get('/:id', protect, getComplaintById);

module.exports = router;
