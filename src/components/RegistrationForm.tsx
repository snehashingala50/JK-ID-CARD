import { useState } from 'react';
import { StudentFormData } from '../App';
import { PhotoUpload } from './PhotoUpload';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface RegistrationFormProps {
  formData: Partial<StudentFormData>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  existingStudents?: StudentFormData[];
}

export function RegistrationForm({ formData, onChange, onSubmit, existingStudents = [] }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState({});
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateError, setDuplicateError] = useState(null);

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'name':
        return !value || value.length < 2 ? 'Must be at least 2 characters' : null;
      case 'rollNumber':
        return !value ? 'Required' : null;
      case 'phoneNumber':
      case 'emergencyContact':
        return !value || !/^\d{10}$/.test(value) ? 'Must be 10 digits' : null;
      case 'dateOfBirth':
        return !value ? 'Required' : null;
      case 'bloodGroup':
        return !value ? 'Required' : null;
      case 'address':
        return !value || value.length < 10 ? 'Must be at least 10 characters' : null;
      default:
        return null;
    }
  };

  // Check for duplicate student registration
  const checkForDuplicate = (): string | null => {
    if (!formData.class || !formData.section || !formData.rollNumber) {
      return null;
    }
    
    const existingStudent = existingStudents.find(student => 
      student.class === formData.class && 
      student.section === formData.section && 
      student.rollNumber === formData.rollNumber
    );
    
    if (existingStudent) {
      return `Student with Class ${formData.class}, Section ${formData.section}, Roll No ${formData.rollNumber} already exists (Name: ${existingStudent.name}, Status: ${existingStudent.status})`;
    }
    
    return null;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isStep1Valid = () => {
    const hasRequiredFields = !!(
      formData.name &&
      formData.class &&
      formData.section &&
      formData.rollNumber &&
      formData.dateOfBirth
    );
    
    const hasNoErrors = !!(
      !validateField('name', formData.name) &&
      !validateField('rollNumber', formData.rollNumber) &&
      !validateField('dateOfBirth', formData.dateOfBirth)
    );
    
    return hasRequiredFields && hasNoErrors;
  };

  const isFormValid = () => {
    return !!(
      isStep1Valid() &&
      formData.bloodGroup &&
      formData.address &&
      formData.phoneNumber &&
      formData.emergencyContact &&
      formData.photo &&
      !validateField('bloodGroup', formData.bloodGroup) &&
      !validateField('address', formData.address) &&
      !validateField('phoneNumber', formData.phoneNumber) &&
      !validateField('emergencyContact', formData.emergencyContact)
    );
  };

  const handleNextStep = async () => {
    if (isStep1Valid()) {
      // Check for duplicates when moving to step 2
      setIsCheckingDuplicate(true);
      setDuplicateError(null);
      
      try {
        const duplicateMessage = checkForDuplicate();
        if (duplicateMessage) {
          setDuplicateError(duplicateMessage);
          setIsCheckingDuplicate(false);
          return;
        }
        
        // Also check with backend
        if (formData.class && formData.section && formData.rollNumber) {
          const response = await fetch('http://localhost:5000/api/students/check-duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              class: formData.class,
              section: formData.section,
              rollNumber: formData.rollNumber
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.exists) {
              setDuplicateError(`Student with Class ${formData.class}, Section ${formData.section}, Roll No ${formData.rollNumber} already exists in database (Name: ${result.student.name}, Status: ${result.student.status})`);
              setIsCheckingDuplicate(false);
              return;
            }
          }
        }
        
        setCurrentStep(2);
      } catch (error) {
        console.error('Error checking for duplicates:', error);
        // Continue to step 2 even if duplicate check fails
        setCurrentStep(2);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }
  };

  const renderInput = (
    label: string,
    field: keyof StudentFormData,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const value = formData[field] as string;
    const error = touched[field] ? validateField(field, value) : null;

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-blue-500 bg-white'
          }`}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
        {!error && value && touched[field] && (
          <div className="absolute right-3 top-11">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 2
          </span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 ? 'Basic Information' : 'Additional Details & Photo'}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
          
          {renderInput('Full Name', 'name', 'text', 'Enter student full name')}
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.class || ''}
                onChange={(e) => onChange('class', e.target.value)}
                onBlur={() => handleBlur('class')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section || ''}
                onChange={(e) => onChange('section', e.target.value)}
                onBlur={() => handleBlur('section')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {['A', 'B', 'C', 'D', 'E'].map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {renderInput('Roll No.', 'rollNumber', 'text', '001')}
          </div>

          {renderInput('Date of Birth', 'dateOfBirth', 'date')}

          {/* Duplicate Error Message */}
          {duplicateError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Duplicate Registration Detected</h4>
                  <p className="text-red-700 text-sm">{duplicateError}</p>
                  <p className="text-red-600 text-xs mt-2">Please check if this is the correct student information or contact admin if you believe this is an error.</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={handleNextStep}
              disabled={!isStep1Valid() || isCheckingDuplicate}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isCheckingDuplicate ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                'Next Step →'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Additional Details */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Additional Information</h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Step 1
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.bloodGroup || ''}
              onChange={(e) => onChange('bloodGroup', e.target.value)}
              onBlur={() => handleBlur('bloodGroup')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select blood group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter full address"
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                touched.address && validateField('address', formData.address)
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500 bg-white'
              }`}
            />
            {touched.address && validateField('address', formData.address) && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                {validateField('address', formData.address)}
              </div>
            )}
          </div>

          {renderInput('Phone Number', 'phoneNumber', 'tel', '10-digit mobile number')}
          {renderInput('Emergency Contact', 'emergencyContact', 'tel', 'Alternate contact number')}

          {/* Photo Upload */}
          <div className="pt-4">
            <PhotoUpload
              photo={formData.photo || null}
              onPhotoChange={(photo) => onChange('photo', photo)}
            />
          </div>

          <div className="pt-6">
            {!isFormValid() && (
              <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <strong>Please complete all required fields:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  {!formData.bloodGroup && <li>• Blood Group</li>}
                  {!formData.address && <li>• Address</li>}
                  {formData.address && formData.address.length < 10 && <li>• Address (minimum 10 characters)</li>}
                  {!formData.phoneNumber && <li>• Phone Number</li>}
                  {formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber) && <li>• Phone Number (must be 10 digits)</li>}
                  {!formData.emergencyContact && <li>• Emergency Contact</li>}
                  {formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact) && <li>• Emergency Contact (must be 10 digits)</li>}
                  {!formData.photo && <li>• Student Photo</li>}
                </ul>
              </div>
            )}
            <button
              onClick={onSubmit}
              disabled={!isFormValid()}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
            >
              Submit Registration ✓
            </button>
            
            {/* Duplicate Warning on Final Step */}
            {duplicateError && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Duplicate Warning</span>
                </div>
                <p className="text-amber-700 text-xs mt-1">You are about to submit a registration that may be duplicate. Please verify the information is correct.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
