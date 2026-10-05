import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/document';
import { BottomSheet } from './BottomSheet';
import {
  Search,
  FileText,
  MoreVertical,
  ArrowRight,
  Download,
  Copy,
  Trash2,
  Check,
  Plus
} from 'lucide-react';
import { exportToPdf, exportToTxt, copyToClipboard } from '../utils/export';

interface DocumentsScreenProps {
  documents: DocumentAnalysis[];
  onOpenDocument: (doc: DocumentAnalysis) => void;
  onDeleteDocument: (id: string) => void;
  onNavigateToAnalyze: () => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onNavigateToAnalyze,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForSheet, setSelectedDocForSheet] = useState<DocumentAnalysis | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.fileName.toLowerCase().includes(q) ||
      doc.documentType.toLowerCase().includes(q) ||
      doc.oneSentenceSummary?.toLowerCase().includes(q) ||
      doc.shortSummary?.toLowerCase().includes(q)
    );
  });

  const handleOpenSheet = (e: React.MouseEvent, doc: DocumentAnalysis) => {
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
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-5 sm:px-6 pt-7 pb-36 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#000000]">
            Documents
          </h1>
          <p className="text-xs text-[#6F6F6F] mt-0.5">
            {documents.length} analyzed {documents.length === 1 ? 'file' : 'files'}
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="bg-[#171717] hover:bg-[#000000] text-[#FFFFFF] text-xs font-medium py-2.5 px-4 rounded-[14px] min-h-[40px] flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Clean Minimal Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F5F5F5] hover:bg-[#EEEEEE] focus:bg-[#FFFFFF] border border-[#EEEEEE] focus:border-[#000000] text-xs sm:text-sm text-[#171717] placeholder-[#A6A6A6] rounded-[16px] py-3 pl-10 pr-4 outline-none transition-all"
        />
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-[#F5F5F5] border border-[#EEEEEE] rounded-[20px] p-8 text-center space-y-2 mt-4">
          <h3 className="text-sm font-semibold text-[#171717]">
            {searchQuery ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-xs text-[#6F6F6F] max-w-xs mx-auto leading-relaxed">
            {searchQuery
              ? 'Try searching with a different filename or keyword.'
              : 'Your analyzed documents will appear here.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EEEEEE] border-t border-b border-[#EEEEEE]">
          {filteredDocs.map((doc) => (
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
                  onClick={(e) => handleOpenSheet(e, doc)}
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

      {/* Document Action Bottom Sheet */}
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
              <span>{copySuccess ? 'Copied' : 'Copy Summary Report'}</span>
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
