import { SchoolSettings } from '../App';
import { Building2, CheckCircle2, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  schoolSettings: SchoolSettings;
  onGetStarted: () => void;
}

export function HeroSection({ schoolSettings, onGetStarted }: HeroSectionProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1586144131462-fa2a2b6d070c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBicmlnaHQlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMDI5MDYxfDA&ixlib=rb-4.1.0&q=80&w=1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30" />

      {/* Glassmorphism Card */}
      <div className="relative max-w-2xl w-full">
        <div className="backdrop-blur-2xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-12">
          {/* School Logo */}
          <div className="flex justify-center mb-6">
            {schoolSettings.logo ? (
              <img 
                src={schoolSettings.logo} 
                alt="School Logo" 
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* School Name */}
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            {schoolSettings.schoolName}
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Academic Year {schoolSettings.academicYear}
          </p>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Student ID Card Registration
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-orange-600" />
                <span>Quick</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-semibold text-gray-900 text-sm">Upload Photo</div>
              <div className="text-xs text-gray-600">Instant preview</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-gray-900 text-sm">Real-time Preview</div>
              <div className="text-xs text-gray-600">See your ID live</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl mb-2">💾</div>
              <div className="font-semibold text-gray-900 text-sm">Auto-save</div>
              <div className="text-xs text-gray-600">Never lose progress</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-semibold text-gray-900 text-sm">Instant Validation</div>
              <div className="text-xs text-gray-600">Error-free forms</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Get Started →
          </button>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Please ensure you have a passport-size photo with white background
          </p>
        </div>
      </div>
    </div>
  );
}
