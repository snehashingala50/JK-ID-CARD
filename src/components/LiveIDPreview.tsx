import { SchoolSettings, StudentFormData } from '../App';
import { QrCode, Building2 } from 'lucide-react';

interface LiveIDPreviewProps {
  schoolSettings: SchoolSettings;
  formData: Partial<StudentFormData>;
}

export function LiveIDPreview({ schoolSettings, formData }: LiveIDPreviewProps) {
  const hasData = formData.name || formData.class || formData.rollNumber;

  return (
    <div className="lg:sticky lg:top-8 h-fit">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Live ID Preview</h3>
          {hasData && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          )}
        </div>

        {/* ID Card Preview */}
        <div className="aspect-[1.6/1] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl overflow-hidden relative">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative h-full p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {schoolSettings.logo ? (
                  <img 
                    src={schoolSettings.logo} 
                    alt="School Logo" 
                    className="w-12 h-12 bg-white rounded-lg p-1.5 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div className="text-white">
                  <div className="font-bold text-sm leading-tight">
                    {schoolSettings.schoolName}
                  </div>
                  <div className="text-xs opacity-90">
                    {schoolSettings.academicYear}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center gap-4">
              {/* Photo */}
              <div className="flex-shrink-0">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Student"
                    className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Student Details */}
              <div className="flex-1 text-white space-y-2">
                <div>
                  <div className="text-xs opacity-75 uppercase tracking-wide">Student Name</div>
                  <div className="font-bold text-base">
                    {formData.name || 'Your Name'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="opacity-75">Class</div>
                    <div className="font-semibold">
                      {formData.class && formData.section 
                        ? `${formData.class}-${formData.section}`
                        : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-75">Roll No.</div>
                    <div className="font-semibold">
                      {formData.rollNumber || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-75">DOB</div>
                    <div className="font-semibold">
                      {formData.dateOfBirth 
                        ? new Date(formData.dateOfBirth).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                        : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-75">Blood Group</div>
                    <div className="font-semibold">
                      {formData.bloodGroup || '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between pt-3 border-t border-white/20">
              <div className="text-white text-xs">
                <div className="opacity-75">Contact</div>
                <div className="font-medium">
                  {formData.phoneNumber || 'Phone Number'}
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>💡 Preview updates in real-time</strong> as you fill the form. 
            Check all details carefully before submitting.
          </p>
        </div>

        {/* Card Details */}
        {formData.fatherName && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Additional Information
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Father's Name:</span>
                <span className="font-medium text-gray-900">{formData.fatherName}</span>
              </div>
              {formData.emergencyContact && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="font-medium text-gray-900">{formData.emergencyContact}</span>
                </div>
              )}
              {formData.address && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600 text-xs">Address:</span>
                  <p className="font-medium text-gray-900 text-xs mt-1 leading-relaxed">
                    {formData.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
