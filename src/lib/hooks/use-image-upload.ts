import { useState } from 'react';

interface ProcessedImage {
  base64: string;
  preview: string;
  width: number;
  height: number;
}

export function useImageUpload() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processImage = async (file: File): Promise<ProcessedImage> => {
    setIsProcessing(true);
    
    try {
      // Create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      
      // Read the file as base64
      const base64 = await fileToBase64(file);
      
      // Get image dimensions
      const dimensions = await getImageDimensions(previewUrl);
      
      // Return processed image data
      return {
        base64: base64.split(',')[1], // Remove data URL prefix if present
        preview: previewUrl,
        width: dimensions.width,
        height: dimensions.height
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Helper function to get image dimensions
  const getImageDimensions = (url: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        // Default dimensions if image fails to load
        resolve({
          width: 0,
          height: 0
        });
      };
      
      img.src = url;
    });
  };

  return {
    processImage,
    isProcessing
  };
}