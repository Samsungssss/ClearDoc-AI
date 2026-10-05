import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { DocumentAnalysis } from '../types/document';
import { Check, ArrowRight, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface AnalysisSheetProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onAnalysisSuccess: (analysis: DocumentAnalysis) => void;
}

type StageKey = 'received' | 'reading' | 'extracting' | 'deadlines' | 'actionPlan';

interface Stage {
  key: StageKey;
  label: string;
}

const STAGES: Stage[] = [
  { key: 'received', label: 'Document received' },
  { key: 'reading', label: 'Reading document text' },
  { key: 'extracting', label: 'Finding important information' },
  { key: 'deadlines', label: 'Identifying dates & deadlines' },
  { key: 'actionPlan', label: 'Building your action plan' },
];

export const AnalysisSheet: React.FC<AnalysisSheetProps> = ({
  isOpen,
  file,
  onClose,
  onAnalysisSuccess,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedDoc, setAnalyzedDoc] = useState<DocumentAnalysis | null>(null);
  const [extractedSnippet, setExtractedSnippet] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !file) {
      setCurrentStageIndex(0);
      setIsDone(false);
      setError(null);
      setAnalyzedDoc(null);
      setExtractedSnippet('');
      setIsExpanded(false);
      return;
    }

    let isMounted = true;
    setCurrentStageIndex(0);
    setIsDone(false);
    setError(null);

    // Natural progression of stages
    const timer1 = setTimeout(() => {
      if (isMounted) setCurrentStageIndex(1);
    }, 1200);

    const timer2 = setTimeout(() => {
      if (isMounted) setCurrentStageIndex(2);
    }, 2800);

    const timer3 = setTimeout(() => {
      if (isMounted) setCurrentStageIndex(3);
    }, 4500);

    // Start real analysis call
    const runAnalysis = async () => {
      try {
        const isImg = file.type.startsWith('image/');
        let imageBase64: string | undefined = undefined;
        let textContent: string | undefined = undefined;

        if (isImg) {
          imageBase64 = await readFileAsBase64(file);
        } else {
          try {
            const rawText = await readFileAsText(file);
            if (rawText && rawText.trim().length > 15) {
              textContent = rawText;
              setExtractedSnippet(rawText.slice(0, 180));
            } else {
              imageBase64 = await readFileAsBase64(file);
            }
          } catch {
            imageBase64 = await readFileAsBase64(file);
          }
        }

        const res = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type || 'application/pdf',
            imageBase64,
            text: textContent,
          }),
        });

        if (!res.ok) {
          throw new Error('ClearDoc could not process this document.');
        }

        const data = await res.json();
        if (!data.success || !data.analysis) {
          throw new Error('Analysis completed but results could not be structured.');
        }

        if (!isMounted) return;

        setCurrentStageIndex(4);

        const completeDoc: DocumentAnalysis = {
          id: `doc-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          ...data.analysis,
          extractedText: textContent || `Extracted from: ${file.name}`,
        };

        setAnalyzedDoc(completeDoc);

        // Smooth transition to Done
        setTimeout(() => {
          if (isMounted) {
            setIsDone(true);
          }
        }, 800);
      } catch (err: any) {
        if (isMounted) {
          setError('ClearDoc couldn\'t read this document. Try uploading it again.');
        }
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, file]);

  const readFileAsBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || result);
      };
      reader.onerror = () => reject(new Error('File reading failed.'));
      reader.readAsDataURL(f);
    });
  };

  const readFileAsText = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Text reading failed.'));
      reader.readAsText(f);
    });
  };

  const handleContinue = () => {
    if (analyzedDoc) {
      onAnalysisSuccess(analyzedDoc);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height={isDone ? 'auto' : isExpanded ? 'full' : 'medium'}
      isExpandable={!isDone && !error}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    >
      <div className="py-2 space-y-6">
        {/* Error State */}
        {error ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center mx-auto text-[#171717]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-[#171717]">Something went wrong</h4>
              <p className="text-xs text-[#6F6F6F] max-w-xs mx-auto leading-relaxed">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#171717] hover:bg-[#000000] text-[#FFFFFF] text-xs font-medium rounded-[14px] min-h-[44px] transition-colors"
            >
              Try again
            </button>
          </div>
        ) : isDone && analyzedDoc ? (
          /* Analysis Complete State (Calm, Sophisticated, No Confetti) */
          <div className="space-y-6 pt-2">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#6F6F6F] uppercase tracking-wider font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                Done
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#000000]">
                Here's what I found.
              </h2>
              <p className="text-xs text-[#6F6F6F]">
                {analyzedDoc.fileName} • {analyzedDoc.documentType}
              </p>
            </div>

            {/* Quick Glimpse */}
            <div className="p-4 bg-[#F5F5F5] border border-[#EEEEEE] rounded-[18px] space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#6F6F6F]">
                Summary
              </div>
              <p className="text-xs text-[#171717] leading-relaxed line-clamp-3">
                {analyzedDoc.shortSummary || analyzedDoc.oneSentenceSummary}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F5F5F5] rounded-[14px]">
                <div className="text-[10px] text-[#6F6F6F] uppercase tracking-wider">Action Items</div>
                <div className="text-base font-semibold text-[#171717] mt-0.5">
                  {analyzedDoc.actionPlan?.length || 0} to do
                </div>
              </div>
              <div className="p-3 bg-[#F5F5F5] rounded-[14px]">
                <div className="text-[10px] text-[#6F6F6F] uppercase tracking-wider">Deadlines</div>
                <div className="text-base font-semibold text-[#171717] mt-0.5">
                  {analyzedDoc.importantInformation?.deadlines?.length || 0} identified
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-[#171717] hover:bg-[#000000] text-[#FFFFFF] text-sm font-medium py-3.5 px-5 rounded-[16px] min-h-[48px] flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>View Full Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Active Analysis Progression State */
          <div className="space-y-6 pt-1">
            {/* Header info */}
            <div className="space-y-1">
              <div className="text-xs text-[#6F6F6F] tracking-wide uppercase font-medium">
                Analyzing document
              </div>
              <h3 className="text-lg font-semibold text-[#171717] tracking-tight truncate">
                {file?.name || 'Document'}
              </h3>
              <p className="text-xs text-[#A6A6A6]">
                {file ? formatFileSize(file.size) : ''}
              </p>
            </div>

            {/* Natural Sequential Stage Indicators */}
            <div className="space-y-3.5 py-2">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div
                    key={stage.key}
                    className={`flex items-center gap-3 transition-opacity duration-300 ${
                      isPassed ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-35'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                        isPassed
                          ? 'bg-[#171717] text-[#FFFFFF]'
                          : isCurrent
                          ? 'border border-[#171717] text-[#171717] animate-pulse-subtle'
                          : 'border border-[#D9D9D9] text-transparent'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : '○'}
                    </div>

                    <span
                      className={`text-xs ${
                        isCurrent ? 'font-medium text-[#171717]' : isPassed ? 'text-[#333333]' : 'text-[#A6A6A6]'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Expanded details if user toggled expand */}
            {isExpanded && extractedSnippet && (
              <div className="pt-3 border-t border-[#EEEEEE] space-y-1.5 animate-fade">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[#6F6F6F]">
                  Document preview text
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-[14px] text-[11px] text-[#6F6F6F] font-mono leading-relaxed max-h-32 overflow-y-auto">
                  {extractedSnippet}...
                </div>
              </div>
            )}

            {/* Calming progress note */}
            <div className="text-[11px] text-[#A6A6A6] text-center pt-2">
              {isExpanded ? 'Swipe down to minimize' : 'Swipe up or tap arrow to view details'}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
