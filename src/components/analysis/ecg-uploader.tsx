'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ECGUploaderProps {
  onUpload: (file: File, previewUrl: string) => void;
  isLoading?: boolean;
}

export function ECGUploader({ onUpload, isLoading = false }: ECGUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes('image')) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      onUpload(file, fileUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.includes('image')) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      onUpload(file, fileUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4 bg-white">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        
        {previewUrl ? (
          <div className="relative w-full h-64">
            <Image 
              src={previewUrl} 
              alt="ECG Preview" 
              fill 
              className="object-contain rounded" 
              priority
            />
          </div>
        ) : (
          <div className="py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Upload an ECG image by clicking or dragging and dropping
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG less than 5MB
            </p>
          </div>
        )}
      </div>
      
      {previewUrl && (
        <button 
          onClick={handleButtonClick}
          className="text-sm text-blue-600 hover:text-blue-800"
          disabled={isLoading}
        >
          Change image
        </button>
      )}
    </div>
  );
}