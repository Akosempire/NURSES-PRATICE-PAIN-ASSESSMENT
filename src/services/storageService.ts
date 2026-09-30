import { PainSurveyDraft, PainSurveySubmission } from '../types/survey';

const PAIN_DRAFT_KEY = 'pain_assessment_draft_v1';
const QUEUE_KEY = 'uath_offline_queue';
const SUBMISSIONS_KEY = 'uath_all_submissions';
const SHEETS_WEBHOOK_KEY = 'uath_sheets_webhook_url';

export const storageService = {
  // --- Pain Draft ---
  savePainDraft(draft: PainSurveyDraft): void {
    try {
      localStorage.setItem(PAIN_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save pain draft:', e);
    }
  },

  getPainDraft(): PainSurveyDraft | null {
    try {
      const data = localStorage.getItem(PAIN_DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearPainDraft(): void {
    try {
      localStorage.removeItem(PAIN_DRAFT_KEY);
    } catch (e) {
      console.warn('Failed to clear pain draft:', e);
    }
  },

  // --- Offline Submission Queue ---
  getOfflineQueue(): PainSurveySubmission[] {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToOfflineQueue(submission: PainSurveySubmission): void {
    try {
      const current = this.getOfflineQueue();
      const filtered = current.filter(item => item.id !== submission.id);
      filtered.push(submission);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to add to offline queue:', e);
    }
  },

  removeFromOfflineQueue(id: string): void {
    try {
      const current = this.getOfflineQueue();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to remove from offline queue:', e);
    }
  },

  // --- Submissions Archive ---
  getAllSubmissions(): PainSurveySubmission[] {
    try {
      const data = localStorage.getItem(SUBMISSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSubmission(submission: PainSurveySubmission): void {
    try {
      const current = this.getAllSubmissions();
      current.unshift(submission);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to save submission:', e);
    }
  },

  // --- Google Sheets Webhook URL ---
  getSheetsWebhookUrl(): string {
    try {
      const stored = localStorage.getItem(SHEETS_WEBHOOK_KEY);
      if (stored && stored.trim()) return stored.trim();
      const envUrl = (import.meta as any).env?.VITE_SHEETS_WEBHOOK_URL;
      return envUrl ? String(envUrl).trim() : '';
    } catch {
      return '';
    }
  },

  setSheetsWebhookUrl(url: string): void {
    try {
      localStorage.setItem(SHEETS_WEBHOOK_KEY, url.trim());
    } catch (e) {
      console.warn('Failed to set webhook URL:', e);
    }
  },

  // --- Helpers ---
  generateReferenceCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randSeg1 = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randSeg2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `UATH-ICU-${randSeg1}-${randSeg2}`;
  }
};
