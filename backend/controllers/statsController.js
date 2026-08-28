const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get dashboard metrics for Admin
// @route   GET /api/stats/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingVerification = await Complaint.countDocuments({ status: 'pending_verification' });
    const accepted = await Complaint.countDocuments({ status: 'accepted' });
    const rejected = await Complaint.countDocuments({ status: 'rejected' });
    const assigned = await Complaint.countDocuments({ status: 'assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDepartments = await Department.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingVerification,
        accepted,
        rejected,
        assigned,
        inProgress,
        resolved,
        totalUsers,
        totalDepartments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

module.exports = {
  getAdminStats,
};
