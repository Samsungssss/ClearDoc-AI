import { DocumentAnalysis } from '../types/document';
import { SAMPLE_HOUSING_NOTICE } from '../data/sampleDocuments';

const STORAGE_KEY = 'cleardoc_analyzed_documents_v1';

export function getStoredDocuments(): DocumentAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample document for immediate testing
      const initial = [SAMPLE_HOUSING_NOTICE];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return [SAMPLE_HOUSING_NOTICE];
  }
}

export function saveStoredDocument(document: DocumentAnalysis): void {
  try {
    const docs = getStoredDocuments();
    const existingIndex = docs.findIndex((d) => d.id === document.id);
    let updated: DocumentAnalysis[];
    if (existingIndex >= 0) {
      updated = [...docs];
      updated[existingIndex] = document;
    } else {
      updated = [document, ...docs];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function deleteStoredDocument(id: string): void {
  try {
    const docs = getStoredDocuments();
    const updated = docs.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete from localStorage:', e);
  }
}

export function clearAllStoredDocuments(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}

export function toggleStoredActionItem(documentId: string, actionId: string): DocumentAnalysis | null {
  try {
    const docs = getStoredDocuments();
    const docIndex = docs.findIndex((d) => d.id === documentId);
    if (docIndex === -1) return null;

    const doc = { ...docs[docIndex] };
    doc.actionPlan = doc.actionPlan.map((item) =>
      item.id === actionId ? { ...item, completed: !item.completed } : item
    );

    docs[docIndex] = doc;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    return doc;
  } catch (e) {
    console.error('Failed to toggle action item:', e);
    return null;
  }
}
