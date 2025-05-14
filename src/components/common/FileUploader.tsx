import React, { useState } from 'react';
import { Upload, XCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from 'reactstrap';

interface FileUploaderProps {
  files: File[];
  onUpload: (files: FileList) => void;
  onRemove: (file: File) => void;
  onSubmit: () => void;
  status: 'idle' | 'submitting' | 'success' | 'error';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, onUpload, onRemove, onSubmit, status }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragenter');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) onUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Drag and drop files here</p>
            <p className="text-sm text-gray-500">PDF, DOCX, PPTX, ZIP (max 100MB)</p>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            className="hidden"
            id="file-upload"
            disabled={status === 'submitting'}
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50"
          >
            Browse Files
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(file)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={onSubmit}
        className="w-full"
        variant="default"
        disabled={files.length === 0 || status === 'submitting'}
      >
        Submit Assignment
      </Button>

      {status === 'success' && (
        <div className="mt-4 text-emerald-600 text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Assignment submitted successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 text-red-600 text-sm flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Error submitting assignment. Please try again.
        </div>
      )}
    </div>
  );
};