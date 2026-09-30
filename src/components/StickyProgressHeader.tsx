import React from 'react';
import { CheckCircle2, WifiOff } from 'lucide-react';

interface StickyProgressHeaderProps {
  studyTitle: string;
  documentId: string;
  currentSectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  answeredCount: number;
  totalQuestionsInSection: number;
  overallPercentage: number;
  isOnline: boolean;
}

export const StickyProgressHeader: React.FC<StickyProgressHeaderProps> = ({
  documentId,
  currentSectionTitle,
  sectionIndex,
  totalSections,
  answeredCount,
  totalQuestionsInSection,
  overallPercentage,
  isOnline
}) => {
  return (
    <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-2xs">
      {/* 6px Top edge progress bar */}
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-blue-700 font-semibold">{documentId}</span>
            <span aria-hidden="true">·</span>
            <span>Section {sectionIndex} of {totalSections}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
            {currentSectionTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Question Count Tracker */}
          {totalQuestionsInSection > 0 && (
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900">
                <span className="font-mono tabular-nums">{answeredCount}</span> of{' '}
                <span className="font-mono tabular-nums">{totalQuestionsInSection}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {answeredCount === totalQuestionsInSection ? (
                  <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                ) : (
                  <span>answered</span>
                )}
              </div>
            </div>
          )}

          {/* Gentle offline indicator only if connection drops */}
          {!isOnline && (
            <div
              title="You are offline. Responses are stored locally and will sync once reconnected."
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md"
            >
              <WifiOff className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">Offline Mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
