import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface StickyFloatingFooterProps {
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isLastSection: boolean;
  progressPercentage: number;
  validationError?: string | null;
  nextButtonText?: string;
}

export const StickyFloatingFooter: React.FC<StickyFloatingFooterProps> = ({
  canGoBack,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  isLastSection,
  progressPercentage,
  validationError,
  nextButtonText
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-md">
      {/* Validation notice alert banner */}
      {validationError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs font-medium text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Previous Button */}
        <div>
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Previous</span>
            </button>
          ) : (
            <div className="w-24" />
          )}
        </div>

        {/* Center Progress Metric */}
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-900">
            <span className="font-mono tabular-nums">{Math.round(progressPercentage)}%</span> Completed
          </div>
          <div className="w-24 sm:w-36 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden mx-auto">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>

        {/* Next / Submit Button */}
        <div>
          {isLastSection ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs disabled:opacity-60 cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Submit Questionnaire ✓</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs cursor-pointer min-h-[44px]"
            >
              <span>{nextButtonText || 'Next Section'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
