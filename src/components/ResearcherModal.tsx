import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { sheetsService } from '../services/sheetsService';
import { zipExportService } from '../services/zipExportService';
import { X, Check, Copy, Database, RefreshCw, Download, Trash2, ExternalLink, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface ResearcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onQueueUpdated: () => void;
}

export const ResearcherModal: React.FC<ResearcherModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onQueueUpdated
}) => {
  const [webhookUrl, setWebhookUrl] = useState(storageService.getSheetsWebhookUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isFlushing, setIsFlushing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'submissions' | 'script'>('config');

  if (!isOpen) return null;

  const submissions = storageService.getAllSubmissions();
  const queue = storageService.getOfflineQueue();

  const handleSaveWebhook = () => {
    storageService.setSheetsWebhookUrl(webhookUrl);
    onShowToast('Google Sheets Webhook URL successfully saved.');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await sheetsService.testConnection(webhookUrl);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleFlushQueue = async () => {
    setIsFlushing(true);
    const res = await sheetsService.flushOfflineQueue();
    setIsFlushing(false);
    onQueueUpdated();
    onShowToast(`Processed offline queue: ${res.syncedCount} synchronized, ${res.remainingCount} remaining.`);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sheetsService.getGoogleAppsScriptCode());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
    onShowToast('Google Apps Script code copied to clipboard!');
  };

  const handleExportCSV = () => {
    if (!submissions.length) {
      onShowToast('No submissions recorded yet to export.');
      return;
    }

    const headers = [
      'Timestamp',
      'ReferenceCode',
      'FormType',
      'Age',
      'Sex',
      'HighestQualification',
      'QualificationOther',
      'NursingExperience',
      'ICUExperience',
      'SectionBPracticesTotal',
      'SectionBPracticesMean',
      'PracticesLevel',
      'BarriersMean',
      'FacilitatorsMean',
      'OrganizationalTotal',
      'OrganizationalMean',
      'SyncedToSheets'
    ];

    const rows = submissions.map((s) => {
      const d = s.demographics || {};
      return [
        `"${s.timestamp || ''}"`,
        `"${s.referenceCode || ''}"`,
        `"${s.formType || ''}"`,
        `"${d.age || ''}"`,
        `"${d.sex || ''}"`,
        `"${d.nursingQualification || ''}"`,
        `"${d.qualificationOther || ''}"`,
        `"${d.nursingExperience || ''}"`,
        `"${d.icuExperience || ''}"`,
        `"${s.totalPracticesScore || ''}"`,
        `"${s.meanPracticesScore || ''}"`,
        `"${s.practicesLevel || ''}"`,
        `"${s.barriersMean || ''}"`,
        `"${s.facilitatorsMean || ''}"`,
        `"${s.organizationalTotal || ''}"`,
        `"${s.organizationalMean || ''}"`,
        `"${s.syncedToSheets ? 'Yes' : 'No'}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UATH_Clinical_Research_Submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported submissions to CSV.');
  };

  const handleExportJSON = () => {
    if (!submissions.length) {
      onShowToast('No submissions recorded yet to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UATH_Clinical_Research_Submissions_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported submissions to JSON.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Researcher Integration Console</h3>
              <p className="text-xs text-slate-500">Google Sheets live integration, sync queue & data management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Sheets Webhook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`py-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Responses Archive</span>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full">
              {submissions.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'script'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Apps Script Code
          </button>
        </div>

        {/* Tab 1: Config */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'config' && (
            <>
              <div>
                <label htmlFor="webhook-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Google Apps Script Web App Endpoint URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="webhook-input"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveWebhook}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Submissions are posted via HTTP POST payload directly into your Google Sheet. If offline or unreachable, responses queue locally.
                </p>
              </div>

              {/* Ping Connection Test */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Connection Verification</span>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !webhookUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Send Test Ping</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`text-xs p-3 rounded-lg border flex items-start gap-2 ${
                      testResult.success
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-red-50 text-red-900 border-red-200'
                    }`}
                  >
                    {testResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Offline Transmission Queue Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800">Local Offline Queue</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {queue.length} responses pending synchronization
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFlushQueue}
                  disabled={isFlushing || queue.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
                  <span>Flush Queue</span>
                </button>
              </div>
            </>
          )}

          {/* Tab 2: Submissions */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {submissions.length} Total Recorded Clinical Responses
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No survey responses recorded on this device yet.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{sub.referenceCode}</div>
                        <div className="text-slate-500">
                          Appendix II ICU Questionnaire · {sub.demographics?.nursingQualification || 'Nurse'} · {new Date(sub.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          sub.syncedToSheets ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.syncedToSheets ? 'Synced' : 'Local Only'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Script */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Google Apps Script Deployment Code
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied!' : 'Copy Entire Script'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed">
                {sheetsService.getGoogleAppsScriptCode()}
              </pre>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 space-y-1">
                <strong>Deployment Quick-Step:</strong>
                <div>1. In Google Sheets: Extensions &gt; Apps Script. Paste this code.</div>
                <div>2. Deploy &gt; New deployment &gt; Select &ldquo;Web app&rdquo;.</div>
                <div>3. Who has access: set to &ldquo;Anyone&rdquo;. Copy the Web App URL back into Tab 1.</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => zipExportService.downloadQuestionnairePackage()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Questionnaires (.ZIP)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
