import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import {
  Languages,
  Shield,
  Trash2,
  Check,
  ChevronRight,
  RotateCcw,
  Info
} from 'lucide-react';
import { SAMPLE_HOUSING_NOTICE } from '../data/sampleDocuments';
import { saveStoredDocument } from '../utils/storage';

interface SettingsScreenProps {
  documentCount: number;
  onClearAllData: () => void;
  onReloadSample: () => void;
}

const LANGUAGES = [
  'English',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Arabic (العربية)',
  'Persian / Dari (فارسی)',
  'Urdu (اردو)',
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  documentCount,
  onClearAllData,
  onReloadSample,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [isPrivacySheetOpen, setIsPrivacySheetOpen] = useState(false);
  const [isAboutSheetOpen, setIsAboutSheetOpen] = useState(false);
  const [sampleReloaded, setSampleReloaded] = useState(false);

  const handleResetSample = () => {
    saveStoredDocument(SAMPLE_HOUSING_NOTICE);
    onReloadSample();
    setSampleReloaded(true);
    setTimeout(() => setSampleReloaded(false), 2000);
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-5 sm:px-6 pt-7 pb-36 space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#000000]">
          Settings
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-0.5">
          App preferences and data management
        </p>
      </div>

      {/* Settings Rows */}
      <div className="divide-y divide-[#EEEEEE] border-t border-b border-[#EEEEEE]">
        {/* Language */}
        <button
          onClick={() => setIsLangSheetOpen(true)}
          className="w-full py-4 flex items-center justify-between text-left hover:bg-[#F5F5F5]/60 transition-colors -mx-2 px-2 rounded-[14px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#171717]">Language</div>
              <div className="text-xs text-[#6F6F6F]">{selectedLanguage}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A6A6A6]" />
        </button>

        {/* Privacy & Storage */}
        <button
          onClick={() => setIsPrivacySheetOpen(true)}
          className="w-full py-4 flex items-center justify-between text-left hover:bg-[#F5F5F5]/60 transition-colors -mx-2 px-2 rounded-[14px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#171717]">Privacy & Local Data</div>
              <div className="text-xs text-[#6F6F6F]">
                {documentCount} {documentCount === 1 ? 'document' : 'documents'} stored locally
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A6A6A6]" />
        </button>

        {/* Reload Sample Document */}
        <button
          onClick={handleResetSample}
          className="w-full py-4 flex items-center justify-between text-left hover:bg-[#F5F5F5]/60 transition-colors -mx-2 px-2 rounded-[14px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#171717]">Load Sample Document</div>
              <div className="text-xs text-[#6F6F6F]">
                {sampleReloaded ? 'Sample loaded into workspace' : 'Municipal Housing Notice'}
              </div>
            </div>
          </div>
          {sampleReloaded && <Check className="w-4 h-4 text-[#171717]" />}
        </button>

        {/* About ClearDoc */}
        <button
          onClick={() => setIsAboutSheetOpen(true)}
          className="w-full py-4 flex items-center justify-between text-left hover:bg-[#F5F5F5]/60 transition-colors -mx-2 px-2 rounded-[14px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#171717]">About ClearDoc</div>
              <div className="text-xs text-[#6F6F6F]">Design philosophy & principles</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A6A6A6]" />
        </button>
      </div>

      {/* Clear All Data */}
      <div className="pt-2">
        <button
          onClick={onClearAllData}
          className="w-full py-3.5 px-4 bg-[#F5F5F5] hover:bg-[#EEEEEE] text-[#171717] rounded-[16px] text-xs font-medium flex items-center justify-center gap-2 transition-colors min-h-[44px]"
        >
          <Trash2 className="w-4 h-4 text-[#6F6F6F]" />
          <span>Clear All Stored Documents</span>
        </button>
      </div>

      {/* Language Bottom Sheet */}
      <BottomSheet
        isOpen={isLangSheetOpen}
        onClose={() => setIsLangSheetOpen(false)}
        title="App Language"
        subtitle="Select preferred interface language"
      >
        <div className="space-y-1 pt-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLanguage(lang);
                setIsLangSheetOpen(false);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[48px]"
            >
              <span>{lang}</span>
              {selectedLanguage === lang && <Check className="w-4 h-4 text-[#171717]" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Privacy Bottom Sheet */}
      <BottomSheet
        isOpen={isPrivacySheetOpen}
        onClose={() => setIsPrivacySheetOpen(false)}
        title="Privacy & Storage"
        subtitle="How ClearDoc protects your data"
      >
        <div className="space-y-4 pt-2 text-xs sm:text-sm text-[#333333] leading-relaxed">
          <p>
            ClearDoc operates with strict data privacy:
          </p>
          <div className="space-y-2.5">
            <div className="p-3 bg-[#F5F5F5] rounded-[14px]">
              <span className="font-semibold text-[#171717] block">Local Workspace Storage</span>
              <span className="text-xs text-[#6F6F6F]">
                Your document analyses and checklist states are stored locally on your device browser. They are not stored on external databases.
              </span>
            </div>

            <div className="p-3 bg-[#F5F5F5] rounded-[14px]">
              <span className="font-semibold text-[#171717] block">Confidential Processing</span>
              <span className="text-xs text-[#6F6F6F]">
                Documents are analyzed using secure, stateless server-side processing for comprehension and immediately discarded from memory.
              </span>
            </div>

            <div className="p-3 bg-[#F5F5F5] rounded-[14px]">
              <span className="font-semibold text-[#171717] block">Total Data Deletion</span>
              <span className="text-xs text-[#6F6F6F]">
                You can wipe all saved documents and analysis cache anytime using the "Clear All Stored Documents" button.
              </span>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* About Bottom Sheet */}
      <BottomSheet
        isOpen={isAboutSheetOpen}
        onClose={() => setIsAboutSheetOpen(false)}
        title="About ClearDoc"
        subtitle="Monochrome. Minimal. Friendly. Calm."
      >
        <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#333333] leading-relaxed">
          <p>
            ClearDoc was created to solve a universal friction: understanding complicated paperwork, government letters, contracts, and legal notices.
          </p>
          <p className="text-[#6F6F6F]">
            We turn dense legalese and bureaucratic language into clear, actionable steps so you always know what to do next.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
};
