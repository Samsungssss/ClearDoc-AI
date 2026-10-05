export interface ImportantDeadline {
  title: string;
  date: string;
  timeRemaining?: string;
  consequence: string;
  isUrgent: boolean;
}

export interface ImportantAmount {
  label: string;
  amount: string;
  currency: string;
  dueDate?: string;
  isPayableByYou: boolean;
  paymentMethodOrNotes?: string;
}

export interface RequiredDocument {
  name: string;
  purpose: string;
  isOriginalRequired?: boolean;
}

export interface ContactInfo {
  nameOrEntity: string;
  role: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

export interface ReferenceNumber {
  type: string;
  value: string;
  notes?: string;
}

export interface WarningItem {
  title: string;
  detail: string;
  severity: 'critical' | 'warning' | 'notice';
}

export interface ActionPlanItem {
  id: string;
  stepNumber: number;
  task: string;
  details: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface JargonTerm {
  term: string;
  simpleExplanation: string;
}

export interface MissingInfoItem {
  item: string;
  whyItMatters: string;
  recommendation: string;
}

export interface ImportantSection {
  title: string;
  originalQuote?: string;
  simplifiedMeaning: string;
}

export interface DeepThinkingAnalysis {
  clauseBreakdown: Array<{
    clause: string;
    riskLevel: 'high' | 'moderate' | 'low';
    finding: string;
    userImpact: string;
  }>;
  hiddenRisks: string[];
  unfavorableTerms: string[];
  strategicAdvice: string[];
}

export interface DocumentTranslation {
  language: string;
  languageCode: string;
  simpleSummary: string;
  whatItMeans: string;
  actionPlan: Array<{ task: string; details: string }>;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  documentType: string;
  oneSentenceSummary: string;
  shortSummary: string;
  detailedSummary: string;
  whatItMeans: {
    overview: string;
    plainLanguageExplanation: string[];
    jargonExplained: JargonTerm[];
  };
  importantInformation: {
    deadlines: ImportantDeadline[];
    amounts: ImportantAmount[];
    requiredDocuments: RequiredDocument[];
    contactInformation: ContactInfo[];
    referenceNumbers: ReferenceNumber[];
    warnings: WarningItem[];
  };
  actionPlan: ActionPlanItem[];
  missingInformation: MissingInfoItem[];
  importantSections: ImportantSection[];
  deepThinkingAnalysis?: DeepThinkingAnalysis;
  translations?: Record<string, DocumentTranslation>;
  extractedText: string;
  previewUrl?: string;
  isSample?: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  usedThinking?: boolean;
  usedSearchGrounding?: boolean;
  groundingSources?: Array<{ uri: string; title: string }>;
  sourceFoundInDoc: boolean;
  aiInterpretationWarning?: string;
}
