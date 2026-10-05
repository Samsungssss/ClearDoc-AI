import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: 'auto' | 'medium' | 'full';
  isExpandable?: boolean;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  height = 'auto',
  isExpandable = false,
  onToggleExpand,
  isExpanded = false,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTouchDelta(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartY.current;
    // Only allow dragging down or up slightly
    if (delta > 0) {
      setTouchDelta(delta);
    } else if (isExpandable && delta < -30 && !isExpanded) {
      // Swiping up when expandable
      if (onToggleExpand) {
        onToggleExpand();
        touchStartY.current = null;
        setTouchDelta(0);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchDelta > 110) {
      onClose();
    }
    touchStartY.current = null;
    setTouchDelta(0);
  };

  // Determine height classes based on props and expansion
  let heightClass = 'max-h-[88vh]';
  if (isExpanded || height === 'full') {
    heightClass = 'h-[92vh] max-h-[94vh]';
  } else if (height === 'medium') {
    heightClass = 'h-[62vh] max-h-[75vh]';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4">
      {/* Dimmed Calm Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/45 backdrop-blur-[2px] transition-opacity duration-200 animate-fade"
        onClick={onClose}
      />

      {/* Sheet Container with 30px top rounded corners */}
      <div
        ref={sheetRef}
        style={{
          transform: touchDelta > 0 ? `translateY(${touchDelta}px)` : undefined,
          transition: touchDelta > 0 ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s ease',
        }}
        className={`relative z-10 w-full sm:max-w-xl bg-[#FFFFFF] rounded-t-[30px] sm:rounded-[24px] border-t sm:border border-[#EEEEEE] shadow-2xl overflow-hidden flex flex-col ${heightClass} animate-sheet`}
      >
        {/* Native Mobile Drag Handle Area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full pt-3.5 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-10 h-1 bg-[#D9D9D9] rounded-full" />
        </div>

        {/* Optional Header */}
        {(title || isExpandable) && (
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#EEEEEE]">
            <div className="min-w-0 pr-3">
              {title && (
                <h3 className="text-base font-semibold text-[#171717] tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#6F6F6F] truncate mt-0.5">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isExpandable && onToggleExpand && (
                <button
                  onClick={onToggleExpand}
                  className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors"
                  aria-label={isExpanded ? 'Collapse sheet' : 'Expand sheet'}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1 pb-10 sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};
