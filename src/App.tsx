import React, { useState, useEffect } from 'react';
import { StudentView } from './components/StudentView';
import { AdminPanel } from './components/AdminPanel';
import { Shield } from 'lucide-react';

export interface SchoolSettings {
  logo: string | null;
  schoolName: string;
  academicYear: string;
}

export interface StudentFormData {
  id: string;
  name: string;
  fatherName: string;
  class: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  photo: string | null;
  status: 'draft' | 'submitted' | 'approved';
  submittedAt?: string;
}

export interface AdminData {
  username: string;
  email: string;
  role: string;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginStep, setLoginStep] = useState<'credentials' | 'forgot-password' | 'forgot-otp'>('credentials');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Signup fields
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    // Load school settings from localStorage on initial mount
    const savedSettings = localStorage.getItem('schoolSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      logo: null,
      schoolName: 'Delhi Public School',
      academicYear: '2025-2026'
    };
  });

  // Save school settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: token })
          });
          
          if (response.ok) {
            const data = await response.json();
            setAdminData(data.admin);
            setIsAdmin(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem('sessionToken');
          }
        } catch (error) {
          console.error('Session verification error:', error);
          localStorage.removeItem('sessionToken');
        }
      }
    };
    
    checkExistingSession();
  }, []);

  const [submissions, setSubmissions] = useState([]);

  // Load students from backend on mount
  useEffect(() => {
    fetchStudents();
  }, [schoolSettings]); // Reload when school settings change

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (response.ok) {
        const students = await response.json();
        setSubmissions(students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAdminLogin = async (e: any) => {
    e.preventDefault();
    
    if (loginStep === 'credentials') {
      // Direct login with username and password
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: adminUsername,
            password: adminPassword
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          
          // Check if it's an invalid credentials error
          if (error.message && (error.message.includes('Invalid username/email or password') || error.message.includes('Invalid credentials'))) {
            // Show option to either retry login or go to forgot password
            const retryChoice = window.confirm(`${error.message}\n\nWould you like to reset your password instead? (Click OK to reset, Cancel to try again)`);
            
            if (retryChoice) {
              // Extract email from the user input if it was an email
              if (adminUsername.includes('@')) {
                setForgotEmail(adminUsername);
              }
              setLoginStep('forgot-password');
            }
          } else {
            alert(error.message || 'Login failed');
          }
          return;
        }
        
        const data = await response.json();
        
        // Login successful
        setAdminData(data.admin);
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('sessionToken', data.sessionToken);
        
        // Reset form
        setAdminUsername('');
        setAdminPassword('');
        setLoginStep('credentials');
        setOtpSent(false);
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection.');
      }
    } else if (loginStep === 'forgot-password') {
      // Forgot Password Step 1: Send OTP to email
      try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        
        if (!response.ok) {
          const error = await response.json();
          alert(error.message || 'Failed to send OTP');
          return;
        }
        
        const data = await response.json();
        setLoginStep('forgot-otp');
        alert(`OTP sent to ${data.email}\n\nFor demo: ${data.otp}`);
      } catch (error) {
        console.error('Forgot password error:', error);
        alert('Failed to send OTP. Please try again.');
      }
    } else if (loginStep === 'forgot-otp') {
      // Forgot Password Step 2: Reset password with OTP
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: forgotEmail,
            otp: otp,
            newPassword: newPassword
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          alert(error.message || 'Failed to reset password');
          return;
        }
        
        alert('Password reset successfully! You can now login with your new password.');
        
        // Reset form and return to login
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setLoginStep('credentials');
      } catch (error) {
        console.error('Reset password error:', error);
        alert('Failed to reset password. Please try again.');
      }
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    
    // Validation
    if (signupPassword !== signupConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // Get role selection
    const role = (document.getElementById('signupRole') as HTMLSelectElement)?.value || 'admin';
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          fullName: signupFullName,
          role: role,
          createdBy: adminData?.username // Super admin creating the account
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to create admin account');
        return;
      }
      
      const data = await response.json();
      alert(data.message);
      
      // Reset signup form
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupFullName('');
      setShowSignup(false);
      
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to create admin account. Please try again.');
    }
  };

  const handleFormSubmit = async (formData: StudentFormData) => {
    try {
      console.log('Submitting form data:', formData);
      
      // Send data to backend API
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        console.error('Server error response:', errorMessage);
        throw new Error(errorMessage);
      }

      const savedStudent = await response.json();
      console.log('Student saved successfully:', savedStudent);
      
      // Update local state with saved student
      setSubmissions(prev => [...prev, savedStudent]);
      
      return savedStudent;
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to submit registration: ${error.message}`);
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear session token from localStorage
    localStorage.removeItem('sessionToken');
    setIsAdmin(false);
    setAdminData(null);
  };

  const handleApproveStudent = async (studentId: string) => {
    try {
      // Find the student to get the MongoDB _id
      const student = submissions.find(s => s.id === studentId);
      if (!student) {
        console.error('Student not found:', studentId);
        return;
      }

      // Get the MongoDB _id from the student object
      const mongoId = (student as any)._id;
      if (!mongoId) {
        console.error('MongoDB _id not found for student:', studentId);
        alert('Cannot approve: Student ID not found in database');
        return;
      }

      console.log('Approving student with MongoDB ID:', mongoId);

      // Update status in backend
      const response = await fetch(`http://localhost:5000/api/students/${mongoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedStudent = await response.json();
      console.log('Student approved successfully:', updatedStudent);

      // Update local state
      setSubmissions(prev => 
        prev.map(s => s.id === studentId ? { ...s, status: 'approved' } : s)
      );

      alert('Student approved successfully!');
    } catch (error) {
      console.error('Error approving student:', error);
      alert('Failed to approve student. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Admin Badge & Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {isAdmin && (
          <div className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-full flex items-center gap-1.5 shadow-lg">
            <Shield className="w-4 h-4" />
            Admin Mode
          </div>
        )}
        
        {!isAdmin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm font-medium"
          >
            JK ID Card
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm font-medium"
          >
            Logout
          </button>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
                <p className="text-sm text-gray-500">
                  {loginStep === 'credentials' && 'Enter your credentials'}
                  {loginStep === 'forgot-password' && 'Forgot Password'}
                  {loginStep === 'forgot-otp' && 'Reset Password'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginStep === 'credentials' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter username or email"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default: username: admin, password: admin123
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep('forgot-password');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium w-full text-right"
                  >
                    Forgot Password?
                  </button>
                </>
              ) : loginStep === 'forgot-password' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your registered email"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send an OTP to reset your password
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep('credentials');
                      setForgotEmail('');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-2 w-full text-center"
                  >
                    ← Back to login
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                      required
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Enter the 6-digit OTP sent to {forgotEmail}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep('forgot-password');
                      setOtp('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium w-full text-center"
                  >
                    ← Back
                  </button>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminUsername('');
                    setAdminPassword('');
                    setLoginStep('credentials');
                    setOtpSent(false);
                    setForgotEmail('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                >
                  {loginStep === 'credentials' && 'Login'}
                  {loginStep === 'forgot-password' && 'Send OTP'}
                  {loginStep === 'forgot-otp' && 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Admin</h2>
                <p className="text-sm text-gray-500">Add a new admin or super admin</p>
              </div>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Choose a username"
                  required
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password (min 6 characters)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="signupRole"
                  defaultValue="admin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Super Admin has full access including creating other admins
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(false);
                    setSignupUsername('');
                    setSignupEmail('');
                    setSignupPassword('');
                    setSignupConfirmPassword('');
                    setSignupFullName('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isAdmin ? (
        <AdminPanel
          schoolSettings={schoolSettings}
          setSchoolSettings={setSchoolSettings}
          submissions={submissions}
          onApproveStudent={handleApproveStudent}
          adminData={adminData}
          onCreateAdmin={() => setShowSignup(true)}
        />
      ) : (
        <StudentView
          schoolSettings={schoolSettings}
          onSubmit={handleFormSubmit}
          existingStudents={submissions}
        />
      )}
    </div>
  );
}
