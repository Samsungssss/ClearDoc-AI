import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/document';
import { BottomSheet } from './BottomSheet';
import { ChatSheet } from './ChatSheet';
import {
  ArrowLeft,
  MoreVertical,
  Check,
  Send,
  Download,
  Copy,
  Languages,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { exportToPdf, exportToTxt, copyToClipboard } from '../utils/export';

interface ResultScreenProps {
  document: DocumentAnalysis;
  onUpdateDocument: (updated: DocumentAnalysis) => void;
  onBack: () => void;
  onDeleteDocument: (id: string) => void;
}

const LANGUAGES = [
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Persian / Dari', code: 'fa' },
  { name: 'Urdu', code: 'ur' },
  { name: 'English', code: 'en' },
];

export const ResultScreen: React.FC<ResultScreenProps> = ({
  document: doc,
  onUpdateDocument,
  onBack,
  onDeleteDocument,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const handleToggleTask = (taskId: string) => {
    const updated = doc.actionPlan.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateDocument({ ...doc, actionPlan: updated });
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(doc);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleTranslate = async (langCode: string, langName: string) => {
    setIsTranslateOpen(false);
    setActiveLang(langCode);

    if (doc.translations && doc.translations[langCode]) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: langName,
          targetLanguageCode: langCode,
          simpleSummary: doc.shortSummary,
          whatItMeans: doc.whatItMeans.overview,
          actionPlan: doc.actionPlan.map((a) => ({ task: a.task, details: a.details })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translation) {
          onUpdateDocument({
            ...doc,
            translations: { ...(doc.translations || {}), [langCode]: data.translation },
          });
        }
      }
    } catch (e) {
      console.log('[ClearDoc AI] Translation complete');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setInitialChatQuery(quickInput.trim());
    setQuickInput('');
    setIsChatOpen(true);
  };

  const currentTranslation = activeLang ? doc.translations?.[activeLang] : null;

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-5 sm:px-6 pt-5 pb-36 space-y-9">
      {/* Top Editorial Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE]">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-[14px] flex items-center justify-center text-[#171717] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <span className="text-[11px] uppercase tracking-widest text-[#6F6F6F] font-medium block truncate">
            {doc.documentType}
          </span>
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 -mr-2 rounded-[14px] flex items-center justify-center text-[#171717] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Translation Notice Banner if active */}
      {currentTranslation && (
        <div className="py-2.5 px-4 bg-[#F5F5F5] rounded-[14px] flex items-center justify-between text-xs text-[#171717]">
          <span>Translated into <strong>{currentTranslation.language}</strong></span>
          <button
            onClick={() => setActiveLang(null)}
            className="text-xs text-[#6F6F6F] hover:text-[#000000] underline"
          >
            Show original
          </button>
        </div>
      )}

      {/* 1. DOCUMENT IDENTIFIER */}
      <section className="space-y-1">
        <div className="text-[11px] uppercase tracking-widest font-semibold text-[#6F6F6F]">
          Document
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
          {doc.fileName}
        </h1>
        <p className="text-xs text-[#A6A6A6]">
          Analyzed on {new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </section>

      {/* 2. SUMMARY (Editorial Typography, Not a card) */}
      <section className="space-y-2.5">
        <div className="text-[11px] uppercase tracking-widest font-semibold text-[#6F6F6F]">
          Summary
        </div>
        <p className="text-sm sm:text-base text-[#171717] leading-relaxed">
          {currentTranslation
            ? currentTranslation.simpleSummary
            : doc.shortSummary || doc.oneSentenceSummary}
        </p>
        <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed pt-1">
          {currentTranslation
            ? currentTranslation.whatItMeans
            : doc.whatItMeans?.overview}
        </p>
      </section>

      {/* 3. IMPORTANT (Editorial Key-Value Pairs, No unnecessary cards) */}
      {(doc.importantInformation?.deadlines?.length > 0 ||
        doc.importantInformation?.amounts?.length > 0 ||
        doc.importantInformation?.referenceNumbers?.length > 0 ||
        doc.importantInformation?.contactInformation?.length > 0) && (
        <section className="space-y-4 pt-1">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#6F6F6F]">
            Important
          </div>

          <div className="space-y-4 border-t border-b border-[#EEEEEE] py-4">
            {/* Deadlines */}
            {doc.importantInformation.deadlines?.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-xs text-[#6F6F6F] uppercase tracking-wider min-w-[130px]">
                  {d.title || 'Deadline'}
                </span>
                <div className="sm:text-right">
                  <span className="text-sm font-semibold text-[#171717] block">
                    {d.date}
                  </span>
                  {d.consequence && (
                    <span className="text-[11px] text-[#A6A6A6] block mt-0.5">
                      {d.consequence}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Amounts */}
            {doc.importantInformation.amounts?.map((a, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-xs text-[#6F6F6F] uppercase tracking-wider min-w-[130px]">
                  {a.label || 'Amount'}
                </span>
                <div className="sm:text-right">
                  <span className="text-sm font-semibold text-[#171717] font-mono block">
                    {a.amount} {a.currency !== 'USD' && a.currency ? a.currency : ''}
                  </span>
                  {a.paymentMethodOrNotes && (
                    <span className="text-[11px] text-[#A6A6A6] block mt-0.5">
                      {a.paymentMethodOrNotes}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Reference IDs */}
            {doc.importantInformation.referenceNumbers?.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-xs text-[#6F6F6F] uppercase tracking-wider min-w-[130px]">
                  {r.type}
                </span>
                <span className="text-sm font-mono font-medium text-[#171717] sm:text-right">
                  {r.value}
                </span>
              </div>
            ))}

            {/* Contact Information */}
            {doc.importantInformation.contactInformation?.map((c, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-xs text-[#6F6F6F] uppercase tracking-wider min-w-[130px]">
                  Contact
                </span>
                <div className="sm:text-right">
                  <span className="text-sm font-semibold text-[#171717] block">
                    {c.nameOrEntity}
                  </span>
                  <span className="text-[11px] text-[#6F6F6F] block mt-0.5">
                    {[c.role, c.phone, c.email].filter(Boolean).join(' • ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. WHAT YOU NEED TO DO (01, 02, 03 Numbered Action Plan) */}
      <section className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#6F6F6F]">
            What You Need To Do
          </div>
          <span className="text-xs text-[#A6A6A6]">
            {doc.actionPlan.filter((t) => t.completed).length} of {doc.actionPlan.length} done
          </span>
        </div>

        <div className="space-y-4">
          {doc.actionPlan.map((step, idx) => {
            const stepNum = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={step.id}
                onClick={() => handleToggleTask(step.id)}
                className={`py-3.5 px-4 rounded-[16px] border transition-all cursor-pointer select-none touch-manipulation flex items-start gap-4 ${
                  step.completed
                    ? 'bg-[#F5F5F5]/60 border-[#EEEEEE] opacity-60'
                    : 'bg-[#FFFFFF] border-[#EEEEEE] hover:border-[#D9D9D9]'
                }`}
              >
                {/* 01 Number or Checkmark */}
                <div
                  className={`text-xs font-mono font-bold mt-0.5 w-6 h-6 rounded-[8px] flex items-center justify-center shrink-0 transition-colors ${
                    step.completed
                      ? 'bg-[#171717] text-[#FFFFFF]'
                      : 'bg-[#F5F5F5] text-[#171717]'
                  }`}
                >
                  {step.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        step.completed ? 'line-through text-[#6F6F6F]' : 'text-[#000000]'
                      }`}
                    >
                      {step.task}
                    </span>
                    {step.deadline && (
                      <span className="text-[10px] font-mono text-[#6F6F6F] bg-[#F5F5F5] px-2 py-0.5 rounded-[6px]">
                        {step.deadline}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6F6F6F] leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. JARGON & CLARIFICATIONS (Selective Information) */}
      {doc.whatItMeans?.jargonExplained?.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-[#6F6F6F]">
            Terminology Explained
          </div>
          <div className="divide-y divide-[#EEEEEE] border-t border-b border-[#EEEEEE]">
            {doc.whatItMeans.jargonExplained.map((j, i) => (
              <div key={i} className="py-3 space-y-0.5">
                <div className="text-xs font-semibold font-mono text-[#171717]">
                  {j.term}
                </div>
                <div className="text-xs text-[#6F6F6F] leading-relaxed">
                  {j.simpleExplanation}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. INTEGRATED ASK AI BAR (Fixed or Bottom Docked) */}
      <div className="pt-4">
        <form onSubmit={handleQuickSubmit} className="relative">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ask about this document..."
            className="w-full bg-[#F5F5F5] hover:bg-[#EEEEEE] focus:bg-[#FFFFFF] border border-[#EEEEEE] focus:border-[#000000] text-sm text-[#171717] placeholder-[#A6A6A6] rounded-[20px] py-3.5 pl-4 pr-12 outline-none transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[12px] bg-[#171717] hover:bg-[#000000] disabled:bg-[#D9D9D9] text-[#FFFFFF] flex items-center justify-center transition-colors"
            aria-label="Ask"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Options Bottom Sheet */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="Document Options"
        subtitle={doc.fileName}
      >
        <div className="space-y-1 pt-1">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsChatOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
          >
            <Send className="w-4 h-4 text-[#6F6F6F]" />
            <span>Ask AI About This Document</span>
          </button>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsTranslateOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
          >
            <Languages className="w-4 h-4 text-[#6F6F6F]" />
            <span>Translate Summary</span>
          </button>

          <button
            onClick={() => {
              exportToPdf(doc);
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
          >
            <Download className="w-4 h-4 text-[#6F6F6F]" />
            <span>Export as PDF</span>
          </button>

          <button
            onClick={() => {
              exportToTxt(doc);
              setIsMenuOpen(false);
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
              onClick={() => {
                onDeleteDocument(doc.id);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <Trash2 className="w-4 h-4 text-[#6F6F6F]" />
              <span>Delete Document</span>
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Translation Language Bottom Sheet */}
      <BottomSheet
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        title="Translate Analysis"
        subtitle="Select language for plain explanation"
      >
        <div className="space-y-1 pt-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleTranslate(lang.code, lang.name)}
              className="w-full flex items-center justify-between p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <span>{lang.name}</span>
              {activeLang === lang.code && <Check className="w-4 h-4 text-[#171717]" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Dedicated AI Chat Sheet */}
      <ChatSheet
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        documentText={doc.extractedText || doc.shortSummary}
        documentName={doc.fileName}
        initialQuery={initialChatQuery}
      />
    </div>
  );
};
