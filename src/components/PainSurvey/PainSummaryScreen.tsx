import React, { useState } from 'react';
import { PainSurveySubmission } from '../../types/survey';
import { INSTITUTIONAL_INFO } from '../../data/painSurveyData';
import { CheckCircle2, Copy, Check, Printer, RotateCcw, Building2, ShieldCheck, Activity, Award, ArrowRight } from 'lucide-react';

interface PainSummaryScreenProps {
  submission: PainSurveySubmission;
  onResetToStart: () => void;
  onNewSubmission: () => void;
}

export const PainSummaryScreen: React.FC<PainSummaryScreenProps> = ({
  submission,
  onResetToStart,
  onNewSubmission
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'High Practice':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Moderate Practice':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Low / Suboptimal Practice':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Success Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>{INSTITUTIONAL_INFO.institution} · {INSTITUTIONAL_INFO.hospital}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            ICU Research Submission Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            {INSTITUTIONAL_INFO.title}
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            OFFICIAL RESEARCH REFERENCE CODE
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-base sm:text-lg font-bold text-slate-900 tracking-wider">
              {submission.referenceCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              title="Copy reference code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Recorded: {new Date(submission.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid - Appendix II Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Section B Practices */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Section B: Practices
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getBadgeStyle(submission.practicesLevel)}`}>
              {submission.practicesLevel}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {submission.totalPracticesScore}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 32 max</span>
            <span className="text-xs text-blue-700 font-semibold ml-auto font-mono">
              Mean: {submission.meanPracticesScore} / 4.0
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                submission.practicesLevel === 'High Practice' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(submission.totalPracticesScore / 32) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Calculated across routine assessment, standardized tools, procedure evaluation, and non-pharmacological care.
          </p>
        </div>

        {/* Metric 2: Section C Barriers & Facilitators */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Section C: Barriers & Facilitators
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Perceived Barriers (C1-C4):</span>
              <span className="font-mono font-bold text-amber-700">{submission.barriersMean} / 4.0</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Practice Facilitators (C5-C7):</span>
              <span className="font-mono font-bold text-emerald-700">{submission.facilitatorsMean} / 4.0</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            Measures workload and communication obstacles against interprofessional collaboration facilitators.
          </p>
        </div>

        {/* Metric 3: Section D Organizational Factors */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Section D: Organizational Factors
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {submission.organizationalTotal}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 28 max</span>
            <span className="text-xs text-blue-700 font-semibold ml-auto font-mono">
              Mean: {submission.organizationalMean} / 4.0
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="h-1.5 rounded-full bg-blue-600"
              style={{ width: `${(submission.organizationalTotal / 28) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Evaluates ICU staffing adequacy, assignment feasibility, written guidelines, and supervision.
          </p>
        </div>
      </div>

      {/* Respondent Clinical Profile Snapshot (Section A) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          SECTION A: RESPONDENT DEMOGRAPHIC & PROFESSIONAL PROFILE
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400">Age Bracket</div>
            <div className="font-semibold text-slate-900 mt-0.5">{submission.demographics.age}</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400">Biological Sex</div>
            <div className="font-semibold text-slate-900 mt-0.5">{submission.demographics.sex}</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400">Qualification</div>
            <div className="font-semibold text-slate-900 truncate mt-0.5" title={submission.demographics.nursingQualification}>
              {submission.demographics.nursingQualification}
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400">ICU Experience</div>
            <div className="font-semibold text-slate-900 mt-0.5">{submission.demographics.icuExperience}</div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Official Record</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToStart}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={onNewSubmission}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Submit Another Response</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
