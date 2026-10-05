import React from 'react';
import { Home, FolderOpen, PlusCircle, Settings, FileText } from 'lucide-react';

interface NavigationProps {
  currentTab: 'home' | 'documents' | 'analyze' | 'settings';
  onSelectTab: (tab: 'home' | 'documents' | 'analyze' | 'settings') => void;
  documentCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  documentCount = 0,
}) => {
  return (
    <>
      {/* Mobile Bottom Navigation Bar (Screens < 768px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E2E4E8] px-3 py-1.5 shadow-[0_-2px_8px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Home */}
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] rounded-xl transition-all touch-manipulation ${
              currentTab === 'home' ? 'text-[#111111] font-semibold' : 'text-[#6B6B6B]'
            }`}
          >
            <div className={`p-1 rounded-lg ${currentTab === 'home' ? 'bg-[#E5E7EB]' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">Home</span>
          </button>

          {/* Documents */}
          <button
            onClick={() => onSelectTab('documents')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] rounded-xl transition-all touch-manipulation relative ${
              currentTab === 'documents' ? 'text-[#111111] font-semibold' : 'text-[#6B6B6B]'
            }`}
          >
            <div className={`p-1 rounded-lg ${currentTab === 'documents' ? 'bg-[#E5E7EB]' : ''}`}>
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">Documents</span>
            {documentCount > 0 && (
              <span className="absolute top-1 right-3 text-[9px] bg-[#202124] text-white px-1.5 py-0.2 rounded-full font-mono">
                {documentCount}
              </span>
            )}
          </button>

          {/* Analyze (Visually emphasized) */}
          <button
            onClick={() => onSelectTab('analyze')}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] touch-manipulation"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-xs ${
                currentTab === 'analyze'
                  ? 'bg-[#202124] text-white'
                  : 'bg-[#E5E7EB] text-[#111111] hover:bg-[#DCE0E6]'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight text-[#111111]">
              Analyze
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] rounded-xl transition-all touch-manipulation ${
              currentTab === 'settings' ? 'text-[#111111] font-semibold' : 'text-[#6B6B6B]'
            }`}
          >
            <div className={`p-1 rounded-lg ${currentTab === 'settings' ? 'bg-[#E5E7EB]' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">Settings</span>
          </button>
        </div>
      </nav>

      {/* Desktop / Tablet Navigation (Screens >= 768px) */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E4E8]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-[#202124] flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#111111] text-base tracking-tight">ClearDoc AI</span>
              </div>
            </button>

            <nav className="flex items-center gap-1">
              <button
                onClick={() => onSelectTab('home')}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                  currentTab === 'home'
                    ? 'bg-[#E5E7EB] text-[#111111]'
                    : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F1F3F7]'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => onSelectTab('documents')}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                  currentTab === 'documents'
                    ? 'bg-[#E5E7EB] text-[#111111]'
                    : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F1F3F7]'
                }`}
              >
                Documents {documentCount > 0 ? `(${documentCount})` : ''}
              </button>

              <button
                onClick={() => onSelectTab('settings')}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                  currentTab === 'settings'
                    ? 'bg-[#E5E7EB] text-[#111111]'
                    : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F1F3F7]'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div>
            <button
              onClick={() => onSelectTab('analyze')}
              className="ref-btn-dark !text-xs !py-2 !px-4 !min-h-[40px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Analyze Document</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
