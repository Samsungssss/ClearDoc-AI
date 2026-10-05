import React, { useState, useRef } from 'react';
import { DocumentAnalysis } from '../types/document';
import { BottomSheet } from './BottomSheet';
import {
  UploadCloud,
  FileText,
  Camera,
  MoreVertical,
  Calendar,
  ArrowRight,
  Download,
  Copy,
  Trash2,
  Check,
  Plus
} from 'lucide-react';
import { exportToPdf, exportToTxt, copyToClipboard } from '../utils/export';

interface HomeScreenProps {
  documents: DocumentAnalysis[];
  onFileSelected: (file: File) => void;
  onOpenDocument: (doc: DocumentAnalysis) => void;
  onDeleteDocument: (id: string) => void;
  onTrySample: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  documents,
  onFileSelected,
  onOpenDocument,
  onDeleteDocument,
  onTrySample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocForSheet, setSelectedDocForSheet] = useState<DocumentAnalysis | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const openDocumentOptions = (e: React.MouseEvent, doc: DocumentAnalysis) => {
    e.stopPropagation();
    setSelectedDocForSheet(doc);
    setIsSheetOpen(true);
  };

  const handleCopy = async () => {
    if (selectedDocForSheet) {
      const ok = await copyToClipboard(selectedDocForSheet);
      if (ok) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleDelete = () => {
    if (selectedDocForSheet) {
      onDeleteDocument(selectedDocForSheet.id);
      setIsSheetOpen(false);
      setSelectedDocForSheet(null);
    }
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-5 sm:px-6 pt-7 pb-32 space-y-9">
      {/* Brand Header — Minimal & Calm */}
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#000000]">
          ClearDoc
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6F6F]">
          Let's make sense of something.
        </p>
      </header>

      {/* Main Focus: Analyze a Document Area */}
      <section className="space-y-3">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-[#F5F5F5] rounded-[24px] border transition-all p-7 sm:p-9 text-center space-y-5 ${
            isDragging
              ? 'border-[#000000] bg-[#EEEEEE]'
              : 'border-[#EEEEEE] hover:border-[#D9D9D9]'
          }`}
        >
          <div className="w-12 h-12 rounded-[16px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center justify-center mx-auto text-[#171717] shadow-xs">
            <UploadCloud className="w-5 h-5 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-semibold text-[#171717] tracking-tight">
              Analyze a document
            </h2>
            <p className="text-xs text-[#6F6F6F] max-w-xs mx-auto leading-relaxed">
              Drop a contract, official notice, bill, or form here
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col xs:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full xs:w-auto flex-1 bg-[#171717] hover:bg-[#000000] text-[#FFFFFF] text-xs font-medium py-3 px-5 rounded-[14px] min-h-[44px] flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Choose Document</span>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full xs:w-auto flex-1 bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#171717] border border-[#EEEEEE] text-xs font-medium py-3 px-4 rounded-[14px] min-h-[44px] flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-4 h-4 text-[#6F6F6F]" />
              <span>Take Photo</span>
            </button>
          </div>

          {/* Subtle Secondary option: Sample notice */}
          <div className="pt-1">
            <button
              onClick={onTrySample}
              className="text-[11px] text-[#6F6F6F] hover:text-[#000000] underline underline-offset-2 transition-colors"
            >
              Or try a sample municipal notice
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,application/pdf,image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </section>

      {/* Recent Documents Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest text-[#6F6F6F] font-medium">
            Recent documents
          </h3>
          {documents.length > 0 && (
            <span className="text-xs text-[#A6A6A6]">{documents.length}</span>
          )}
        </div>

        {documents.length === 0 ? (
          /* Human Empty State */
          <div className="bg-[#F5F5F5] border border-[#EEEEEE] rounded-[20px] p-7 text-center space-y-2">
            <h4 className="text-sm font-semibold text-[#171717]">No documents yet</h4>
            <p className="text-xs text-[#6F6F6F] max-w-xs mx-auto leading-relaxed">
              Your analyzed documents will appear here.
            </p>
            <div className="pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717] hover:underline p-1"
              >
                <span>Analyze a document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Clean Row List */
          <div className="divide-y divide-[#EEEEEE] border-t border-b border-[#EEEEEE]">
            {documents.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc)}
                className="py-3.5 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#F5F5F5]/60 transition-colors -mx-2 px-2 rounded-[14px]"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center shrink-0 text-[#171717] mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#171717] truncate">
                        {doc.fileName}
                      </span>
                    </div>

                    <p className="text-xs text-[#6F6F6F] line-clamp-1 leading-normal">
                      {doc.oneSentenceSummary || doc.shortSummary}
                    </p>

                    <div className="text-[11px] text-[#A6A6A6]">
                      {new Date(doc.uploadDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' • '}
                      {doc.documentType}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <button
                    onClick={(e) => openDocumentOptions(e, doc)}
                    className="w-9 h-9 rounded-[12px] flex items-center justify-center text-[#6F6F6F] hover:text-[#171717] hover:bg-[#EEEEEE] transition-colors"
                    aria-label="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Sheet for Document Options */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedDocForSheet?.fileName || 'Document Options'}
        subtitle={selectedDocForSheet?.documentType}
      >
        {selectedDocForSheet && (
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                onOpenDocument(selectedDocForSheet);
                setIsSheetOpen(false);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#171717]" />
                <span>Open Analysis</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6F6F6F]" />
            </button>

            <button
              onClick={() => {
                exportToPdf(selectedDocForSheet);
                setIsSheetOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <Download className="w-4 h-4 text-[#6F6F6F]" />
              <span>Export as PDF</span>
            </button>

            <button
              onClick={() => {
                exportToTxt(selectedDocForSheet);
                setIsSheetOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <Download className="w-4 h-4 text-[#6F6F6F]" />
              <span>Export as Text (.txt)</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              {copySuccess ? <Check className="w-4 h-4 text-[#171717]" /> : <Copy className="w-4 h-4 text-[#6F6F6F]" />}
              <span>{copySuccess ? 'Copied to Clipboard' : 'Copy Summary Report'}</span>
            </button>

            <div className="pt-2 border-t border-[#EEEEEE]">
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
              >
                <Trash2 className="w-4 h-4 text-[#6F6F6F]" />
                <span>Delete Document</span>
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
