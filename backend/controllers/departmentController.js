const Department = require('../models/Department');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public / Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('officialUser', 'name email phone');
    return res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new department and department user account
// @route   POST /api/departments
// @access  Private (Admin only)
const createDepartment = async (req, res) => {
  try {
    const { name, code, description, officialEmail, officialPassword, officialName, officialPhone } = req.body;

    if (!name || !code || !officialEmail || !officialPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name, code, official email, and password',
      });
    }

    const existingDept = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department name or code already exists',
      });
    }

    let deptUser = await User.findOne({ email: officialEmail.toLowerCase() });
    if (deptUser) {
      return res.status(400).json({
        success: false,
        message: 'An official account with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(officialPassword, 10);
    deptUser = await User.create({
      name: officialName || `${name} Official`,
      email: officialEmail.toLowerCase(),
      password: hashedPassword,
      phone: officialPhone || '',
      role: 'department',
      departmentName: name,
    });

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description: description || '',
      officialUser: deptUser._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Department and Official user created successfully',
      department,
    });
  } catch (error) {
    console.error('Create Department error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating department' });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
};
