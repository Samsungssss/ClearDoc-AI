import React, { useState } from 'react';
import { Shield, Lock, Trash2, CheckCircle2 } from 'lucide-react';

interface PrivacyViewProps {
  onClearAllData: () => void;
  documentCount: number;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onClearAllData, documentCount }) => {
  const [cleared, setCleared] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    onClearAllData();
    setShowConfirm(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
      {/* Title */}
      <div className="mb-6 pb-5 border-b border-[#E2E6EE]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-[#1E232B] flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">Privacy & Data Governance</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#5F6B7C]">
          How ClearDoc AI handles sensitive legal, financial, and personal paperwork.
        </p>
      </div>

      {cleared && (
        <div className="mb-6 p-4 rounded-xl ref-card text-xs sm:text-sm text-[#111111] flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#111111]" />
          <span>All stored documents, checklists, and histories have been wiped from your browser storage.</span>
        </div>
      )}

      {/* Core Privacy Principles */}
      <div className="space-y-4 sm:space-y-5">
        <div className="ref-card p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
            <Lock className="w-4 h-4 text-[#5F6B7C]" />
            <span>Documents Contain Sensitive Information</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6B7C] leading-relaxed">
            Contracts, medical bills, court notices, and government letters routinely contain personally identifiable information (PII), banking details, or case numbers. We treat all document contents as private and confidential by default.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="ref-card p-4 sm:p-5 space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C]">
              No Public Exposure
            </h3>
            <p className="text-xs text-[#5F6B7C] leading-relaxed">
              Your uploaded documents are never exposed to public search engines, published to public links, or shared with other users.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5 space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C]">
              Browser Local Workspace
            </h3>
            <p className="text-xs text-[#5F6B7C] leading-relaxed">
              Analysis summaries, action plan checkboxes, and chat threads are stored exclusively in your local browser storage (<code className="font-mono text-[#111111]">localStorage</code>).
            </p>
          </div>
        </div>

        <div className="ref-card p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-semibold text-[#111111]">
            Real Data Deletion Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6B7C] leading-relaxed">
            We do not make false claims about permanent deletion. When you delete a document in ClearDoc AI, it is immediately and permanently removed from your device. You can purge all documents at any time below.
          </p>

          <div className="pt-3.5 border-t border-[#F1F3F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#5F6B7C]">
              Currently storing <span className="font-semibold text-[#111111]">{documentCount}</span> document{documentCount === 1 ? '' : 's'} locally.
            </div>

            {showConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="ref-btn-primary text-xs"
                >
                  Yes, Delete All Data
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="ref-btn-secondary text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={documentCount === 0}
                className="ref-btn-secondary text-xs"
              >
                <Trash2 className="w-4 h-4 text-[#808E9F]" />
                <span>Clear All Stored Documents</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 ref-card text-xs text-[#5F6B7C] leading-relaxed bg-[#FFFFFF]">
          <span className="font-semibold text-[#111111]">Best Practice: </span>
          If your document contains sensitive government numbers (such as SSN or Passport number), you can redact or black them out before uploading without affecting the AI's ability to extract deadlines and obligations.
        </div>
      </div>
    </div>
  );
};
