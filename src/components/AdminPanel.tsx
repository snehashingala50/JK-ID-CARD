import { useState } from 'react';
import { SchoolSettings, StudentFormData, AdminData } from '../App';
import { LogoManagement } from './LogoManagement';
import { SubmissionsTable } from './SubmissionsTable';
import { ExportInfo } from './ExportInfo';
import { AdminSettings } from './AdminSettings';
import { 
  LayoutDashboard, 
  Image, 
  Users, 
  CheckCircle, 
  Clock,
  FileText,
  Download,
  Settings,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  schoolSettings: SchoolSettings;
  setSchoolSettings: (settings: SchoolSettings) => void;
  submissions: StudentFormData[];
  onApproveStudent: (studentId: string) => void;
  adminData: AdminData | null;
  onCreateAdmin: () => void;
}

type TabType = 'dashboard' | 'logo' | 'submissions' | 'settings';

export function AdminPanel({ 
  schoolSettings, 
  setSchoolSettings, 
  submissions, 
  onApproveStudent,
  adminData,
  onCreateAdmin
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'submitted').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    drafts: submissions.filter(s => s.status === 'draft').length,
    // Count potential duplicates (same class-section-rollNumber combination)
    duplicates: submissions.length - new Set(submissions.map(s => `${s.class}-${s.section}-${s.rollNumber}`)).size
  };

  const exportToExcel = () => {
    // Filter only approved submissions
    const approvedSubmissions = submissions.filter(s => s.status === 'approved');
    
    if (approvedSubmissions.length === 0) {
      alert('केवल approved students का data export किया जा सकता है! / Only approved students data can be exported!');
      return;
    }

    // Create CSV content with only approved students
    const headers = [
      'Name',
      //'Father Name',
      'Class',
      'Section',
      'Roll Number',
      'Date of Birth',
      'Blood Group',
      'Phone Number',
      'Emergency Contact',
      'Address',
      'Status',
      'Submitted Date',
      'Approved Date'
    ];

    const rows = approvedSubmissions.map(s => [
      s.name,
      //s.fatherName,
      s.class,
      s.section,
      s.rollNumber,
      s.dateOfBirth,
      s.bloodGroup,
      s.phoneNumber,
      s.emergencyContact,
      s.address?.replace(/,/g, ';'), // Replace commas in address
      s.status,
      s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A',
      s.status === 'approved' ? new Date().toLocaleString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Success message
    alert(`✅ ${approvedSubmissions.length} approved students का data successfully Excel में download हो गया! / Approved data exported successfully!`);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage school settings and student registrations
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={exportToExcel}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={stats.approved === 0}
              >
                <Download className="w-5 h-5" />
                <span className="hidden xs:inline">Export to Excel</span>
                <span className="xs:hidden">Export</span>
                {stats.approved > 0 && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {stats.approved} approved
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-600">School</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{schoolSettings.schoolName}</div>
                </div>
                {schoolSettings.logo && (
                  <img 
                    src={schoolSettings.logo} 
                    alt="School Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-blue-700">Total Students</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 sm:p-4 border border-amber-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-900">{stats.pending}</div>
                  <div className="text-xs sm:text-sm text-amber-700">Pending Review</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 sm:p-4 border border-green-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-900">{stats.approved}</div>
                  <div className="text-xs sm:text-sm text-green-700">Approved</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.drafts}</div>
                  <div className="text-xs sm:text-sm text-gray-700">Drafts</div>
                </div>
              </div>
            </div>

            {stats.duplicates > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 sm:p-4 border border-red-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-red-900">{stats.duplicates}</div>
                    <div className="text-xs sm:text-sm text-red-700">Potential Duplicates</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'dashboard'
                ? 'bg-white text-blue-600 shadow-lg border border-blue-200'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Dashboard</span>
            <span className="xs:hidden">Dash</span>
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'logo'
                ? 'bg-white text-blue-600 shadow-lg border border-blue-200'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <Image className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Logo Management</span>
            <span className="xs:hidden">Logo</span>
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'submissions'
                ? 'bg-white text-blue-600 shadow-lg border border-blue-200'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Student Submissions</span>
            <span className="xs:hidden">Submissions</span>
            {stats.pending > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {stats.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-lg border border-blue-200'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Settings</span>
            <span className="xs:hidden">⚙️</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Overview</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Export Info Card */}
              <ExportInfo />

              {/* School Settings Summary */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-lg">🏫</span>
                  School Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">School Name</div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{schoolSettings.schoolName}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">Academic Year</div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{schoolSettings.academicYear}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs sm:text-sm text-gray-600">School Logo</div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {schoolSettings.logo ? '✓ Uploaded' : '✗ Not set'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {submissions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Recent Submissions</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {submissions.slice(-5).reverse().map((submission) => {
                      // Check if this is a potential duplicate
                      const duplicateIdentifier = `${submission.class}-${submission.section}-${submission.rollNumber}`;
                      const sameIdentifierCount = submissions.filter(s => 
                        `${s.class}-${s.section}-${s.rollNumber}` === duplicateIdentifier
                      ).length;
                      const isDuplicate = sameIdentifierCount > 1;
                      
                      return (
                        <div 
                          key={submission.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border gap-3 ${
                            isDuplicate 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            {submission.photo ? (
                              <img 
                                src={submission.photo} 
                                alt={submission.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isDuplicate ? 'bg-red-200' : 'bg-gray-300'
                              }`}>
                                <Users className={`w-4 h-4 ${isDuplicate ? 'text-red-600' : 'text-gray-600'}`} />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                {submission.name}
                                {isDuplicate && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                    DUPLICATE
                                  </span>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                Class {submission.class}-{submission.section} • Roll {submission.rollNumber}
                                {isDuplicate && (
                                  <span className="block text-red-600 text-xs">
                                    Warning: {sameIdentifierCount} students with same ID
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              submission.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : submission.status === 'submitted'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {submission.status === 'approved' ? '✓ Approved' : 
                               submission.status === 'submitted' ? '⏳ Pending' : 
                               '📝 Draft'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {submissions.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No submissions yet</h3>
                  <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto">
                    Student registrations will appear here once they start submitting
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <LogoManagement
            schoolSettings={schoolSettings}
            setSchoolSettings={setSchoolSettings}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsTable
            submissions={submissions}
            onApproveStudent={onApproveStudent}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings adminData={adminData} onCreateAdmin={onCreateAdmin} />
        )}
      </div>
    </div>
  );
}