import { useState } from 'react';
import { Info, AlertCircle, CheckCircle2, Camera, FileText, Upload, Languages } from 'lucide-react';

type Language = 'en' | 'hi' | 'gu';

const instructions = {
  en: {
    title: 'Registration Steps',
    steps: [
      {
        icon: FileText,
        title: 'Fill Personal Details',
        description: 'Enter your name, class, roll number, and contact information accurately'
      },
      {
        icon: Camera,
        title: 'Upload Photo',
        description: 'Upload a passport-size photo with white background (JPEG/PNG, max 2MB)'
      },
      {
        icon: CheckCircle2,
        title: 'Review & Submit',
        description: 'Check your details in the live preview and submit for approval'
      },
      {
        icon: Upload,
        title: 'Get Your ID Card',
        description: 'Admin will review and approve. You\'ll receive your ID card within 2-3 days'
      }
    ],
    tips: [
      {
        type: 'info',
        text: 'All fields marked with * are mandatory'
      },
      {
        type: 'warning',
        text: 'Photo must have white background and clear face visibility'
      },
      {
        type: 'info',
        text: 'Double-check your roll number and class details'
      }
    ]
  },
  hi: {
    title: 'पंजीकरण चरण',
    steps: [
      {
        icon: FileText,
        title: 'व्यक्तिगत विवरण भरें',
        description: 'अपना नाम, कक्षा, रोल नंबर और संपर्क जानकारी सही-सही दर्ज करें'
      },
      {
        icon: Camera,
        title: 'फोटो अपलोड करें',
        description: 'सफेद पृष्ठभूमि के साथ पासपोर्ट आकार की फोटो अपलोड करें (JPEG/PNG, अधिकतम 2MB)'
      },
      {
        icon: CheckCircle2,
        title: 'समीक्षा और सबमिट करें',
        description: 'लाइव प्रीव्यू में अपना विवरण जांचें और अनुमोदन के लिए सबमिट करें'
      },
      {
        icon: Upload,
        title: 'अपना आईडी कार्ड प्राप्त करें',
        description: 'व्यवस्थापक समीक्षा करेगा और अनुमोदित करेगा। आपको 2-3 दिनों में आपका आईडी कार्ड मिल जाएगा'
      }
    ],
    tips: [
      {
        type: 'info',
        text: '* के साथ चिह्नित सभी फ़ील्ड अनिवार्य हैं'
      },
      {
        type: 'warning',
        text: 'फोटो में सफेद पृष्ठभूमि और चेहरे की स्पष्ट दृश्यता होनी चाहिए'
      },
      {
        type: 'info',
        text: 'अपना रोल नंबर और कक्षा विवरण दोबारा जांचें'
      }
    ]
  },
  gu: {
    title: 'નોંધણી પગલાં',
    steps: [
      {
        icon: FileText,
        title: 'વ્યક્તિગત વિગતો ભરો',
        description: 'તમારું નામ, વર્ગ, રોલ નંબર અને સંપર્ક માહિતી ચોક્કસ રીતે દાખલ કરો'
      },
      {
        icon: Camera,
        title: 'ફોટો અપલોડ કરો',
        description: 'સફેદ પૃષ્ઠભૂમિ સાથે પાસપોર્ટ-સાઇઝ ફોટો અપલોડ કરો (JPEG/PNG, મહત્તમ 2MB)'
      },
      {
        icon: CheckCircle2,
        title: 'સમીક્ષા અને સબમિટ કરો',
        description: 'લાઇવ પૂર્વાવલોકનમાં તમારી વિગતો તપાસો અને મંજૂરી માટે સબમિટ કરો'
      },
      {
        icon: Upload,
        title: 'તમારું ID કાર્ડ મેળવો',
        description: 'એડમિન સમીક્ષા કરશે અને મંજૂર કરશે. તમને 2-3 દિવસમાં તમારું ID કાર્ડ મળશે'
      }
    ],
    tips: [
      {
        type: 'info',
        text: '* સાથે ચિહ્નિત તમામ ફીલ્ડ ફરજિયાત છે'
      },
      {
        type: 'warning',
        text: 'ફોટોમાં સફેદ પૃષ્ઠભૂમિ અને ચહેરાની સ્પષ્ટ દૃશ્યતા હોવી જોઈએ'
      },
      {
        type: 'info',
        text: 'તમારા રોલ નંબર અને વર્ગની વિગતો બે વાર તપાસો'
      }
    ]
  }
};

export function InstructionsPanel() {
  const [language, setLanguage] = useState<Language>('en');
  const content = instructions[language];

  return (
    <div className="lg:sticky lg:top-8 h-fit">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Language Toggle */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white">
              <Languages className="w-5 h-5" />
              <span className="font-semibold">Language</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                language === 'hi'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('gu')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                language === 'gu'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ગુજરાતી
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {content.title}
          </h2>

          {/* Steps */}
          <div className="space-y-4 mb-6">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            {content.tips.map((tip, index) => (
              <div
                key={index}
                className={`flex gap-3 p-3 rounded-xl ${
                  tip.type === 'info'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                {tip.type === 'info' ? (
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-xs text-gray-700 leading-relaxed">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
