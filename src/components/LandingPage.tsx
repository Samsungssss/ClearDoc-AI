import React from 'react';
import { ArrowRight, FileText, CheckCircle2, Shield, UploadCloud, Search } from 'lucide-react';

interface LandingPageProps {
  onAnalyzeDocument: () => void;
  onTrySample: () => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeDocument,
  onTrySample,
  onGoToDashboard,
}) => {
  return (
    <div className="w-full bg-[#F1F3F7] text-[#111111] pb-16 sm:pb-24">
      {/* Top Banner Notice */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E6EE] py-2 px-3.5 text-center text-xs text-[#5F6B7C]">
        Document comprehension and action planning powered by Gemini AI. Your files remain private.
      </div>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 pb-12 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-[#D8DFEA] rounded-xl px-3 py-1.5 text-xs font-medium text-[#5F6B7C] bg-[#FFFFFF] shadow-2xs mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
          <span>ClearDoc AI</span>
          <span className="text-[#CFD5E1]">|</span>
          <span>Contracts, Notices & Forms</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#111111] max-w-2xl mx-auto leading-[1.18] sm:leading-[1.15]">
          Understand Any Document. Know What To Do Next.
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-[#5F6B7C] max-w-xl mx-auto font-normal leading-relaxed">
          Upload a document and let AI explain it, extract what matters, find missing information, and turn it into a simple action plan.
        </p>

        {/* Buttons matching reference visual styling */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onAnalyzeDocument}
            className="ref-btn-primary w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            <span>Analyze a Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTrySample}
            className="ref-btn-secondary w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            <span>Try a Sample</span>
          </button>
        </div>

        <div className="mt-4 text-[11px] sm:text-xs text-[#808E9F]">
          Supports PDF, Scanned Photos, DOCX, PNG, JPG. No sign-up required.
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-10 sm:py-14 max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-[11px] uppercase tracking-widest text-[#5F6B7C] font-semibold">How It Works</h2>
          <p className="text-xl sm:text-2xl font-semibold text-[#111111] mt-1.5">A simple 3-step process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="ref-card p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center text-sm font-semibold text-[#111111] mb-3.5">
                1
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Upload</h3>
              <p className="text-xs sm:text-sm text-[#5F6B7C] mt-2 leading-relaxed">
                Drag and drop any official letter, court notice, invoice, lease, medical bill, or contract in PDF or photo format.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-[#F1F3F7] text-[11px] text-[#808E9F] font-mono">
              Step 01 / 03
            </div>
          </div>

          {/* Step 2 */}
          <div className="ref-card p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center text-sm font-semibold text-[#111111] mb-3.5">
                2
              </div>
              <h3 className="text-base font-semibold text-[#111111]">AI Analysis</h3>
              <p className="text-xs sm:text-sm text-[#5F6B7C] mt-2 leading-relaxed">
                Gemini reads every section to extract dates, critical deadlines, amounts, reference numbers, parties, and missing items.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-[#F1F3F7] text-[11px] text-[#808E9F] font-mono">
              Step 02 / 03
            </div>
          </div>

          {/* Step 3 */}
          <div className="ref-card p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center text-sm font-semibold text-[#111111] mb-3.5">
                3
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Clear Action Plan</h3>
              <p className="text-xs sm:text-sm text-[#5F6B7C] mt-2 leading-relaxed">
                Receive plain-English explanations of terminology, followed by a numbered, checkable action checklist with exact dates.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-[#F1F3F7] text-[11px] text-[#808E9F] font-mono">
              Step 03 / 03
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Categories Section */}
      <section className="py-8 sm:py-12 max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#111111]">
            Built for documents you actually receive
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6B7C] mt-1.5 max-w-md mx-auto">
            Official paperwork is written in bureaucratic jargon. ClearDoc AI translates it into clear next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Housing & Property</div>
            <h3 className="text-sm font-semibold text-[#111111]">Inspection & Code Notices</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Municipal violation cure periods, smoke detector certifications, landlord repair notices, and appeal filings.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Contracts & Agreements</div>
            <h3 className="text-sm font-semibold text-[#111111]">Leases & Service Agreements</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Automatic renewal windows, early termination penalties, security deposit return terms, and CAM allocations.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Healthcare & Benefits</div>
            <h3 className="text-sm font-semibold text-[#111111]">Medical Bills & EOB Notices</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Out-of-network balance billing, appeal submission deadlines, prior authorization paperwork, and codes.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Tax & Government</div>
            <h3 className="text-sm font-semibold text-[#111111]">Official Bureau Letters</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Statutory response windows, payment plan instructions, certified mail receipts, and documentation checks.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Employment</div>
            <h3 className="text-sm font-semibold text-[#111111]">Offer Letters & Severance</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Non-compete clauses, release of claims deadlines, vesting schedules, and continuation benefits.
            </p>
          </div>

          <div className="ref-card p-4 sm:p-5">
            <div className="text-[10px] font-semibold text-[#5F6B7C] uppercase tracking-wider mb-1.5">Finance & Insurance</div>
            <h3 className="text-sm font-semibold text-[#111111]">Policy Renewals & Disclosures</h3>
            <p className="text-xs text-[#5F6B7C] mt-1 leading-relaxed">
              Rate change notices, coverage exclusions, deductible adjustments, and proof-of-loss timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Guarantee Section */}
      <section className="py-10 max-w-3xl mx-auto px-3.5 sm:px-6 text-center">
        <div className="ref-card p-6 sm:p-8">
          <div className="w-10 h-10 rounded-xl bg-[#F1F3F7] border border-[#D8DFEA] flex items-center justify-center mx-auto mb-3 text-[#111111]">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-[#111111]">Your Documents Remain Private</h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5F6B7C] max-w-md mx-auto leading-relaxed">
            ClearDoc AI is designed for sensitive files. Analysis is stored locally in your browser workspace. You can permanently clear all data with one tap.
          </p>
          <div className="mt-5">
            <button
              onClick={onGoToDashboard}
              className="ref-btn-secondary text-xs"
            >
              <span>Go to Dashboard & History</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
