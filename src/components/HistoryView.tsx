import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/document';
import { Search, FileText, Calendar, CheckSquare, Trash2, ArrowRight, Download } from 'lucide-react';
import { exportToPdf } from '../utils/export';

interface HistoryViewProps {
  documents: DocumentAnalysis[];
  onOpenDocument: (doc: DocumentAnalysis) => void;
  onDeleteDocument: (id: string) => void;
  onAnalyzeNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onAnalyzeNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const docTypes = Array.from(new Set(documents.map((d) => d.documentType).filter(Boolean)));

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.oneSentenceSummary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.shortSummary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || doc.documentType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E2E6EE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">Document History</h1>
          <p className="text-xs sm:text-sm text-[#5F6B7C] mt-1">
            Browse and manage all previously analyzed contracts, notices, and paperwork.
          </p>
        </div>

        <button
          onClick={onAnalyzeNew}
          className="ref-btn-primary w-full sm:w-auto text-xs sm:text-sm"
        >
          Analyze New Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#808E9F] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search documents by keyword or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm border border-[#D8DFEA] rounded-xl pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] text-[#111111] placeholder:text-[#808E9F] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {docTypes.length > 0 && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs sm:text-sm border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] text-[#111111] focus:outline-none focus:border-[#111111]"
          >
            <option value="ALL">All Document Types</option>
            {docTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <div className="ref-card p-8 sm:p-12 text-center border-dashed border-[#CFD5E1]">
          <div className="w-10 h-10 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center mx-auto mb-3 text-[#5F6B7C]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#111111]">No matching documents found</h3>
          <p className="text-xs text-[#5F6B7C] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedType !== 'ALL'
              ? 'Try changing your search terms or filters.'
              : 'You have not analyzed any documents yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const completedCount = doc.actionPlan?.filter((i) => i.completed).length || 0;
            const totalCount = doc.actionPlan?.length || 0;

            return (
              <div
                key={doc.id}
                className="ref-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#111111] truncate max-w-full">
                      {doc.fileName}
                    </span>
                    <span className="text-[10px] font-medium bg-[#F1F3F7] text-[#5F6B7C] border border-[#E2E6EE] px-2 py-0.5 rounded-md">
                      {doc.documentType}
                    </span>
                    {doc.isSample && (
                      <span className="text-[10px] font-medium bg-[#E2E7EF] text-[#111111] px-1.5 py-0.5 rounded-md">
                        Sample
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5F6B7C] line-clamp-2 leading-relaxed">
                    {doc.shortSummary || doc.oneSentenceSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#808E9F] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>

                    {totalCount > 0 && (
                      <span className="flex items-center gap-1 text-[#5F6B7C] font-medium">
                        <CheckSquare className="w-3.5 h-3.5 text-[#111111]" />
                        {completedCount} of {totalCount} tasks
                      </span>
                    )}

                    {doc.importantInformation?.deadlines?.length > 0 && (
                      <span className="text-[#111111] font-medium">
                        Due: {doc.importantInformation.deadlines[0].date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F3F7] shrink-0">
                  <button
                    onClick={() => exportToPdf(doc)}
                    title="Export PDF"
                    className="ref-btn-secondary !p-2 !min-w-[40px] !min-h-[40px]"
                  >
                    <Download className="w-4 h-4 text-[#111111]" />
                  </button>

                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="ref-btn-primary flex-1 sm:flex-initial text-xs !py-2 !px-3.5"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    title="Delete document"
                    className="ref-btn-secondary !p-2 !min-w-[40px] !min-h-[40px] text-[#808E9F] hover:text-[#111111]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
