import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [persona, setPersona] = useState('student');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const personas = [
    { id: 'student', label: 'Student', description: 'Simple, educational explanations', icon: '🎓' },
    { id: 'business', label: 'Business Owner', description: 'Focus on business impacts and obligations', icon: '💼' },
    { id: 'lawyer', label: 'Legal Professional', description: 'Technical legal analysis', icon: '⚖️' },
    { id: 'senior', label: 'Senior Citizen', description: 'Clear, patient explanations', icon: '👴' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a PDF or DOCX file');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Use real API service for backend integration
      const apiService = await import('../services/apiService');
      const result = await apiService.default.analyzeDocument(file, persona);
      
      // Navigate to analysis page - let the analysis page handle education loan routing
      navigate(`/analysis/${result.id}`);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload and process document');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">
                Legal Docs Demystifier
              </span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Legal Document</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload a PDF or DOCX file to get AI-powered analysis, risk assessment, and plain language summaries.
          </p>
          
          {/* Education Loan Highlight */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <AcademicCapIcon className="h-6 w-6 text-orange-600 mr-2" />
              <span className="text-orange-800 font-semibold">Education Loan Documents</span>
            </div>
            <p className="text-orange-700 text-sm">
              Upload education loan documents for specialized bank comparison and AI recommendations!
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* File Upload Area */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Select Document
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive
                  ? 'border-blue-600 bg-blue-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {file ? (
                <div className="space-y-4">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-gray-600">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Drop your document here, or click to select
                    </p>
                    <p className="text-gray-600">
                      Supports PDF and DOCX files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Persona Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Choose Your Perspective
            </label>
            <p className="text-gray-600 mb-6">
              Select how you'd like the document explained to you:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {personas.map((p) => (
                <label key={p.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="persona"
                    value={p.id}
                    checked={persona === p.id}
                    onChange={(e) => setPersona(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-lg transition-colors ${
                    persona === p.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{p.icon}</span>
                      <h3 className="text-lg font-semibold">{p.label}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing Document...
              </span>
            ) : (
              'Analyze Document'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
