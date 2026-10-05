import React from 'react';
import { FileText, Plus, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onTrySample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onTrySample }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E6EE] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group touch-manipulation min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1E232B] flex items-center justify-center text-white shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[#111111] tracking-tight text-base sm:text-lg">
                  ClearDoc AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-medium tracking-wider uppercase text-[#64748B] bg-[#F1F3F7] border border-[#E2E6EE] px-2 py-0.5 rounded-md">
                  Doc Intelligence
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Desktop navigation">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'upload', label: 'Analyze Document' },
                { id: 'history', label: 'History' },
                { id: 'privacy', label: 'Privacy' },
                { id: 'settings', label: 'Settings' },
              ].map((tab) => {
                const isActive = currentView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onNavigate(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all min-h-[40px] flex items-center ${
                      isActive
                        ? 'text-[#111111] bg-[#DCE1EB] shadow-xs'
                        : 'text-[#5F6B7C] hover:text-[#111111] hover:bg-[#F1F3F7]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons (Right) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onTrySample}
              className="ref-btn-secondary !text-xs !py-2 !px-3 sm:!px-4 !min-h-[40px]"
            >
              <span>Try Sample</span>
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="ref-btn-primary !text-xs !py-2 !px-3.5 sm:!px-4 !min-h-[40px]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Analyze</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
