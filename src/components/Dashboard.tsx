import React from 'react';
import { DocumentAnalysis } from '../types/document';
import { Plus, ArrowRight, Clock, CheckSquare, Calendar, Trash2, FileText, Sparkles } from 'lucide-react';

interface DashboardProps {
  documents: DocumentAnalysis[];
  onAnalyzeNew: () => void;
  onOpenDocument: (doc: DocumentAnalysis) => void;
  onDeleteDocument: (id: string) => void;
  onTrySample: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onAnalyzeNew,
  onOpenDocument,
  onDeleteDocument,
  onTrySample,
}) => {
  const totalDocs = documents.length;
  const totalTasks = documents.reduce((acc, d) => acc + (d.actionPlan?.length || 0), 0);
  const completedTasks = documents.reduce(
    (acc, d) => acc + (d.actionPlan?.filter((i) => i.completed).length || 0),
    0
  );
  const totalDeadlines = documents.reduce(
    (acc, d) => acc + (d.importantInformation?.deadlines?.length || 0),
    0
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
      {/* Top Greeting Block */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
          Good to see you.
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#5F6B7C]">
          Analyze a document and turn complexity into clear next steps.
        </p>

        {/* Large Upload / Analyze Launcher Card */}
        <div className="mt-5 ref-card p-5 sm:p-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-semibold text-[#111111]">
              Analyze a new document or notice
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B7C] max-w-lg leading-relaxed">
              Upload PDF, photo, or document text. ClearDoc AI extracts deadlines, translates terminology, and builds your custom checklist.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch gap-2.5 sm:shrink-0">
            <button
              onClick={onAnalyzeNew}
              className="ref-btn-primary w-full xs:w-auto text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Analyze a Document</span>
            </button>

            <button
              onClick={onTrySample}
              className="ref-btn-secondary w-full xs:w-auto text-sm font-medium"
            >
              <span>Try Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="ref-card p-4">
          <div className="text-[10px] font-medium text-[#5F6B7C] uppercase tracking-wider">
            Analyzed Documents
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#111111] mt-1">{totalDocs}</div>
          <div className="text-[11px] text-[#808E9F] mt-0.5">Stored in local workspace</div>
        </div>

        <div className="ref-card p-4">
          <div className="text-[10px] font-medium text-[#5F6B7C] uppercase tracking-wider">
            Checklist Progress
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#111111] mt-1">
            {completedTasks} / {totalTasks}
          </div>
          <div className="text-[11px] text-[#808E9F] mt-0.5">
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% steps completed` : 'No steps yet'}
          </div>
        </div>

        <div className="ref-card p-4">
          <div className="text-[10px] font-medium text-[#5F6B7C] uppercase tracking-wider">
            Active Deadlines
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#111111] mt-1">{totalDeadlines}</div>
          <div className="text-[11px] text-[#808E9F] mt-0.5">Extracted from paperwork</div>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-semibold text-[#111111]">Recent Documents</h2>
          {documents.length > 0 && (
            <span className="text-xs text-[#5F6B7C]">{documents.length} saved</span>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="ref-card p-8 sm:p-12 text-center border-dashed border-[#CFD5E1]">
            <div className="w-10 h-10 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center mx-auto mb-3 text-[#5F6B7C]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#111111]">No documents analyzed yet</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 max-w-sm mx-auto">
              Upload your first legal notice, invoice, or lease, or load our municipal housing sample to explore the full action plan.
            </p>
            <div className="mt-5 flex flex-col xs:flex-row items-center justify-center gap-3">
              <button
                onClick={onAnalyzeNew}
                className="ref-btn-primary w-full xs:w-auto text-xs"
              >
                Upload Document
              </button>
              <button
                onClick={onTrySample}
                className="ref-btn-secondary w-full xs:w-auto text-xs"
              >
                Load Sample Notice
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const completedCount = doc.actionPlan?.filter((i) => i.completed).length || 0;
              const totalCount = doc.actionPlan?.length || 0;

              return (
                <div
                  key={doc.id}
                  className="ref-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
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
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>

                      {totalCount > 0 && (
                        <span className="flex items-center gap-1 text-[#5F6B7C] font-medium">
                          <CheckSquare className="w-3.5 h-3.5 text-[#111111]" />
                          {completedCount} of {totalCount} tasks
                        </span>
                      )}

                      {doc.importantInformation?.deadlines?.length > 0 && (
                        <span className="flex items-center gap-1 text-[#111111] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                          Due: {doc.importantInformation.deadlines[0].date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F3F7] shrink-0">
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="ref-btn-primary flex-1 sm:flex-initial text-xs !py-2 !px-3.5"
                    >
                      <span>Open Analysis</span>
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
    </div>
  );
};
