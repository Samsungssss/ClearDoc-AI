import React, { useState, useEffect, useRef } from 'react';
import { DocumentAnalysis } from './types/document';
import { SAMPLE_HOUSING_NOTICE } from './data/sampleDocuments';
import {
  getStoredDocuments,
  saveStoredDocument,
  deleteStoredDocument,
  clearAllStoredDocuments,
} from './utils/storage';
import { FloatingNav } from './components/FloatingNav';
import { HomeScreen } from './components/HomeScreen';
import { ResultScreen } from './components/ResultScreen';
import { DocumentsScreen } from './components/DocumentsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AnalysisSheet } from './components/AnalysisSheet';
import { BottomSheet } from './components/BottomSheet';
import { FileText, Camera, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'documents' | 'settings'>('home');
  const [activeView, setActiveView] = useState<'main' | 'result'>('main');
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentAnalysis | null>(null);

  // Analysis Sheet state
  const [analyzingFile, setAnalyzingFile] = useState<File | null>(null);
  const [isAnalysisSheetOpen, setIsAnalysisSheetOpen] = useState(false);

  // Quick Action Sheet (when clicking Analyze on Floating Nav)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load stored documents on mount
  useEffect(() => {
    const loaded = getStoredDocuments();
    setDocuments(loaded);
  }, []);

  const handleFileSelected = (file: File) => {
    setAnalyzingFile(file);
    setIsAnalysisSheetOpen(true);
    setIsActionSheetOpen(false);
  };

  const handleAnalysisSuccess = (doc: DocumentAnalysis) => {
    saveStoredDocument(doc);
    const updated = getStoredDocuments();
    setDocuments(updated);
    setSelectedDocument(doc);
    setIsAnalysisSheetOpen(false);
    setAnalyzingFile(null);
    setActiveView('result');
  };

  const handleTrySample = () => {
    saveStoredDocument(SAMPLE_HOUSING_NOTICE);
    const updated = getStoredDocuments();
    setDocuments(updated);
    setSelectedDocument(SAMPLE_HOUSING_NOTICE);
    setIsActionSheetOpen(false);
    setActiveView('result');
  };

  const handleOpenDocument = (doc: DocumentAnalysis) => {
    setSelectedDocument(doc);
    setActiveView('result');
  };

  const handleUpdateDocument = (updatedDoc: DocumentAnalysis) => {
    saveStoredDocument(updatedDoc);
    const updated = getStoredDocuments();
    setDocuments(updated);
    setSelectedDocument(updatedDoc);
  };

  const handleDeleteDocument = (id: string) => {
    deleteStoredDocument(id);
    const updated = getStoredDocuments();
    setDocuments(updated);
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
      setActiveView('main');
      setCurrentTab('home');
    }
  };

  const handleClearAllData = () => {
    clearAllStoredDocuments();
    setDocuments([]);
    setSelectedDocument(null);
    setActiveView('main');
    setCurrentTab('home');
  };

  const handleReloadSample = () => {
    setDocuments(getStoredDocuments());
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#171717] flex flex-col font-sans selection:bg-[#EEEEEE] selection:text-[#000000]">
      {/* Main App Content */}
      <main className="flex-1 w-full max-w-full">
        {activeView === 'result' && selectedDocument ? (
          <ResultScreen
            document={selectedDocument}
            onUpdateDocument={handleUpdateDocument}
            onBack={() => setActiveView('main')}
            onDeleteDocument={handleDeleteDocument}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                documents={documents}
                onFileSelected={handleFileSelected}
                onOpenDocument={handleOpenDocument}
                onDeleteDocument={handleDeleteDocument}
                onTrySample={handleTrySample}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsScreen
                documents={documents}
                onOpenDocument={handleOpenDocument}
                onDeleteDocument={handleDeleteDocument}
                onNavigateToAnalyze={() => setIsActionSheetOpen(true)}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsScreen
                documentCount={documents.length}
                onClearAllData={handleClearAllData}
                onReloadSample={handleReloadSample}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation — Visible on Main Views */}
      {activeView === 'main' && (
        <FloatingNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenAnalyze={() => setIsActionSheetOpen(true)}
          documentCount={documents.length}
        />
      )}

      {/* Quick Action Bottom Sheet (from floating Analyze button) */}
      <BottomSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        title="Analyze a Document"
        subtitle="Choose how to input your document"
      >
        <div className="space-y-2 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3.5 p-4 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[52px] transition-colors"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Choose File</span>
              <span className="text-xs text-[#6F6F6F]">PDF, DOC, PNG, or JPG</span>
            </div>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center gap-3.5 p-4 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[52px] transition-colors"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Take Photo</span>
              <span className="text-xs text-[#6F6F6F]">Capture document with camera</span>
            </div>
          </button>

          <button
            onClick={handleTrySample}
            className="w-full flex items-center gap-3.5 p-4 rounded-[16px] hover:bg-[#F5F5F5] text-left text-sm font-medium text-[#171717] min-h-[52px] transition-colors"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#F5F5F5] border border-[#EEEEEE] flex items-center justify-center text-[#171717]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Try Sample Document</span>
              <span className="text-xs text-[#6F6F6F]">Inspect a realistic municipal housing notice</span>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Primary Analysis Bottom Sheet (As requested in Section 6, 7 & 8) */}
      <AnalysisSheet
        isOpen={isAnalysisSheetOpen}
        file={analyzingFile}
        onClose={() => {
          setIsAnalysisSheetOpen(false);
          setAnalyzingFile(null);
        }}
        onAnalysisSuccess={handleAnalysisSuccess}
      />

      {/* Hidden File / Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,application/pdf,image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
