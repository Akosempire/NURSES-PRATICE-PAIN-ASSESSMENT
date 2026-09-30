import React from 'react';
import { Download, Share2, Database, FileSpreadsheet, ClipboardCheck, Lock, Eye, LogOut, Shield } from 'lucide-react';
import { INSTITUTIONAL_INFO } from '../data/painSurveyData';

interface HospitalHeaderProps {
  isAdminMode: boolean;
  onToggleAdminMode: (enabled: boolean) => void;
  activeView: 'survey' | 'preview';
  onToggleView: (view: 'survey' | 'preview') => void;
  onOpenResearcherModal: () => void;
  onDownloadPackage: () => void;
  onCopyShareLink: () => void;
  offlineQueueCount: number;
  hasWebhookConfigured: boolean;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({
  isAdminMode,
  onToggleAdminMode,
  activeView,
  onToggleView,
  onOpenResearcherModal,
  onDownloadPackage,
  onCopyShareLink,
  offlineQueueCount,
  hasWebhookConfigured
}) => {
  // If Respondent View (Standard default view for nurses)
  if (!isAdminMode) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Institutional Hospital Wordmark & Details */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0 tracking-wider">
              UATH
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {INSTITUTIONAL_INFO.hospital}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {INSTITUTIONAL_INFO.institution} · <span className="text-blue-700 font-semibold">{INSTITUTIONAL_INFO.documentIdentifier}</span>
              </div>
            </div>
          </div>

          {/* Respondent Assurance Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">100% Anonymous & Voluntary</span>
            <span className="sm:hidden">Anonymous</span>
          </div>
        </div>
      </header>
    );
  }

  // If Researcher / Faculty Mode is unlocked
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Researcher Mode Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
            UATH
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight flex items-center gap-1.5">
              <span>Researcher Console</span>
              <span className="px-1.5 py-0.2 bg-blue-600/60 text-blue-200 text-[10px] font-mono rounded">FACULTY</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-slate-400">
              {INSTITUTIONAL_INFO.hospital}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Controls for Investigator */}
        <nav className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onToggleView('survey')}
            className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeView === 'survey'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Questionnaire</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleView('preview')}
            className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeView === 'preview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheets Preview</span>
          </button>
        </nav>

        {/* Zone 3: Researcher Actions */}
        <div className="flex items-center gap-2">
          {/* Share Direct Link */}
          <button
            type="button"
            onClick={onCopyShareLink}
            title="Copy respondent link"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          {/* Download Package */}
          <button
            type="button"
            onClick={onDownloadPackage}
            title="Download full research package (.ZIP)"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Package (.ZIP)</span>
          </button>

          {/* Sheets Sync Configuration Modal */}
          <button
            type="button"
            onClick={onOpenResearcherModal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              hasWebhookConfigured
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-700 hover:bg-amber-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sheets Sync</span>
            {offlineQueueCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded text-[10px] font-mono">
                {offlineQueueCount}
              </span>
            )}
          </button>

          {/* Exit to Respondent View */}
          <button
            type="button"
            onClick={() => onToggleAdminMode(false)}
            title="Exit to Respondent View"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Respondent View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
