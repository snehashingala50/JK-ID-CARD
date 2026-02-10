const mongoose = require("mongoose");

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", AdminSchema);

// Student Schema
const StudentSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  fatherName: String,
  class: { type: String, required: true },
  section: { type: String, required: true },
  rollNumber: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  bloodGroup: String,
  address: String,
  phoneNumber: String,
  emergencyContact: String,
  photo: String,
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved'],
    default: 'submitted'
  },
  submittedAt: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index to prevent duplicate registrations
// A student is uniquely identified by class + section + rollNumber combination
StudentSchema.index({ class: 1, section: 1, rollNumber: 1 }, { unique: true });

module.exports = {
  Student: mongoose.model("Student", StudentSchema),
  Admin: Admin
};
