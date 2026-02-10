import { useState, useRef } from 'react';
import { SchoolSettings } from '../App';
import { Upload, X, Check, Building2, AlertCircle } from 'lucide-react';

interface LogoManagementProps {
  schoolSettings: SchoolSettings;
  setSchoolSettings: (settings: SchoolSettings) => void;
}

export function LogoManagement({ schoolSettings, setSchoolSettings }: LogoManagementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [tempSchoolName, setTempSchoolName] = useState(schoolSettings.schoolName);
  const [tempYear, setTempYear] = useState(schoolSettings.academicYear);
  const fileInputRef = useRef(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSchoolSettings({
        ...schoolSettings,
        logo: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveLogo = () => {
    setSchoolSettings({
      ...schoolSettings,
      logo: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = () => {
    setSchoolSettings({
      ...schoolSettings,
      schoolName: tempSchoolName,
      academicYear: tempYear
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* School Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">School Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              School Name
            </label>
            <input
              type="text"
              value={tempSchoolName}
              onChange={(e) => setTempSchoolName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter school name"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Academic Year
            </label>
            <input
              type="text"
              value={tempYear}
              onChange={(e) => setTempYear(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="e.g., 2025-2026"
            />
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Logo Management */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">School Logo</h2>

        {!schoolSettings.logo ? (
          <>
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                  error ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {error ? (
                    <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  ) : (
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  )}
                </div>

                <div>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    {isDragging ? 'Drop logo here' : 'Upload School Logo'}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    PNG, JPG, or SVG (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 mt-3 sm:mt-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                💡 Logo Guidelines
              </h4>
              <ul className="space-y-1 text-xs text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Square or circular logos work best</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Transparent background (PNG) recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>High resolution for clear printing</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Logo Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 md:p-8 border border-blue-200">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Logo Display */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 sm:p-4">
                      <img
                        src={schoolSettings.logo}
                        alt="School Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-lg">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </div>
            
                {/* Info & Actions */}
                <div className="flex-1 w-full md:w-auto">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center md:text-left">
                    Logo Uploaded Successfully
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base text-center md:text-left">
                    Your school logo is now displayed on all student ID cards
                  </p>
            
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm text-sm sm:text-base"
                    >
                      Replace Logo
                    </button>
                    <button
                      onClick={handleRemoveLogo}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
                      Remove Logo
                    </button>
                  </div>
            
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Preview on ID Card */}
            <div className="mt-4 sm:mt-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Preview on ID Card</h3>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 max-w-md mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg p-1">
                    <img 
                      src={schoolSettings.logo} 
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-xs sm:text-sm">{schoolSettings.schoolName}</div>
                    <div className="text-xs opacity-90">{schoolSettings.academicYear}</div>
                  </div>
                </div>
                <div className="h-24 sm:h-32 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-xs sm:text-sm">
                  Student Information
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
