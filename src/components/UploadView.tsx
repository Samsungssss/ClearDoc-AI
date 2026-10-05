import React, { useState, useRef } from 'react';
import { DocumentAnalysis } from '../types/document';
import { UploadCloud, FileText, X, AlertCircle, ArrowRight, Camera, Sparkles } from 'lucide-react';

interface UploadViewProps {
  onAnalysisComplete: (analysis: DocumentAnalysis) => void;
  onTrySample: () => void;
}

interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'ready' | 'reading' | 'analyzing' | 'done' | 'error';
  errorMessage?: string;
  previewUrl?: string;
  base64Data?: string;
  extractedText?: string;
}

const SUPPORTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const UploadView: React.FC<UploadViewProps> = ({ onAnalysisComplete, onTrySample }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [fileQueue, setFileQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepMessage, setCurrentStepMessage] = useState('');
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndAddFiles = (files: FileList | File[]) => {
    setGeneralError(null);
    const newQueue: QueuedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (file.size > MAX_FILE_SIZE) {
        setGeneralError(`"${file.name}" exceeds 25MB limit. Please upload a smaller file.`);
        continue;
      }

      if (file.size === 0) {
        setGeneralError(`"${file.name}" is empty. Please upload a document with text.`);
        continue;
      }

      const isSupported = SUPPORTED_EXTENSIONS.some((supported) => ext === supported) ||
        file.type.startsWith('image/') ||
        file.type.includes('pdf') ||
        file.type.includes('word') ||
        file.type.includes('text');

      if (!isSupported) {
        setGeneralError(`"${file.name}" is not supported. Please upload PDF, JPG, PNG, DOC, or DOCX.`);
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

      newQueue.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        progress: 100,
        status: 'ready',
        previewUrl,
      });
    }

    if (newQueue.length > 0) {
      setFileQueue((prev) => [...prev, ...newQueue]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFileQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file contents.'));
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error('Failed to read file as text.'));
      reader.readAsText(file);
    });
  };

  const handleAnalyzeSelected = async (targetFile?: QueuedFile) => {
    const fileToAnalyze = targetFile || fileQueue[0];
    if (!fileToAnalyze) {
      setGeneralError('Please select or upload at least one document to analyze.');
      return;
    }

    setIsProcessing(true);
    setGeneralError(null);
    setCurrentStepMessage('Reading document content and layout...');

    try {
      const isImg = fileToAnalyze.file.type.startsWith('image/');
      let imageBase64: string | undefined = undefined;
      let textContent: string | undefined = undefined;

      if (isImg) {
        setCurrentStepMessage('Scanning image with Gemini AI...');
        imageBase64 = await readFileAsBase64(fileToAnalyze.file);
      } else {
        try {
          const rawText = await readFileAsText(fileToAnalyze.file);
          if (rawText && rawText.trim().length > 20) {
            textContent = rawText;
          } else {
            imageBase64 = await readFileAsBase64(fileToAnalyze.file);
          }
        } catch {
          imageBase64 = await readFileAsBase64(fileToAnalyze.file);
        }
      }

      setCurrentStepMessage('Extracting deadlines, fees, obligations, and terminology...');

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileToAnalyze.name,
          mimeType: fileToAnalyze.type || 'application/pdf',
          imageBase64,
          text: textContent,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server returned an error while analyzing document.');
      }

      setCurrentStepMessage('Formatting plain-English explanation and action checklist...');
      const data = await response.json();

      if (!data.success || !data.analysis) {
        throw new Error('Analysis completed but results could not be parsed.');
      }

      const completeDoc: DocumentAnalysis = {
        id: `doc-${Date.now()}`,
        fileName: fileToAnalyze.name,
        fileSize: fileToAnalyze.size,
        fileType: fileToAnalyze.type,
        uploadDate: new Date().toISOString(),
        ...data.analysis,
        extractedText: textContent || `Extracted from uploaded file: ${fileToAnalyze.name}`,
        previewUrl: fileToAnalyze.previewUrl,
      };

      onAnalysisComplete(completeDoc);
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setGeneralError(err.message || 'We were unable to analyze this document. Please check the file or try again.');
    } finally {
      setIsProcessing(false);
      setCurrentStepMessage('');
    }
  };

  const handleAnalyzePasted = async () => {
    if (!pastedText || pastedText.trim().length < 30) {
      setGeneralError('Please enter at least a few sentences of document text to analyze.');
      return;
    }

    setIsProcessing(true);
    setGeneralError(null);
    setCurrentStepMessage('Reading document text and structure...');

    try {
      const fileName = pastedTitle.trim() ? `${pastedTitle.trim()}.txt` : 'Pasted_Document.txt';

      setCurrentStepMessage('Gemini AI analyzing clauses, deadlines, and requirements...');
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          text: pastedText,
          mimeType: 'text/plain',
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to analyze text.');
      }

      setCurrentStepMessage('Building simple explanation and action plan...');
      const data = await response.json();

      const completeDoc: DocumentAnalysis = {
        id: `doc-${Date.now()}`,
        fileName,
        fileSize: new Blob([pastedText]).size,
        fileType: 'text/plain',
        uploadDate: new Date().toISOString(),
        ...data.analysis,
        extractedText: pastedText,
      };

      onAnalysisComplete(completeDoc);
    } catch (err: any) {
      console.error('Text analysis error:', err);
      setGeneralError(err.message || 'Analysis failed. Please verify the text content.');
    } finally {
      setIsProcessing(false);
      setCurrentStepMessage('');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">Analyze a Document</h1>
        <p className="text-xs sm:text-sm text-[#5F6B7C] mt-1 leading-relaxed">
          Upload any official letter, contract, notice, or form. Gemini will decode the language, surface critical deadlines, and create your next steps.
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex bg-[#E2E7EF] p-1 rounded-xl mb-6 max-w-sm">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all min-h-[40px] ${
            activeTab === 'upload'
              ? 'bg-[#FFFFFF] text-[#111111] shadow-2xs'
              : 'text-[#5F6B7C] hover:text-[#111111]'
          }`}
        >
          Upload File or Photo
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all min-h-[40px] ${
            activeTab === 'paste'
              ? 'bg-[#FFFFFF] text-[#111111] shadow-2xs'
              : 'text-[#5F6B7C] hover:text-[#111111]'
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Error Alert */}
      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-[#FFFFFF] border border-[#CFD5E1] flex items-start gap-3 text-[#111111] text-xs sm:text-sm shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
          <div className="flex-1">{generalError}</div>
          <button
            onClick={() => setGeneralError(null)}
            className="text-[#808E9F] hover:text-[#111111] p-1 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 1: Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`ref-card p-6 sm:p-10 text-center transition-all ${
              isDragging ? 'border-[#111111] bg-[#F8FAFC]' : 'border-[#CFD5E1]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center mx-auto mb-3.5 text-[#111111]">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-base font-semibold text-[#111111]">
              Drag and drop your document here
            </h3>
            <p className="text-xs text-[#5F6B7C] mt-1.5 max-w-sm mx-auto">
              Supports PDF, photos (JPG, PNG), DOC, DOCX up to 25MB.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col xs:flex-row items-stretch justify-center gap-3 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ref-btn-primary w-full xs:w-auto text-xs sm:text-sm"
              >
                Browse Files
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="ref-btn-secondary w-full xs:w-auto text-xs sm:text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,application/pdf,image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Quick Sample Notice Prompt */}
          <div className="ref-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-[#5F6B7C]">
              <span className="font-semibold text-[#111111]">Don't have a file ready?</span> Test ClearDoc AI with our realistic municipal housing code notice.
            </div>
            <button
              onClick={onTrySample}
              className="ref-btn-secondary !text-xs !py-2 !px-3 shrink-0"
            >
              Load Sample Notice
            </button>
          </div>

          {/* Queued Files List */}
          {fileQueue.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6B7C]">
                  Ready to Analyze ({fileQueue.length})
                </h3>
                <button
                  onClick={() => setFileQueue([])}
                  className="text-xs text-[#5F6B7C] hover:text-[#111111] underline"
                >
                  Clear queue
                </button>
              </div>

              <div className="space-y-2.5">
                {fileQueue.map((item) => (
                  <div
                    key={item.id}
                    className="ref-card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt="thumbnail"
                          className="w-10 h-10 object-cover rounded-lg border border-[#E2E6EE] shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center text-[#111111] shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-[#111111] truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#808E9F]">
                          {formatFileSize(item.size)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F3F7]">
                      <button
                        onClick={() => handleAnalyzeSelected(item)}
                        disabled={isProcessing}
                        className="ref-btn-primary flex-1 sm:flex-initial text-xs !py-2 !px-4"
                      >
                        Analyze Document
                      </button>

                      <button
                        onClick={() => removeFile(item.id)}
                        disabled={isProcessing}
                        className="ref-btn-secondary !p-2 !min-w-[40px] !min-h-[40px] text-[#808E9F] hover:text-[#111111]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Paste */}
      {activeTab === 'paste' && (
        <div className="ref-card p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1.5">
              Document Title / Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Commercial Lease Section 14, Housing Notice"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              className="w-full text-xs sm:text-sm border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 bg-[#FFFFFF] text-[#111111] placeholder:text-[#808E9F] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1.5">
              Document Text
            </label>
            <textarea
              rows={10}
              placeholder="Paste contract clauses, notice text, letter paragraphs, or legal stipulations here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full text-xs sm:text-sm border border-[#D8DFEA] rounded-xl p-3.5 font-mono text-xs bg-[#FFFFFF] text-[#111111] placeholder:text-[#808E9F] focus:outline-none focus:border-[#111111] leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#808E9F]">
              {pastedText.length} characters
            </span>

            <button
              onClick={handleAnalyzePasted}
              disabled={isProcessing || pastedText.trim().length < 30}
              className="ref-btn-primary w-full sm:w-auto text-xs sm:text-sm"
            >
              <span>Analyze Text</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-[#111111]/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ref-card p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="w-9 h-9 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#111111]">
                Analyzing Document
              </h3>
              <p className="text-xs text-[#5F6B7C]">
                Gemini AI Multimodal Document Engine
              </p>
            </div>

            <div className="bg-[#F1F3F7] border border-[#E2E6EE] rounded-xl p-3 text-xs text-[#111111] font-medium leading-relaxed">
              {currentStepMessage || 'Reading document structure and terms...'}
            </div>

            <div className="text-[11px] text-[#808E9F]">
              Extracting deadlines, fee amounts, and plain-English meanings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
