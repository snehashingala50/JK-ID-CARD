import { useState, useRef } from 'react';
import { Upload, Camera, X, Check, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropHint, setShowCropHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file (JPEG or PNG)';
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return 'File size must be less than 2MB';
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
      onPhotoChange(result);
      setShowCropHint(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onPhotoChange(null);
    setError(null);
    setShowCropHint(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Student Photo <span className="text-red-500">*</span>
      </label>

      {!photo ? (
        <>
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
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

            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                error ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {error ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-600" />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {isDragging ? 'Drop photo here' : 'Upload Student Photo'}
                </p>
                <p className="text-sm text-gray-600">
                  Drag & drop or click to browse
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>JPEG, PNG</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>Max 2MB</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 text-sm mb-2 flex items-center gap-2">
              <span>💡</span> Photo Requirements
            </h4>
            <ul className="space-y-1 text-xs text-amber-800">
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>White or light background preferred</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Face should be clearly visible</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Formal attire recommended</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Recent photograph (within 6 months)</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          {/* Photo Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-6">
              {/* Circular Preview */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={photo}
                    alt="Student preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Info & Actions */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Photo Uploaded Successfully
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your photo looks great! You can replace it if needed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Replace Photo
                  </button>
                  <button
                    onClick={handleRemove}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remove
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

            {showCropHint && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> The photo will be automatically cropped to fit the ID card format. 
                  Make sure your face is centered in the image.
                </p>
              </div>
            )}
          </div>

          {/* Rectangle Preview */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                ID Card Preview
              </h4>
              <span className="text-xs text-gray-500">Actual size on card</span>
            </div>
            <div className="flex justify-center">
              <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                <img
                  src={photo}
                  alt="ID card preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
