import { useState } from 'react';
import { StudentFormData } from '../App';
import { Eye, CheckCircle, Users, Search, Filter, X, Download } from 'lucide-react';

interface SubmissionsTableProps {
  submissions: StudentFormData[];
  onApproveStudent: (studentId: string) => void;
}

export function SubmissionsTable({ submissions, onApproveStudent }: SubmissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${submission.class}-${submission.section}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportFilteredData = () => {
    if (filteredSubmissions.length === 0) {
      alert('No data to export!');
      return;
    }

    // Create CSV content
    const headers = [
      'Name',
      'Father Name',
      'Class',
      'Section',
      'Roll Number',
      'Date of Birth',
      'Blood Group',
      'Phone Number',
      'Emergency Contact',
      'Address',
      'Status',
      'Submitted Date'
    ];

    const rows = filteredSubmissions.map(s => [
      s.name,
      s.fatherName,
      s.class,
      s.section,
      s.rollNumber,
      s.dateOfBirth,
      s.bloodGroup,
      s.phoneNumber,
      s.emergencyContact,
      s.address?.replace(/,/g, ';'),
      s.status,
      s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A'
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
    const fileName = statusFilter !== 'all' 
      ? `student_data_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`
      : `student_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll number, or class..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="submitted">Pending</option>
              <option value="approved">Approved</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportFilteredData}
            disabled={filteredSubmissions.length === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base justify-center"
          >
            <Download className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden xs:inline">Export ({filteredSubmissions.length})</span>
            <span className="xs:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No submissions found</h3>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Student registrations will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {submission.photo ? (
                          <img 
                            src={submission.photo} 
                            alt={submission.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">{submission.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{submission.fatherName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {submission.class}-{submission.section}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{submission.rollNumber}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-600">{submission.phoneNumber}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
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
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => setSelectedStudent(submission)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        {submission.status === 'submitted' && (
                          <button
                            onClick={() => {
                              if (confirm(`Approve ID card for ${submission.name}?`)) {
                                onApproveStudent(submission.id);
                              }
                            }}
                            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedStudent.name}</h2>
                <p className="text-xs sm:text-sm opacity-90">
                  Class {selectedStudent.class}-{selectedStudent.section} • Roll {selectedStudent.rollNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Photo */}
              {selectedStudent.photo && (
                <div className="flex justify-center">
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Full Name</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent.name}</div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Father's Name</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent.fatherName}</div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Date of Birth</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Blood Group</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent.bloodGroup}</div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Phone Number</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent.phoneNumber}</div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Emergency Contact</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedStudent.emergencyContact}</div>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">Address</div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">{selectedStudent.address}</div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                    selectedStudent.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : selectedStudent.status === 'submitted'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedStudent.status === 'approved' ? '✓ Approved' : 
                     selectedStudent.status === 'submitted' ? '⏳ Pending Review' : 
                     '📝 Draft'}
                  </span>
                </div>

                {selectedStudent.status === 'submitted' && (
                  <button
                    onClick={() => {
                      onApproveStudent(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Approve ID Card
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}