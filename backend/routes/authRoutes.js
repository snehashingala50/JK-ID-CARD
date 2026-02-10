const express = require("express");
const router = express.Router();
const { 
  login, 
  changePassword, 
  getAdminDetails,
  initializeAdmin,
  forgotPasswordSendOTP,
  resetPasswordWithOTP,
  signup,
  verifySession
} = require("../controllers/authController");

// Initialize default admin (run once)
router.post("/initialize", initializeAdmin);

// Signup/Registration
router.post("/signup", signup);

// Login with username and password
router.post("/login", login);



// Change password
router.post("/change-password", changePassword);

// Forgot Password - Step 1: Send OTP
router.post("/forgot-password", forgotPasswordSendOTP);

// Forgot Password - Step 2: Reset Password
router.post("/reset-password", resetPasswordWithOTP);

// Get admin details
router.get("/admin/:username", getAdminDetails);

// Verify session token
router.post("/verify-session", verifySession);

module.exports = router;
