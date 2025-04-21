import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, RefreshCw, FileUp, Link as LinkIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl: string | null;
  onImageChange: (imageUrl: string | null) => void;
  label?: string;
  required?: boolean;
  maxHeight?: number;
}

/**
 * Image Upload component
 *
 * This component allows users to:
 * 1. Enter an image URL directly
 * 2. Preview the current image
 * 3. Remove the current image
 * 4. Replace the current image with a new one
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  label = 'Image',
  required = false,
  maxHeight = 300
}) => {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl || '');
  const [isValidImage, setIsValidImage] = useState<boolean>(!!currentImageUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setError(null);

    // If URL is empty, clear the image
    if (!url) {
      setIsValidImage(false);
      onImageChange(null);
      return;
    }
  };

  // Handle image URL validation and update
  const handleValidateImage = () => {
    if (!imageUrl) {
      setIsValidImage(false);
      onImageChange(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create an image element to test if the URL is valid
    const img = new Image();
    img.onload = () => {
      setIsValidImage(true);
      setIsLoading(false);
      onImageChange(imageUrl);
    };
    img.onerror = () => {
      setIsValidImage(false);
      setIsLoading(false);
      setError('Invalid image URL. Please enter a valid image URL.');
    };
    img.src = imageUrl;
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    setImageUrl(fileUrl);

    // Validate the image
    const img = new Image();
    img.onload = () => {
      setIsValidImage(true);
      setIsLoading(false);
      onImageChange(fileUrl);
    };
    img.onerror = () => {
      setIsValidImage(false);
      setIsLoading(false);
      setError('Invalid image file. Please select a valid image.');
      URL.revokeObjectURL(fileUrl);
    };
    img.src = fileUrl;
  };

  // Trigger file input click
  const handleFileUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Handle image removal
  const handleRemoveImage = () => {
    setImageUrl('');
    setIsValidImage(false);
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image-url" className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <div className="space-y-4">
        {/* Upload mode toggle */}
        <div className="flex rounded-md overflow-hidden border border-[#7a4528]/50 w-fit">
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-3 py-1.5 flex items-center gap-1 text-sm ${uploadMode === 'url' ? 'bg-[#c9a52c] text-[#2d1e14]' : 'bg-[#3a2819] text-white hover:bg-[#4a3829]'} transition-colors`}
          >
            <LinkIcon size={14} /> URL
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-3 py-1.5 flex items-center gap-1 text-sm ${uploadMode === 'file' ? 'bg-[#c9a52c] text-[#2d1e14]' : 'bg-[#3a2819] text-white hover:bg-[#4a3829]'} transition-colors`}
          >
            <FileUp size={14} /> Upload
          </button>
        </div>

        {/* Image URL input */}
        {uploadMode === 'url' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <ImageIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="image-url"
                ref={inputRef}
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className={`w-full rounded-md bg-[#2d1e14] border ${error ? 'border-red-500' : 'border-[#7a4528]/50'} pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
              />
            </div>

            <button
              type="button"
              onClick={handleValidateImage}
              disabled={isLoading}
              className="px-3 py-2 rounded-md bg-[#3a2819] hover:bg-[#4a3829] text-white transition-colors flex items-center"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
            </button>
          </div>
        )}

        {/* File upload input */}
        {uploadMode === 'file' && (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleFileUploadClick}
              className={`border-2 border-dashed ${error ? 'border-red-500' : 'border-[#7a4528]/50'} rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#c9a52c] transition-colors`}
            >
              <FileUp size={24} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-300">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}

        {/* Image preview */}
        {isValidImage && imageUrl && (
          <div className="relative">
            <div
              className="relative w-full bg-[#1a1310] rounded-md overflow-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full object-contain"
                onError={() => {
                  setIsValidImage(false);
                  setError('Failed to load image. Please check the URL.');
                }}
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-900/80 hover:bg-red-800 rounded-full text-white transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">Scroll to view full image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
