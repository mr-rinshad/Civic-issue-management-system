const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Report a new civic issue
// @route   POST /api/complaints
// @access  Private (User/Citizen)
const createComplaint = async (req, res) => {
  try {
    const { title, category, description, address, latitude, longitude, priority } = req.body;

    if (!title || !category || !description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: title, category, description, address',
      });
    }

    let evidencePhotos = [];
    if (req.files && req.files.length > 0) {
      evidencePhotos = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const complaint = await Complaint.create({
      title,
      category,
      description,
      location: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        address,
      },
      evidencePhotos,
      priority: priority || 'Medium',
      user: req.user.id,
      status: 'pending_verification',
    });

    return res.status(201).json({
      success: true,
      message: 'Civic complaint reported successfully',
      complaint,
    });
  } catch (error) {
    console.error('Create Complaint error:', error);
    return res.status(500).json({ success: false, message: 'Server error reporting complaint' });
  }
};

// @desc    Get current user's complaint history
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate('assignedDepartment', 'name code')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching complaints' });
  }
};

// @desc    Get all complaints (Admin view)
// @route   GET /api/complaints/admin/all
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedDepartment', 'name code')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching complaints for admin' });
  }
};

// @desc    Verify complaint (Accept or Reject)
// @route   PUT /api/complaints/:id/verify
// @access  Private (Admin)
const verifyComplaint = async (req, res) => {
  try {
    const { action, rejectionReason, verificationNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (action === 'accept') {
      complaint.status = 'accepted';
      complaint.verificationNotes = verificationNotes || 'Physically verified by Councillor Admin.';
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a reason for rejecting the complaint',
        });
      }
      complaint.status = 'rejected';
      complaint.rejectionReason = rejectionReason;
      complaint.verificationNotes = verificationNotes || 'Complaint rejected after physical verification.';
    } else {
      return res.status(400).json({ success: false, message: "Action must be 'accept' or 'reject'" });
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: `Complaint ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
      complaint,
    });
  } catch (error) {
    console.error('Verify complaint error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying complaint' });
  }
};

// @desc    Assign accepted complaint to a department
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
  try {
    const { departmentId, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.status !== 'accepted' && complaint.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Only verified & accepted complaints can be assigned to a department',
      });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Selected department not found' });
    }

    complaint.assignedDepartment = department._id;
    complaint.assignedDepartmentName = department.name;
    complaint.status = 'assigned';
    if (priority) complaint.priority = priority;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: `Complaint assigned to ${department.name} successfully`,
      complaint,
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    return res.status(500).json({ success: false, message: 'Error assigning complaint' });
  }
};

// @desc    Get complaints assigned to logged in department
// @route   GET /api/complaints/department/assigned
// @access  Private (Department)
const getDepartmentComplaints = async (req, res) => {
  try {
    // Find department associated with user
    const dept = await Department.findOne({
      $or: [
        { officialUser: req.user.id },
        { name: req.user.departmentName },
      ],
    });

    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department account mapping not found' });
    }

    const complaints = await Complaint.find({ assignedDepartment: dept._id })
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      department: dept.name,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Dept complaints error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching department complaints' });
  }
};

// @desc    Update progress on assigned complaint
// @route   PUT /api/complaints/:id/progress
// @access  Private (Department)
const updateComplaintProgress = async (req, res) => {
  try {
    const { progressNotes, status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status || 'in_progress';
    complaint.progressNotes = progressNotes || complaint.progressNotes;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: 'Complaint progress updated',
      complaint,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating complaint progress' });
  }
};

// @desc    Complete work and resolve complaint
// @route   PUT /api/complaints/:id/complete
// @access  Private (Department)
const completeComplaint = async (req, res) => {
  try {
    const { progressNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.file) {
      complaint.completionPhoto = `/uploads/${req.file.filename}`;
    }

    complaint.status = 'resolved';
    complaint.progressNotes = progressNotes || 'Work completed by Department team.';
    complaint.resolvedAt = new Date();

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: 'Complaint marked as resolved with completion evidence',
      complaint,
    });
  } catch (error) {
    console.error('Complete complaint error:', error);
    return res.status(500).json({ success: false, message: 'Error completing complaint' });
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedDepartment', 'name code description');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    return res.status(200).json({ success: true, complaint });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching complaint details' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  verifyComplaint,
  assignComplaint,
  getDepartmentComplaints,
  updateComplaintProgress,
  completeComplaint,
  getComplaintById,
};
