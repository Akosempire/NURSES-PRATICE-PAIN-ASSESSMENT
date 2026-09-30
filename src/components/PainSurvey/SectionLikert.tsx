import React from 'react';
import { QuestionItem, ScaleOption } from '../../types/survey';
import { CheckCircle2 } from 'lucide-react';

interface SectionLikertProps {
  sectionTitle: string;
  sectionSubtitle: string;
  instructions: string;
  scaleOptions: ScaleOption[];
  items: QuestionItem[];
  values: Record<string, number>;
  onChange: (code: string, value: number) => void;
  highlightIncomplete?: boolean;
}

export const SectionLikert: React.FC<SectionLikertProps> = ({
  sectionTitle,
  sectionSubtitle,
  instructions,
  scaleOptions,
  items,
  values,
  onChange,
  highlightIncomplete = false
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Section Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {sectionTitle}
        </h3>
        <p className="text-xs text-blue-700 font-medium mt-0.5">
          {sectionSubtitle}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <strong>Instruction:</strong> {instructions}
        </p>
      </div>

      {/* Scale Legend Key */}
      <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3 sm:p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          RESPONSE SCALE KEY:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scaleOptions.map((opt) => (
            <div key={opt.value} className="bg-white rounded-lg border border-slate-200 p-2 text-center shadow-2xs">
              <div className="text-xs font-bold text-slate-900">{opt.shortLabel}</div>
              {opt.subtext && (
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.subtext}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question Items List */}
      <div className="space-y-4">
        {items.map((item) => {
          const selectedValue = values[item.code];
          const isAnswered = selectedValue !== undefined;
          const isMissing = highlightIncomplete && !isAnswered;

          return (
            <div
              key={item.code}
              id={`question-${item.code}`}
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden ${
                isMissing
                  ? 'border-red-400 bg-red-50/20'
                  : isAnswered
                  ? 'border-emerald-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Left vertical indicator: subtle gray to emerald green */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors duration-200 ${
                  isAnswered ? 'bg-emerald-500' : isMissing ? 'bg-red-400' : 'bg-slate-200'
                }`}
              />

              <div className="pl-1 sm:pl-2">
                {/* Item Code & Category */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    {item.category && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate max-w-[200px] sm:max-w-none">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {isAnswered && (
                    <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Answered</span>
                    </span>
                  )}
                </div>

                {/* Prompt Statement */}
                <p className="text-sm sm:text-base font-medium text-slate-900 leading-snug">
                  {item.title}
                </p>

                {item.hint && (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    {item.hint}
                  </p>
                )}

                {/* Response Options */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {/* Responsive Grid: 2 columns on mobile, 4 columns on tablet & desktop */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {scaleOptions.map((opt) => {
                      const isOptionSelected = selectedValue === opt.value;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => onChange(item.code, opt.value)}
                          className={`flex flex-col sm:flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer min-h-[46px] sm:min-h-[52px] ${
                            isOptionSelected
                              ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                          <span className={`text-[10px] font-mono mt-0.5 ${
                            isOptionSelected ? 'text-blue-700 font-bold' : 'text-slate-400'
                          }`}>
                            ({opt.value})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isMissing && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    Please provide your clinical response for {item.code}.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
