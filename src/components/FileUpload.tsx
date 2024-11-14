import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']
    },
    maxFiles: 1,
    disabled,
    maxSize: 10485760 // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out 
        ${disabled 
          ? 'cursor-not-allowed bg-gray-50 border-gray-200' 
          : isDragActive 
            ? 'border-blue-500 bg-blue-50 cursor-pointer' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isDragActive ? (
          <File className="w-12 h-12 text-blue-500" />
        ) : (
          <Upload className={`w-12 h-12 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        )}
        <div className="text-center">
          <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {isDragActive
              ? "Déposez le fichier ici..."
              : "Glissez et déposez une facture"}
          </p>
          <p className={`text-sm mt-1 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            {disabled 
              ? "Traitement en cours..."
              : "ou cliquez pour sélectionner un fichier (max 10MB)"}
          </p>
        </div>
      </div>
    </div>
  );
}