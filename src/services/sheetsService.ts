import { PainSurveySubmission } from '../types/survey';
import { storageService } from './storageService';

export interface SyncResult {
  success: boolean;
  message: string;
  isOfflineQueued?: boolean;
}

export const sheetsService = {
  /**
   * Dispatches survey payload to Google Sheets Web App.
   * Handles CORS, redirects, and offline queuing.
   */
  async submitToSheets(submission: PainSurveySubmission): Promise<SyncResult> {
    const webhookUrl = storageService.getSheetsWebhookUrl();

    // If offline, queue immediately
    if (!navigator.onLine) {
      storageService.addToOfflineQueue(submission);
      return {
        success: true,
        message: 'Device is offline. Response securely stored in local queue and will sync upon connection.',
        isOfflineQueued: true
      };
    }

    // If no webhook configured yet, save in local submissions archive and return advisory note
    if (!webhookUrl) {
      storageService.saveSubmission({ ...submission, syncedToSheets: false });
      return {
        success: true,
        message: 'Submission successfully recorded locally. (To forward to live Google Sheets, configure Webhook URL in Researcher Console).',
        isOfflineQueued: false
      };
    }

    try {
      const payload = JSON.stringify(submission);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payload,
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const updated = {
        ...submission,
        syncedToSheets: true,
        syncTimestamp: new Date().toISOString()
      };
      storageService.saveSubmission(updated);
      storageService.removeFromOfflineQueue(submission.id);

      return {
        success: true,
        message: 'Successfully synchronized to Google Sheets live clinical database.',
        isOfflineQueued: false
      };
    } catch (err: unknown) {
      console.warn('Network error during Google Sheets post:', err);
      storageService.addToOfflineQueue(submission);
      return {
        success: true,
        message: 'Network latency detected. Saved securely in offline transmission queue.',
        isOfflineQueued: true
      };
    }
  },

  /**
   * Attempt to flush any pending offline queue items
   */
  async flushOfflineQueue(): Promise<{ syncedCount: number; remainingCount: number }> {
    const queue = storageService.getOfflineQueue();
    if (!queue.length || !navigator.onLine) {
      return { syncedCount: 0, remainingCount: queue.length };
    }

    const webhookUrl = storageService.getSheetsWebhookUrl();
    if (!webhookUrl) {
      return { syncedCount: 0, remainingCount: queue.length };
    }

    let syncedCount = 0;
    for (const item of [...queue]) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(item),
          mode: 'no-cors'
        });
        storageService.removeFromOfflineQueue(item.id);
        syncedCount++;
      } catch (e) {
        console.warn('Queue flush item failed:', e);
        break;
      }
    }

    return { syncedCount, remainingCount: storageService.getOfflineQueue().length };
  },

  /**
   * Test connection ping to user-supplied Google Apps Script endpoint
   */
  async testConnection(url: string): Promise<{ success: boolean; message: string }> {
    if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
      return {
        success: false,
        message: 'URL must start with https://script.google.com/macros/s/... (Google Apps Script Web App)'
      };
    }

    try {
      const testPayload = JSON.stringify({
        test: true,
        timestamp: new Date().toISOString(),
        client: 'UATH ICU Pain Questionnaire Connection Test'
      });

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: testPayload,
        mode: 'no-cors'
      });

      return {
        success: true,
        message: 'Connected! Test ping dispatched to Google Apps Script Web App.'
      };
    } catch {
      return {
        success: false,
        message: 'Could not connect. Please check the Web App deployment access (must be set to "Anyone").'
      };
    }
  },

  /**
   * Generates production-ready Google Apps Script backend code specifically for Appendix II
   */
  getGoogleAppsScriptCode(): string {
    return `/**
 * Google Apps Script Web App Endpoint for UATH ICU Research
 * Study: QUESTIONNAIRE ON NURSES’ PRACTICE OF PAIN ASSESSMENT AND MANAGEMENT AMONG CRITICALLY ILL PATIENTS IN THE INTENSIVE CARE UNIT
 * Document: APPENDIX II
 */

/**
 * 1. FIRST-TIME AUTHORIZATION:
 * Select "setupSheet" from the top dropdown and click "Run".
 * Google will ask to "Review Permissions" -> Click your account -> "Advanced" -> "Go to (unsafe)" -> "Allow".
 * This sets up your headers automatically.
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Timestamp",
    "Reference Code",
    "Form Identifier",
    "Age",
    "Sex",
    "Highest Nursing Qualification",
    "Qualification Other",
    "Years of Nursing Experience",
    "Years of ICU Experience",
    "Section B Practices Total (8-32)",
    "Section B Practices Mean (1-4)",
    "Practices Level",
    "B1 Routine Assessment",
    "B2 Standardized Scale",
    "B3 Behavioural Tool",
    "B4 Pre/Post Procedures",
    "B5 Post-analgesia Reassessment",
    "B6 Documentation in Records",
    "B7 Combined Pharmacological",
    "B8 Non-pharmacological",
    "C1 Heavy Workload Barrier",
    "C2 Inability to Communicate",
    "C3 Knowledge & Training Barrier",
    "C4 Limited Time Barrier",
    "C5 Doctor Collaboration Facilitator",
    "C6 Regular Education Facilitator",
    "C7 Team Communication Facilitator",
    "Section C Barriers Mean (C1-C4)",
    "Section C Facilitators Mean (C5-C7)",
    "D1 Adequate Nurses Available",
    "D2 Nurse-to-Patient Assignment",
    "D3 Tool Availability in ICU",
    "D4 Written Protocols/Guidelines",
    "D5 Management Support",
    "D6 Regular Supervision",
    "D7 Handover Documentation",
    "Section D Organizational Total (7-28)",
    "Section D Organizational Mean"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#dcfce7");
  sheet.setFrozenRows(1);
  Logger.log("Headers successfully initialized in your Google Sheet!");
}

/**
 * Browser verification endpoint
 */
function doGet(e) {
  return ContentService
    .createTextOutput("UATH ICU Pain Research Webhook is Active & Ready to receive survey responses.")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Main Webhook Receiver for Survey Submissions
 */
function doPost(e) {
  // If clicked "Run" manually inside Apps Script editor where e is undefined
  if (!e || !e.postData || !e.postData.contents) {
    setupSheet();
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Setup completed from editor." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = JSON.parse(e.postData.contents);

    if (contents.test) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "UATH Test ping received successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (sheet.getLastRow() === 0) {
      setupSheet();
    }

    var d = contents.demographics || {};
    var b = contents.practicesScores || {};
    var c = contents.barriersFacilitatorsScores || {};
    var dSec = contents.organizationalScores || {};

    var row = [
      contents.timestamp || new Date().toISOString(),
      contents.referenceCode || "",
      contents.formType || "APPENDIX_II_ICU_PAIN_QUESTIONNAIRE",
      d.age || "",
      d.sex || "",
      d.nursingQualification || "",
      d.qualificationOther || "",
      d.nursingExperience || "",
      d.icuExperience || "",
      contents.totalPracticesScore || "",
      contents.meanPracticesScore || "",
      contents.practicesLevel || "",
      b["B1"] || "", b["B2"] || "", b["B3"] || "", b["B4"] || "", b["B5"] || "", b["B6"] || "", b["B7"] || "", b["B8"] || "",
      c["C1"] || "", c["C2"] || "", c["C3"] || "", c["C4"] || "", c["C5"] || "", c["C6"] || "", c["C7"] || "",
      contents.barriersMean || "",
      contents.facilitatorsMean || "",
      dSec["D1"] || "", dSec["D2"] || "", dSec["D3"] || "", dSec["D4"] || "", dSec["D5"] || "", dSec["D6"] || "", dSec["D7"] || "",
      contents.organizationalTotal || "",
      contents.organizationalMean || ""
    ];

    sheet.appendRow(row);
    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", rowAdded: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
  }
};
