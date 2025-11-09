import React, { useState, useRef } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../i18n/translations';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square' | 'rounded';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  className = '',
  size = 'md',
  shape = 'circle',
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        
        const response = await fetch('/api/auth/upload-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ imageData }),
        });

        const result = await response.json();

        if (response.ok) {
          onImageUpload(result.profilePicture);
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Image Display */}
      <div
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]} 
          bg-gray-200 
          border-2 
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
          ${uploading ? 'opacity-50' : 'hover:border-gray-400'} 
          cursor-pointer 
          overflow-hidden 
          transition-all 
          duration-200 
          flex 
          items-center 
          justify-center
          relative
          group
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
          </>
        ) : (
          <div className="text-center">
            <svg 
              className="w-8 h-8 text-gray-400 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p className="text-xs text-gray-500">
              {size === 'sm' ? '+' : t.profile.uploadImage}
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentImage && onImageRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageRemove();
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          title={t.profile.removeImage}
        >
          ×
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload instructions */}
      {!currentImage && size !== 'sm' && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Click or drag image here
        </p>
      )}
    </div>
  );
};

export default ImageUpload;