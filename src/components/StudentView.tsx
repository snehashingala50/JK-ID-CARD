import { useState, useEffect } from 'react';
import { SchoolSettings, StudentFormData } from '../App';
import { HeroSection } from './HeroSection';
import { InstructionsPanel } from './InstructionsPanel';
import { RegistrationForm } from './RegistrationForm';
import { LiveIDPreview } from './LiveIDPreview';

interface StudentViewProps {
  schoolSettings: SchoolSettings;
  onSubmit: (formData: StudentFormData) => Promise<any>;
  existingStudents?: StudentFormData[];
}

export function StudentView({ schoolSettings, onSubmit, existingStudents = [] }: StudentViewProps) {
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    name: '',
    fatherName: '',
    class: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    phoneNumber: '',
    emergencyContact: '',
    photo: null,
    status: 'draft'
  });

  const [showForm, setShowForm] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save draft
  useEffect(() => {
    if (showForm && formData.name) {
      const timer = setTimeout(() => {
        localStorage.setItem('studentFormDraft', JSON.stringify(formData));
        setLastSaved(new Date());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, showForm]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('studentFormDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
    }
  }, []);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const submission: StudentFormData = {
        id: Date.now().toString(),
        ...(formData as Omit<StudentFormData, 'id' | 'status'>),
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };
      
      await onSubmit(submission);
      
      localStorage.removeItem('studentFormDraft');
      alert('Registration submitted successfully! Your ID card will be processed soon.');
      
      setFormData({
        name: '',
        fatherName: '',
        class: '',
        section: '',
        rollNumber: '',
        dateOfBirth: '',
        bloodGroup: '',
        address: '',
        phoneNumber: '',
        emergencyContact: '',
        photo: null,
        status: 'draft'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Submission error:', error);
      // Error is already handled in App.tsx with an alert
    }
  };

  if (!showForm) {
    return (
      <HeroSection 
        schoolSettings={schoolSettings}
        onGetStarted={handleGetStarted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-24 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student ID Card Registration
            </h1>
            <p className="text-gray-600">
              {schoolSettings.schoolName} • {schoolSettings.academicYear}
            </p>
            {lastSaved && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Draft auto-saved at {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-[350px,1fr,400px] gap-6">
            {/* Instructions Panel */}
            <InstructionsPanel />

            {/* Registration Form */}
            <RegistrationForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              existingStudents={existingStudents}
            />

            {/* Live ID Preview */}
            <LiveIDPreview
              schoolSettings={schoolSettings}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
