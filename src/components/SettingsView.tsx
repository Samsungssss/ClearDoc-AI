import React, { useState } from 'react';
import { Settings, RotateCcw, Check, HardDrive, Info } from 'lucide-react';
import { SAMPLE_HOUSING_NOTICE } from '../data/sampleDocuments';
import { saveStoredDocument } from '../utils/storage';

interface SettingsViewProps {
  onReloadSample: () => void;
  documentCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onReloadSample, documentCount }) => {
  const [defaultSummary, setDefaultSummary] = useState('short');
  const [defaultLang, setDefaultLang] = useState('es');
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleResetSample = () => {
    saveStoredDocument(SAMPLE_HOUSING_NOTICE);
    onReloadSample();
    setSampleLoaded(true);
    setTimeout(() => setSampleLoaded(false), 3000);
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
      <div className="mb-6 pb-5 border-b border-[#E2E6EE]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-[#1E232B] flex items-center justify-center text-white">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">Settings & Preferences</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#5F6B7C]">
          Configure default AI behavior, summary styles, and document storage.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Defaults Card */}
        <div className="ref-card p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111111]">Analysis Preferences</h2>

          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1.5">
              Default Summary View
            </label>
            <select
              value={defaultSummary}
              onChange={(e) => setDefaultSummary(e.target.value)}
              className="text-xs sm:text-sm border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 bg-[#FFFFFF] text-[#111111] w-full sm:w-80 min-h-[44px] focus:outline-none focus:border-[#111111]"
            >
              <option value="short">Standard Short Summary (Recommended)</option>
              <option value="oneSentence">One-Sentence Quick Takeaway</option>
              <option value="detailed">Detailed Clause-by-Clause Breakdown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1.5">
              Primary Translation Language
            </label>
            <select
              value={defaultLang}
              onChange={(e) => setDefaultLang(e.target.value)}
              className="text-xs sm:text-sm border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 bg-[#FFFFFF] text-[#111111] w-full sm:w-80 min-h-[44px] focus:outline-none focus:border-[#111111]"
            >
              <option value="es">Spanish (Español)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="fa">Persian / Dari (فارسی / دری)</option>
              <option value="ur">Urdu (اردو)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              className="ref-btn-primary text-xs sm:text-sm w-full sm:w-auto"
            >
              {savedSettings ? <Check className="w-4 h-4" /> : null}
              <span>{savedSettings ? 'Preferences Saved' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Local Storage Card */}
        <div className="ref-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
            <HardDrive className="w-4 h-4 text-[#5F6B7C]" />
            <span>Workspace Storage Diagnostics</span>
          </div>

          <p className="text-xs text-[#5F6B7C] leading-relaxed">
            All documents, action checklists, and translated reports are stored locally in your browser.
          </p>

          <div className="bg-[#F8FAFC] border border-[#E2E6EE] rounded-xl p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#5F6B7C]">Stored Documents:</span>
              <span className="font-semibold text-[#111111]">{documentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F6B7C]">Storage Backend:</span>
              <span className="font-mono text-[#111111]">HTML5 LocalStorage</span>
            </div>
          </div>
        </div>

        {/* Sample Document Reload Card */}
        <div className="ref-card p-5 sm:p-6 space-y-3">
          <h2 className="text-sm font-semibold text-[#111111]">Sample Document Testing</h2>
          <p className="text-xs text-[#5F6B7C] leading-relaxed">
            Reload the official municipal housing violation sample notice (City Housing Authority) into your dashboard to test or demo ClearDoc AI.
          </p>

          <button
            onClick={handleResetSample}
            className="ref-btn-secondary text-xs sm:text-sm w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 text-[#808E9F]" />
            <span>{sampleLoaded ? 'Sample Notice Reloaded!' : 'Reload Sample Housing Notice'}</span>
          </button>
        </div>

        {/* System Info */}
        <div className="p-4 ref-card text-xs text-[#5F6B7C] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#808E9F] shrink-0 mt-0.5" />
          <div>
            ClearDoc AI 2.0 • Multimodal Document Comprehension powered by Gemini AI.
          </div>
        </div>
      </div>
    </div>
  );
};
