import React, { useState, useEffect, useRef } from 'react';
import { DocumentAnalysis } from '../types/document';
import { FileText, ArrowLeft, AlertCircle, Camera, UploadCloud, Sparkles } from 'lucide-react';

interface AnalyzeFlowProps {
  initialFile?: File | null;
  onAnalysisComplete: (doc: DocumentAnalysis) => void;
  onCancel: () => void;
}

export const AnalyzeFlow: React.FC<AnalyzeFlowProps> = ({
  initialFile,
  onAnalysisComplete,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Reading your document...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Generate thumbnail for image files
  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Loading steps progression
  useEffect(() => {
    if (!isAnalyzing) return;
    const steps = [
      'Reading your document...',
      'Finding important information...',
      'Preparing your action plan...',
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read text.'));
      reader.readAsText(file);
    });
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setLoadingStep('Reading your document...');

    try {
      const isImg = selectedFile.type.startsWith('image/');
      let imageBase64: string | undefined = undefined;
      let textContent: string | undefined = undefined;

      if (isImg) {
        imageBase64 = await readFileAsBase64(selectedFile);
      } else {
        try {
          const text = await readFileAsText(selectedFile);
          if (text && text.trim().length > 15) {
            textContent = text;
          } else {
            imageBase64 = await readFileAsBase64(selectedFile);
          }
        } catch {
          imageBase64 = await readFileAsBase64(selectedFile);
        }
      }

      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          mimeType: selectedFile.type || 'application/pdf',
          imageBase64,
          text: textContent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to analyze document.');
      }

      const data = await res.json();
      if (!data.success || !data.analysis) {
        throw new Error('Analysis completed but results could not be structured.');
      }

      const completeDoc: DocumentAnalysis = {
        id: `doc-${Date.now()}`,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        uploadDate: new Date().toISOString(),
        ...data.analysis,
        extractedText: textContent || `Extracted from: ${selectedFile.name}`,
        previewUrl: previewUrl || undefined,
      };

      onAnalysisComplete(completeDoc);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while analyzing the document. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-28 md:pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          disabled={isAnalyzing}
          className="ref-btn-secondary !p-2 !min-w-[40px] !min-h-[40px]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[#111111]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">Analyze Document</h1>
          <p className="text-xs text-[#6B6B6B]">Review your document before starting analysis</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 ref-card text-xs sm:text-sm text-[#111111] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Case 1: No file selected yet */}
      {!selectedFile && (
        <div className="ref-card p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F1F3F7] border border-[#E2E4E8] flex items-center justify-center mx-auto text-[#111111]">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#111111]">Select a document to begin</h2>
            <p className="text-xs text-[#6B6B6B] mt-1 max-w-xs mx-auto">
              Upload PDF, JPG, PNG, DOC, or take a photo on your device.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch justify-center gap-2.5 max-w-xs mx-auto pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="ref-btn-primary flex-1 text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>Choose Document</span>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="ref-btn-secondary flex-1 text-sm font-medium"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,application/pdf,image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
      )}

      {/* Case 2: File is selected -> Clean Document Preview Card */}
      {selectedFile && !isAnalyzing && (
        <div className="space-y-4">
          <div className="ref-card p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E2E4E8] shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F1F3F7] border border-[#E2E4E8] flex items-center justify-center text-[#111111] shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-base font-semibold text-[#111111] truncate max-w-full">
                  {selectedFile.name}
                </h3>
                <div className="text-xs text-[#6B6B6B] flex flex-wrap gap-2">
                  <span className="font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span>{selectedFile.type || 'Document'}</span>
                </div>
                <div className="text-[11px] text-[#6B6B6B] pt-1">
                  Ready to decode dates, requirements, and next steps with Gemini.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#F1F3F7] flex flex-col xs:flex-row items-stretch gap-2.5">
              <button
                onClick={handleStartAnalysis}
                className="ref-btn-dark flex-1 text-sm font-medium"
              >
                <span>Analyze with AI</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="ref-btn-secondary text-sm font-medium"
              >
                <span>Choose Different File</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,application/pdf,image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
      )}

      {/* Case 3: Analyzing Loading State */}
      {isAnalyzing && (
        <div className="ref-card p-8 sm:p-12 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#111111]">{loadingStep}</h2>
            <p className="text-xs text-[#6B6B6B]">ClearDoc AI is examining the full text and clauses.</p>
          </div>
        </div>
      )}
    </div>
  );
};
