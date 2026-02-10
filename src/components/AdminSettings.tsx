import { useState } from 'react';
import { AdminData } from '../App';
import { Key, Lock, Mail, User, Save, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

interface AdminSettingsProps {
  adminData: AdminData | null;
  onCreateAdmin?: () => void;
}

export function AdminSettings({ adminData, onCreateAdmin }: AdminSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminData?.username,
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Create Admin Button - Only for Super Admin */}
      {adminData?.role === 'superadmin' && onCreateAdmin && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-sm p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-1">Admin Management</h3>
              <p className="text-xs sm:text-sm text-blue-100">
                As a Super Admin, you can create new admin accounts
              </p>
            </div>
            <button
              onClick={onCreateAdmin}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create New Admin
            </button>
          </div>
        </div>
      )}
      
      {/* Admin Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          Admin Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{adminData?.username || 'Not logged in'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{adminData?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-semibold text-gray-900 capitalize text-sm sm:text-base">{adminData?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="Enter new password (min 6 characters)"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="Confirm new password"
              required
            />
          </div>

          {message && (
            <div className={`flex items-center gap-2 text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-xs sm:text-sm">{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Security Tips
        </h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>• Use a strong password with at least 6 characters</li>
          <li>• Include uppercase, lowercase, numbers, and symbols</li>
          <li>• Don't share your password with anyone</li>
          <li>• Change your password regularly</li>
        </ul>
      </div>
    </div>
  );
}
