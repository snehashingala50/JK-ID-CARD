const { Admin } = require("../models/student");
const crypto = require("crypto");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash password (simple hash for demo - use bcrypt in production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Admin Login - Direct authentication with username and password
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username/email:', username);
    
    // Find admin by username OR email
    const admin = await Admin.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }
    
    // Verify password
    const hashedPassword = hashPassword(password);
    if (admin.password !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }
    
    // Check if there's an existing valid session token
    if (admin.sessionToken && admin.sessionExpiry && admin.sessionExpiry > new Date()) {
      // Return success immediately
      console.log('Valid session found for:', admin.username);
      
      return res.json({ 
        message: 'Login successful with existing session',
        admin: {
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        sessionToken: admin.sessionToken,
        sessionExpiresIn: Math.floor((admin.sessionExpiry.getTime() - Date.now()) / 1000)
      });
    }
    
    // Generate session token that expires in 30 days
    const sessionToken = generateSessionToken();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    admin.sessionToken = sessionToken;
    admin.sessionExpiry = sessionExpiry;
    
    await admin.save();
    
    console.log('Login successful for:', username);
    
    res.json({
      message: 'Login successful',
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      sessionToken: sessionToken,
      sessionExpiresIn: 30 * 24 * 60 * 60 // 30 days in seconds
    });
    
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    
    console.log('Password change request for:', username);
    
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Verify current password
    const hashedCurrentPassword = hashPassword(currentPassword);
    if (admin.password !== hashedCurrentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    admin.password = hashPassword(newPassword);
    await admin.save();
    
    console.log('Password changed successfully for:', username);
    
    res.json({ message: 'Password changed successfully' });
    
  } catch (err) {
    console.error('Error in changePassword:', err);
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password - Step 1: Send OTP to email
exports.forgotPasswordSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Forgot password request for email:', email);
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({ message: 'No admin account found with this email' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for forgot password
    
    // Save OTP to database
    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();
    
    console.log(`Forgot password OTP for ${email}: ${otp}`);
    
    // In production, send OTP via Email
    res.json({
      message: 'OTP sent to your email',
      otp: otp, // Remove this in production
      email: admin.email,
      expiresIn: 600 // seconds
    });
    
  } catch (err) {
    console.error('Error in forgotPasswordSendOTP:', err);
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password - Step 2: Reset Password with OTP
exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    console.log('Reset password attempt for:', email);
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    // Find admin
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Check if OTP expired
    if (!admin.otpExpiry || admin.otpExpiry < new Date()) {
      return res.status(401).json({ message: 'OTP expired. Please request a new one.' });
    }
    
    // Verify OTP
    if (admin.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    // Update password
    admin.password = hashPassword(newPassword);
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    
    console.log('Password reset successfully for:', email);
    
    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    
  } catch (err) {
    console.error('Error in resetPasswordWithOTP:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get admin details
exports.getAdminDetails = async (req, res) => {
  try {
    const { username } = req.params;
    
    const admin = await Admin.findOne({ username }).select('-password -otp -otpExpiry');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
    
  } catch (err) {
    console.error('Error in getAdminDetails:', err);
    res.status(500).json({ message: err.message });
  }
};

// Verify Session Token
exports.verifySession = async (req, res) => {
  try {
    const { sessionToken } = req.body;
    
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required' });
    }
    
    // Find admin by session token
    const admin = await Admin.findOne({ sessionToken });
    
    if (!admin || !admin.sessionExpiry || admin.sessionExpiry < new Date()) {
      // Session expired or invalid, clear it
      if (admin) {
        admin.sessionToken = undefined;
        admin.sessionExpiry = undefined;
        await admin.save();
      }
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }
    
    // Extend session expiry by another 30 days
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    admin.sessionExpiry = newExpiry;
    await admin.save();
    
    console.log('Session verified for:', admin.username);
    
    res.json({
      message: 'Session valid',
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      sessionToken: admin.sessionToken,
      sessionExpiresIn: 30 * 24 * 60 * 60 // 30 days in seconds
    });
    
  } catch (err) {
    console.error('Error in verifySession:', err);
    res.status(500).json({ message: err.message });
  }
};

// Initialize default admin (run once)
exports.initializeAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists' });
    }
    
    const defaultAdmin = new Admin({
      username: 'admin',
      password: hashPassword('admin123'),
      email: 'admin@school.com',
      role: 'superadmin'
    });
    
    await defaultAdmin.save();
    
    console.log('Default admin created successfully');
    
    res.json({ 
      message: 'Default admin created successfully',
      username: 'admin',
      password: 'admin123',
      email: 'admin@school.com'
    });
    
  } catch (err) {
    console.error('Error in initializeAdmin:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin Signup/Registration (Only for Super Admin)
exports.signup = async (req, res) => {
  try {
    const { username, email, password, fullName, role, createdBy } = req.body;
    
    console.log('Signup attempt for:', username, email, 'Role:', role);
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Verify that the creator is a superadmin
    if (createdBy) {
      const creator = await Admin.findOne({ username: createdBy });
      if (!creator || creator.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only Super Admins can create new admin accounts' });
      }
    }
    
    // Check if username already exists
    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Check if email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate role
    if (role && role !== 'admin' && role !== 'superadmin') {
      return res.status(400).json({ message: 'Invalid role. Must be admin or superadmin' });
    }
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashPassword(password),
      fullName,
      role: role || 'admin' // Default role is admin
    });
    
    await newAdmin.save();
    
    console.log('New admin registered successfully:', username, 'Role:', newAdmin.role);
    
    res.status(201).json({
      message: 'Admin account created successfully!',
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role
      }
    });
    
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ message: err.message });
  }
};
