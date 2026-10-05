import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/document';
import { AskAiPanel } from './AskAiPanel';
import { exportToPdf, exportToTxt, copyToClipboard } from '../utils/export';
import {
  FileText,
  CheckSquare,
  Square,
  AlertTriangle,
  Calendar,
  DollarSign,
  Phone,
  Hash,
  Download,
  Copy,
  Languages,
  Brain,
  MessageSquare,
  HelpCircle,
  Check,
  ArrowLeft,
  ShieldAlert,
  Search
} from 'lucide-react';

interface DocumentAnalysisViewProps {
  document: DocumentAnalysis;
  onUpdateDocument: (updated: DocumentAnalysis) => void;
  onBackToDashboard: () => void;
}

const SUPPORTED_LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Persian / Dari', code: 'fa' },
  { name: 'Urdu', code: 'ur' }
];

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({
  document,
  onUpdateDocument,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<
    'means' | 'actions' | 'info' | 'summary' | 'deep' | 'translate' | 'chat'
  >('means');

  const [summaryMode, setSummaryMode] = useState<'oneSentence' | 'short' | 'detailed'>('short');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Deep reasoning state
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [deepAnalysisError, setDeepAnalysisError] = useState<string | null>(null);

  // Search verification for official entities
  const [searchVerifyingEntity, setSearchVerifyingEntity] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ entity: string; text: string; sources: any[] } | null>(null);

  const handleToggleAction = (actionId: string) => {
    const updatedPlan = document.actionPlan.map((item) =>
      item.id === actionId ? { ...item, completed: !item.completed } : item
    );
    onUpdateDocument({
      ...document,
      actionPlan: updatedPlan,
    });
  };

  const handleCopyReport = async () => {
    const success = await copyToClipboard(document);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleTranslate = async (langCode: string) => {
    const target = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (!target) return;
    setSelectedLanguage(langCode);

    if (document.translations && document.translations[langCode]) {
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: target.name,
          targetLanguageCode: target.code,
          simpleSummary: document.shortSummary,
          whatItMeans: document.whatItMeans.overview,
          actionPlan: document.actionPlan.map((a) => ({ task: a.task, details: a.details })),
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      if (data.translation) {
        const updatedTranslations = {
          ...(document.translations || {}),
          [langCode]: data.translation,
        };
        onUpdateDocument({
          ...document,
          translations: updatedTranslations,
        });
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      setTranslationError('Could not translate document at this time. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRunDeepReasoning = async () => {
    setIsDeepAnalyzing(true);
    setDeepAnalysisError(null);

    try {
      const response = await fetch('/api/deep-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: document.extractedText || JSON.stringify(document),
        }),
      });

      if (!response.ok) {
        throw new Error('Deep reasoning request failed.');
      }

      const data = await response.json();
      if (data.deepThinking) {
        onUpdateDocument({
          ...document,
          deepThinkingAnalysis: data.deepThinking,
        });
      }
    } catch (err: any) {
      console.error('Deep reasoning error:', err);
      setDeepAnalysisError('Deep reasoning service encountered an error.');
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  const handleVerifyEntity = async (entityName: string) => {
    setSearchVerifyingEntity(entityName);
    try {
      const res = await fetch('/api/search-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityName,
          query: `${entityName} official contact statutory rules verification`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVerificationResult({
          entity: entityName,
          text: data.verificationResult,
          sources: data.sources || [],
        });
      }
    } catch (e) {
      console.error('Search verification error:', e);
    } finally {
      setSearchVerifyingEntity(null);
    }
  };

  const completedCount = document.actionPlan?.filter((i) => i.completed).length || 0;
  const totalCount = document.actionPlan?.length || 0;
  const activeTranslation = document.translations?.[selectedLanguage];

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-14">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E6EE]">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="ref-btn-secondary !text-xs !py-2 !px-3 shrink-0 !min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Dashboard</span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-[#111111] truncate max-w-full">
                {document.fileName}
              </h1>
              <span className="text-[10px] font-medium bg-[#FFFFFF] text-[#111111] border border-[#D8DFEA] px-2 py-0.5 rounded-md">
                {document.documentType}
              </span>
            </div>
            <div className="text-[11px] text-[#808E9F] mt-0.5">
              Analyzed {new Date(document.uploadDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Export and Copy controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => exportToPdf(document)}
            title="Download PDF report"
            className="ref-btn-secondary !text-xs !py-2 !px-3 !min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportToTxt(document)}
            title="Download TXT report"
            className="ref-btn-secondary !text-xs !py-2 !px-3 !min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleCopyReport}
            title="Copy to clipboard"
            className="ref-btn-secondary !text-xs !py-2 !px-3 !min-h-[38px]"
          >
            {copySuccess ? <Check className="w-3.5 h-3.5 text-[#111111]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copySuccess ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Legal & Informational Disclaimer */}
      <div className="my-4 p-3.5 ref-card bg-[#FFFFFF] text-xs text-[#5F6B7C] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#111111]">Informational Assistance:</span> ClearDoc AI extracts and explains official paperwork. For statutory deadlines or legal actions, verify directly with the issuing authority.
        </div>
      </div>

      {/* Segmented Horizontal Tabs matching reference style */}
      <div className="flex bg-[#E2E7EF] p-1 rounded-xl my-5 overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'means', label: 'What It Means' },
          { id: 'actions', label: `Action Plan (${completedCount}/${totalCount})` },
          { id: 'info', label: 'Important Info' },
          { id: 'summary', label: 'Summary' },
          { id: 'deep', label: 'Deep Reasoning' },
          { id: 'translate', label: 'Translate' },
          { id: 'chat', label: 'Ask AI' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all touch-manipulation min-h-[40px] flex items-center justify-center shrink-0 ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#111111] shadow-2xs font-semibold'
                  : 'text-[#5F6B7C] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: What This Document Means */}
      {activeTab === 'means' && (
        <div className="space-y-5">
          <div className="ref-card p-5 sm:p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6B7C] mb-2.5">
              Plain English Explanation
            </h2>
            <p className="text-sm sm:text-base text-[#111111] leading-relaxed">
              {document.whatItMeans.overview}
            </p>

            {document.whatItMeans.plainLanguageExplanation?.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[#F1F3F7]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C] mb-3">
                  Key Takeaways for You
                </h3>
                <ul className="space-y-2.5">
                  {document.whatItMeans.plainLanguageExplanation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#111111] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Jargon Explained Dictionary */}
          {document.whatItMeans.jargonExplained?.length > 0 && (
            <div>
              <div className="mb-3">
                <h2 className="text-sm sm:text-base font-semibold text-[#111111]">
                  Complicated Terminology Explained
                </h2>
                <p className="text-xs text-[#5F6B7C]">
                  Official paperwork often uses confusing language. Here are simple explanations:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {document.whatItMeans.jargonExplained.map((jargon, idx) => (
                  <div key={idx} className="ref-card p-4 space-y-1.5">
                    <span className="inline-block text-xs font-mono font-semibold bg-[#F1F3F7] text-[#111111] px-2 py-0.5 rounded-md border border-[#E2E6EE]">
                      {jargon.term}
                    </span>
                    <p className="text-xs text-[#5F6B7C] leading-relaxed pt-1">
                      {jargon.simpleExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Information Notice */}
          {document.missingInformation?.length > 0 && (
            <div className="ref-card p-5 bg-[#FFFFFF]">
              <div className="flex items-center gap-2 mb-2 text-[#111111] font-semibold text-sm">
                <HelpCircle className="w-4 h-4 text-[#111111]" />
                <span>Information Missing or Omitted in Document</span>
              </div>
              <p className="text-xs text-[#5F6B7C] mb-3.5">
                Details not specified in the document text that you may need to check:
              </p>

              <div className="space-y-2.5">
                {document.missingInformation.map((item, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] border border-[#E2E6EE] rounded-xl p-3 text-xs space-y-1">
                    <div className="font-semibold text-[#111111]">• {item.item}</div>
                    <div className="text-[#5F6B7C]"><span className="text-[#808E9F]">Why it matters:</span> {item.whyItMatters}</div>
                    <div className="text-[#111111]"><span className="text-[#808E9F]">Recommendation:</span> {item.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Action Plan (What You Need To Do) */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">What You Need To Do</h2>
              <p className="text-xs text-[#5F6B7C]">
                Sequential numbered checklist generated from the document's instructions.
              </p>
            </div>

            <div className="text-xs font-medium text-[#111111] bg-[#FFFFFF] border border-[#D8DFEA] px-3 py-1 rounded-lg">
              {completedCount} of {totalCount} completed
            </div>
          </div>

          <div className="space-y-3">
            {document.actionPlan.map((step) => (
              <div
                key={step.id}
                onClick={() => handleToggleAction(step.id)}
                className={`ref-card p-4 sm:p-5 transition-all cursor-pointer select-none touch-manipulation min-h-[58px] ${
                  step.completed ? 'bg-[#F8FAFC] opacity-75' : 'bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Large touch-friendly checkbox matching reference styling */}
                  <div className="mt-0.5 shrink-0 w-6 h-6 rounded-md border border-[#CFD5E1] bg-[#F1F3F7] flex items-center justify-center transition-colors">
                    {step.completed && <Check className="w-4 h-4 text-[#111111]" strokeWidth={3} />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-[#808E9F]">
                          #{step.stepNumber}
                        </span>
                        <h3
                          className={`text-sm font-semibold ${
                            step.completed ? 'line-through text-[#808E9F]' : 'text-[#111111]'
                          }`}
                        >
                          {step.task}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {step.deadline && (
                          <span className="flex items-center gap-1 text-[#111111] bg-[#F1F3F7] border border-[#E2E6EE] px-2 py-0.5 rounded-md font-mono text-[11px]">
                            <Calendar className="w-3 h-3 text-[#5F6B7C]" />
                            {step.deadline}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            step.priority === 'high'
                              ? 'bg-[#DCE1EB] text-[#111111] border-[#CFD5E1]'
                              : 'bg-[#F1F3F7] text-[#5F6B7C] border-[#E2E6EE]'
                          }`}
                        >
                          {step.priority}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed ${step.completed ? 'text-[#808E9F]' : 'text-[#5F6B7C]'}`}>
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Important Information */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadlines Card */}
            <div className="ref-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-sm">
                <Calendar className="w-4 h-4 text-[#111111]" />
                <span>Critical Deadlines</span>
              </div>

              {document.importantInformation.deadlines?.length > 0 ? (
                <div className="space-y-3">
                  {document.importantInformation.deadlines.map((d, i) => (
                    <div key={i} className="border-l-2 border-[#111111] pl-3 py-0.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">{d.title}</span>
                        {d.isUrgent && (
                          <span className="text-[10px] bg-[#DCE1EB] text-[#111111] px-1.5 py-0.5 rounded font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="text-[#111111] font-mono font-medium">{d.date}</div>
                      {d.consequence && (
                        <div className="text-[#5F6B7C]">
                          <span className="text-[#808E9F]">If missed:</span> {d.consequence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#808E9F]">No hard deadlines stated.</p>
              )}
            </div>

            {/* Amounts Card */}
            <div className="ref-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-sm">
                <DollarSign className="w-4 h-4 text-[#111111]" />
                <span>Amounts & Fees</span>
              </div>

              {document.importantInformation.amounts?.length > 0 ? (
                <div className="space-y-3">
                  {document.importantInformation.amounts.map((a, i) => (
                    <div key={i} className="border-l-2 border-[#111111] pl-3 py-0.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">{a.label}</span>
                        <span className="font-mono font-bold text-[#111111] text-sm">{a.amount}</span>
                      </div>
                      <div className="text-[#5F6B7C]">
                        {a.isPayableByYou ? 'Payable by you' : 'Informational / Conditional'}
                        {a.dueDate ? ` by ${a.dueDate}` : ''}
                      </div>
                      {a.paymentMethodOrNotes && (
                        <div className="text-[#5F6B7C] text-[11px]">{a.paymentMethodOrNotes}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#808E9F]">No fee amounts detected.</p>
              )}
            </div>

            {/* Reference Numbers Card */}
            <div className="ref-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-sm">
                <Hash className="w-4 h-4 text-[#111111]" />
                <span>Reference & Case Numbers</span>
              </div>

              {document.importantInformation.referenceNumbers?.length > 0 ? (
                <div className="space-y-2.5">
                  {document.importantInformation.referenceNumbers.map((r, i) => (
                    <div key={i} className="bg-[#F8FAFC] border border-[#E2E6EE] rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[#808E9F] text-[10px] uppercase font-semibold">{r.type}</div>
                        <div className="font-mono font-semibold text-[#111111]">{r.value}</div>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(r.value)}
                        className="ref-btn-secondary !text-[11px] !py-1 !px-2.5 !min-h-[32px]"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#808E9F]">No reference codes noted.</p>
              )}
            </div>

            {/* Contact Information Card */}
            <div className="ref-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-sm">
                <Phone className="w-4 h-4 text-[#111111]" />
                <span>Contact Parties & Offices</span>
              </div>

              {document.importantInformation.contactInformation?.length > 0 ? (
                <div className="space-y-3">
                  {document.importantInformation.contactInformation.map((c, i) => (
                    <div key={i} className="text-xs space-y-1 pb-2.5 border-b border-[#F1F3F7] last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">{c.nameOrEntity}</span>
                        <button
                          onClick={() => handleVerifyEntity(c.nameOrEntity)}
                          disabled={searchVerifyingEntity === c.nameOrEntity}
                          className="ref-btn-secondary !text-[10px] !py-1 !px-2 !min-h-[30px]"
                        >
                          <Search className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                      </div>
                      <div className="text-[#5F6B7C]">{c.role}</div>
                      {c.phone && <div className="text-[#111111]">Phone: {c.phone}</div>}
                      {c.email && <div className="text-[#111111]">Email: {c.email}</div>}
                      {c.address && <div className="text-[#5F6B7C]">Address: {c.address}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#808E9F]">No contact records found.</p>
              )}
            </div>
          </div>

          {/* Search Verification Result Box */}
          {verificationResult && (
            <div className="ref-card p-4 text-xs space-y-2 bg-[#F8FAFC]">
              <div className="flex items-center justify-between font-semibold text-[#111111]">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#111111]" />
                  Google Search Verification for "{verificationResult.entity}"
                </span>
                <button
                  onClick={() => setVerificationResult(null)}
                  className="text-[#808E9F] hover:text-[#111111]"
                >
                  Close
                </button>
              </div>
              <div className="text-[#5F6B7C] whitespace-pre-wrap leading-relaxed">
                {verificationResult.text}
              </div>
              {verificationResult.sources.length > 0 && (
                <div className="pt-2 border-t border-[#E2E6EE] text-[11px] text-[#808E9F]">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Sources: </span>
                  {verificationResult.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[#111111] ml-2"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Warnings & Penalties Card */}
          {document.importantInformation.warnings?.length > 0 && (
            <div className="ref-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-[#111111]" />
                <span>Important Warnings</span>
              </div>
              <div className="space-y-2.5">
                {document.importantInformation.warnings.map((w, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] border border-[#E2E6EE] rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-[#111111]">{w.title}</div>
                    <div className="text-[#5F6B7C] leading-relaxed">{w.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#111111]">Document Summary</h2>
            <div className="flex bg-[#E2E7EF] p-1 rounded-xl text-xs gap-1">
              <button
                onClick={() => setSummaryMode('oneSentence')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  summaryMode === 'oneSentence'
                    ? 'bg-[#FFFFFF] text-[#111111] font-semibold shadow-2xs'
                    : 'text-[#5F6B7C]'
                }`}
              >
                1-Sentence
              </button>
              <button
                onClick={() => setSummaryMode('short')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  summaryMode === 'short'
                    ? 'bg-[#FFFFFF] text-[#111111] font-semibold shadow-2xs'
                    : 'text-[#5F6B7C]'
                }`}
              >
                Short
              </button>
              <button
                onClick={() => setSummaryMode('detailed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  summaryMode === 'detailed'
                    ? 'bg-[#FFFFFF] text-[#111111] font-semibold shadow-2xs'
                    : 'text-[#5F6B7C]'
                }`}
              >
                Detailed
              </button>
            </div>
          </div>

          <div className="ref-card p-5 sm:p-6">
            {summaryMode === 'oneSentence' && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#808E9F] font-semibold">
                  Executive 1-Sentence Takeaway
                </div>
                <p className="text-base sm:text-lg text-[#111111] font-medium leading-relaxed">
                  {document.oneSentenceSummary}
                </p>
              </div>
            )}

            {summaryMode === 'short' && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#808E9F] font-semibold">
                  Standard Executive Summary
                </div>
                <p className="text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-wrap">
                  {document.shortSummary}
                </p>
              </div>
            )}

            {summaryMode === 'detailed' && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-wider text-[#808E9F] font-semibold">
                  Detailed Section-by-Section Breakdown
                </div>
                <p className="text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-wrap">
                  {document.detailedSummary}
                </p>

                {document.importantSections?.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-[#F1F3F7] space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C]">
                      Quoted Provisions & Simplified Meaning
                    </h3>
                    {document.importantSections.map((sec, idx) => (
                      <div key={idx} className="bg-[#F8FAFC] border border-[#E2E6EE] rounded-xl p-3 text-xs space-y-1.5">
                        <div className="font-semibold text-[#111111]">{sec.title}</div>
                        {sec.originalQuote && (
                          <div className="font-mono text-[#5F6B7C] text-[11px] italic bg-[#FFFFFF] p-2 rounded-lg border border-[#E2E6EE]">
                            {sec.originalQuote}
                          </div>
                        )}
                        <div className="text-[#111111]">
                          <span className="font-semibold">Meaning: </span>
                          {sec.simplifiedMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Deep Reasoning Audit */}
      {activeTab === 'deep' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Deep Reasoning Clause Audit</h2>
              <p className="text-xs text-[#5F6B7C]">
                Advanced cognitive reasoning applied to discover hidden traps, one-sided liabilities, and strategic recommendations.
              </p>
            </div>

            <button
              onClick={handleRunDeepReasoning}
              disabled={isDeepAnalyzing}
              className="ref-btn-primary !text-xs !py-2 !px-4 shrink-0"
            >
              <Brain className="w-4 h-4" />
              <span>{isDeepAnalyzing ? 'Analyzing...' : 'Run Deep Audit'}</span>
            </button>
          </div>

          {deepAnalysisError && (
            <div className="p-3.5 ref-card text-xs text-[#111111]">
              {deepAnalysisError}
            </div>
          )}

          {isDeepAnalyzing && (
            <div className="p-8 text-center ref-card space-y-3">
              <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold text-[#111111]">Auditing Document Clauses...</div>
              <p className="text-xs text-[#5F6B7C] max-w-sm mx-auto">
                Evaluating statutory references, penalty structures, and liability shifts.
              </p>
            </div>
          )}

          {document.deepThinkingAnalysis ? (
            <div className="space-y-4">
              <div className="ref-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C] mb-3">
                  Strategic Advice Before Signing or Responding
                </h3>
                <ul className="space-y-2">
                  {document.deepThinkingAnalysis.strategicAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#111111] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ref-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6B7C] mb-3">
                  Clause-by-Clause Risk Breakdown
                </h3>
                <div className="space-y-3">
                  {document.deepThinkingAnalysis.clauseBreakdown.map((item, i) => (
                    <div key={i} className="border border-[#E2E6EE] rounded-xl p-3.5 space-y-1 text-xs bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">{item.clause}</span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#DCE1EB] text-[#111111]">
                          {item.riskLevel}
                        </span>
                      </div>
                      <div className="text-[#5F6B7C]"><span className="text-[#808E9F]">Finding:</span> {item.finding}</div>
                      <div className="text-[#111111] font-medium"><span className="text-[#808E9F]">Impact:</span> {item.userImpact}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="ref-card p-4">
                  <h4 className="text-xs font-semibold text-[#111111] mb-2">Hidden Traps & Omissions</h4>
                  <ul className="space-y-1.5 text-xs text-[#5F6B7C]">
                    {document.deepThinkingAnalysis.hiddenRisks.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>

                <div className="ref-card p-4">
                  <h4 className="text-xs font-semibold text-[#111111] mb-2">Unfavorable Terms</h4>
                  <ul className="space-y-1.5 text-xs text-[#5F6B7C]">
                    {document.deepThinkingAnalysis.unfavorableTerms.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            !isDeepAnalyzing && (
              <div className="p-8 text-center ref-card border-dashed border-[#CFD5E1]">
                <Brain className="w-8 h-8 text-[#808E9F] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[#111111]">High-Reasoning Audit Available</h3>
                <p className="text-xs text-[#5F6B7C] mt-1 max-w-sm mx-auto mb-4">
                  Examine subtle clauses, penalties, and hidden liability shifts in this document.
                </p>
                <button
                  onClick={handleRunDeepReasoning}
                  className="ref-btn-primary !text-xs !py-2 !px-4"
                >
                  Run Deep Reasoning Audit
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 6: Translation */}
      {activeTab === 'translate' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Document Translation</h2>
              <p className="text-xs text-[#5F6B7C]">
                Translate meaning, dates, and action steps into multiple languages.
              </p>
            </div>

            {/* Language buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang.code)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all min-h-[36px] ${
                    selectedLanguage === lang.code
                      ? 'bg-[#DCE1EB] text-[#111111] border-[#CFD5E1] font-semibold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#5F6B7C] border-[#D8DFEA] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {translationError && (
            <div className="p-3 ref-card text-xs text-[#111111]">
              {translationError}
            </div>
          )}

          {isTranslating ? (
            <div className="p-10 text-center ref-card">
              <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <div className="text-sm font-semibold text-[#111111]">
                Translating into {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name}...
              </div>
              <p className="text-xs text-[#5F6B7C] mt-1">Preserving exact dates and instructions.</p>
            </div>
          ) : activeTranslation ? (
            <div className="space-y-4">
              <div className="ref-card p-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#808E9F] mb-2">
                  {activeTranslation.language} — Summary
                </h3>
                <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
                  {activeTranslation.simpleSummary}
                </p>
              </div>

              <div className="ref-card p-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#808E9F] mb-2">
                  {activeTranslation.language} — What This Means
                </h3>
                <p className="text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-wrap">
                  {activeTranslation.whatItMeans}
                </p>
              </div>

              {activeTranslation.actionPlan?.length > 0 && (
                <div className="ref-card p-5">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#808E9F] mb-3">
                    {activeTranslation.language} — Action Plan
                  </h3>
                  <div className="space-y-2.5">
                    {activeTranslation.actionPlan.map((step, i) => (
                      <div key={i} className="border-l-2 border-[#111111] pl-3 py-0.5 text-xs space-y-1">
                        <div className="font-semibold text-[#111111]">{i + 1}. {step.task}</div>
                        <div className="text-[#5F6B7C] leading-relaxed">{step.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center ref-card border-dashed border-[#CFD5E1]">
              <Languages className="w-8 h-8 text-[#808E9F] mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-[#111111]">Select a Language Above</h3>
              <p className="text-xs text-[#5F6B7C] mt-1 max-w-sm mx-auto">
                Translate this document into Spanish, French, German, Arabic, Persian/Dari, or Urdu.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: Ask AI */}
      {activeTab === 'chat' && (
        <div>
          <AskAiPanel document={document} />
        </div>
      )}
    </div>
  );
};
