const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Potholes',
        'Garbage Accumulation',
        'Broken Streetlights',
        'Water Leaks',
        'Damaged Infrastructure',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, required: [true, 'Location address is required'] },
    },
    evidencePhotos: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: [
        'pending_verification',
        'accepted',
        'rejected',
        'assigned',
        'in_progress',
        'resolved',
      ],
      default: 'pending_verification',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    assignedDepartmentName: {
      type: String,
      default: '',
    },
    verificationNotes: {
      type: String,
      default: '',
    },
    progressNotes: {
      type: String,
      default: '',
    },
    completionPhoto: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
