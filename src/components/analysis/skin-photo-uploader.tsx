'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useImageUpload } from '@/lib/hooks/use-image-upload';

interface SkinPhotoUploaderProps {
  onUploadComplete: (base64Image: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function SkinPhotoUploader({ 
  onUploadComplete, 
  onReset, 
  isLoading 
}: SkinPhotoUploaderProps) {
  const { processImage } = useImageUpload();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const processFile = async (file: File) => {
    try {
      setError('');
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size exceeds 10MB. Please upload a smaller image.');
        return;
      }
      
      // Process and resize the image
      const result = await processImage(file);
      setPreviewUrl(result.preview);
      onUploadComplete(result.base64);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process the image. Please try again.');
    }
  };

  const handleReset = () => {
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Skin Image</h3>
        
        {!previewUrl ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragActive 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
              }`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <svg
                className="h-12 w-12 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-600">
                  <span>Upload a skin image</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Skin condition preview"
              className="w-full rounded-lg border border-gray-200"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
            {!isLoading && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-center text-red-500 text-sm">
            {error}
          </div>
        )}
        
        {previewUrl && (
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              For better results:
            </div>
            <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
              <li>Ensure the affected skin area is clearly visible and well-lit</li>
              <li>Avoid blurry or dark images</li>
              <li>Include only the skin condition area, not full face/body if possible</li>
              <li>For scale reference, include a ruler or coin if relevant</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}