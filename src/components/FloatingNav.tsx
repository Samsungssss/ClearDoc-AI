import React from 'react';
import { Home, FileText, Plus, Settings } from 'lucide-react';

interface FloatingNavProps {
  currentTab: 'home' | 'documents' | 'settings';
  onSelectTab: (tab: 'home' | 'documents' | 'settings') => void;
  onOpenAnalyze: () => void;
  documentCount?: number;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAnalyze,
  documentCount = 0,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm sm:max-w-md pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#FFFFFF] border border-[#EEEEEE] rounded-[26px] floating-nav-shadow px-3 py-1.5 flex items-center justify-between">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 min-h-[48px] rounded-[18px] transition-all touch-manipulation ${
            currentTab === 'home'
              ? 'text-[#000000] font-semibold'
              : 'text-[#6F6F6F] hover:text-[#171717]'
          }`}
        >
          <div
            className={`p-1 rounded-[12px] transition-colors ${
              currentTab === 'home' ? 'bg-[#F5F5F5]' : ''
            }`}
          >
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* Documents */}
        <button
          onClick={() => onSelectTab('documents')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 min-h-[48px] rounded-[18px] transition-all touch-manipulation relative ${
            currentTab === 'documents'
              ? 'text-[#000000] font-semibold'
              : 'text-[#6F6F6F] hover:text-[#171717]'
          }`}
        >
          <div
            className={`p-1 rounded-[12px] transition-colors ${
              currentTab === 'documents' ? 'bg-[#F5F5F5]' : ''
            }`}
          >
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">
            Docs{documentCount > 0 ? ` (${documentCount})` : ''}
          </span>
        </button>

        {/* Analyze — Distinctive monochrome elevated action */}
        <div className="px-1">
          <button
            onClick={onOpenAnalyze}
            className="flex items-center gap-1.5 bg-[#171717] hover:bg-[#000000] active:scale-95 text-[#FFFFFF] px-4 py-2.5 rounded-[18px] min-h-[44px] transition-all shadow-sm touch-manipulation select-none"
            aria-label="Analyze Document"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-xs font-medium tracking-tight">Analyze</span>
          </button>
        </div>

        {/* Settings */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 min-h-[48px] rounded-[18px] transition-all touch-manipulation ${
            currentTab === 'settings'
              ? 'text-[#000000] font-semibold'
              : 'text-[#6F6F6F] hover:text-[#171717]'
          }`}
        >
          <div
            className={`p-1 rounded-[12px] transition-colors ${
              currentTab === 'settings' ? 'bg-[#F5F5F5]' : ''
            }`}
          >
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Settings</span>
        </button>
      </div>
    </nav>
  );
};
