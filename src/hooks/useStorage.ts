import { useState } from 'react';
import { compressImageToBase64 } from '../utils/imageUtils';

export function useStorage(folderPath: string) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Convert file to base64 with compression
  const uploadFile = (file: File) => {
    setLoading(true);
    setError(null);
    
    return new Promise<string>((resolve, reject) => {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        // Use compression for images
        setProgress(10);
        
        compressImageToBase64(file)
          .then(base64String => {
            setProgress(100);
            setUrl(base64String);
            setLoading(false);
            console.log('Image successfully compressed and converted to base64');
            resolve(base64String);
          })
          .catch(err => {
            console.error('Error compressing image:', err);
            setError('Error compressing image');
            setLoading(false);
            reject(err);
          });
      } else {
        // For non-image files, use standard base64 conversion
        const reader = new FileReader();
        
        reader.onloadstart = () => {
          setProgress(0);
        };
        
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress(percentage);
          }
        };
        
        reader.onerror = () => {
          setError('Error reading file');
          setLoading(false);
          reject('Error reading file');
        };
        
        reader.onload = () => {
          try {
            const base64String = reader.result as string;
            setUrl(base64String);
            setLoading(false);
            resolve(base64String);
          } catch (err) {
            setError((err as Error).message);
            setLoading(false);
            reject(err);
          }
        };
        
        // Read file as data URL (base64)
        reader.readAsDataURL(file);
      }
    });
  };

  // Delete file (for API consistency, just returns true since base64 doesn't need deletion)
  const deleteFile = async (fileUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // No actual deletion needed for base64
      setLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return false;
    }
  };

  return { progress, url, error, loading, uploadFile, deleteFile };
}