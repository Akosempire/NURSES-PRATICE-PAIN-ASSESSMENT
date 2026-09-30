import React from 'react';
import { ArrowRight, RotateCcw, ShieldCheck, HeartPulse, Building2, BookOpen, Clock, FileCheck } from 'lucide-react';
import { INSTITUTIONAL_INFO } from '../../data/painSurveyData';
import { PainSurveyDraft } from '../../types/survey';

interface PainWelcomeScreenProps {
  existingDraft: PainSurveyDraft | null;
  onResumeDraft: () => void;
  onStartFresh: () => void;
  onClearDraft: () => void;
}

export const PainWelcomeScreen: React.FC<PainWelcomeScreenProps> = ({
  existingDraft,
  onResumeDraft,
  onStartFresh,
  onClearDraft
}) => {
  const hasDraft = !!existingDraft && existingDraft.currentStep > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Draft Notification Banner */}
      {hasDraft && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-950">In-Progress Questionnaire Found</h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Saved from previous session (Step {existingDraft.currentStep} · Last updated:{' '}
                {new Date(existingDraft.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClearDraft}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onResumeDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Resume Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Institutional Preamble Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Header Branding */}
        <div className="border-b border-slate-100 pb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>{INSTITUTIONAL_INFO.institution} · {INSTITUTIONAL_INFO.hospital}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {INSTITUTIONAL_INFO.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-mono text-slate-700 font-semibold">{INSTITUTIONAL_INFO.documentIdentifier}</span>
            <span aria-hidden="true">·</span>
            <span>{INSTITUTIONAL_INFO.programme}</span>
            <span aria-hidden="true">·</span>
            <span>{INSTITUTIONAL_INFO.location}</span>
          </div>
        </div>

        {/* Formal Nursing Letter of Introduction */}
        <div className="py-6 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-slate-900">
            Dear Colleague / Respondent,
          </p>

          <p>
            I am a postgraduate critical care nursing student at the <strong>College of Nursing Science, University of Abuja Teaching Hospital (UATH), Gwagwalada</strong>. I am carrying out an academic research project investigating <em>&ldquo;Nurses’ Practice of Pain Assessment and Management Among Critically Ill Patients&rdquo;</em> in acute and intensive care units.
          </p>

          <p>
            You have been selected to participate because of your critical role and hands-on clinical experience in caring for acute and critically ill patients. Your insights will directly inform nursing clinical practice, pain documentation protocols, and patient outcomes in critical care.
          </p>

          {/* Ethical Research Safeguards Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical Protocols & Respondent Protections</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>Voluntary & Anonymous:</strong> Participation is entirely voluntary and your identity remains strictly anonymous.</li>
              <li><strong>Zero Identifiers:</strong> No names, personal IDs, telephone numbers, or hospital numbers are required.</li>
              <li><strong>Aggregate Scholarship:</strong> All collected data will be analyzed and published only in aggregate form.</li>
              <li><strong>Authentic Practice:</strong> There are no right or wrong answers; your sincere clinical feedback represents the true strength of this study.</li>
            </ol>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm italic">
            Thank you immensely for your time, professional commitment, and contribution to advancing critical care nursing scholarship.
          </p>
        </div>

        {/* Clinical Scope Chips */}
        <div className="border-t border-slate-100 pt-5">
          <div className="text-xs font-semibold text-slate-500 mb-2">TARGET CLINICAL SETTING:</div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-700">
            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-md font-semibold">
              Intensive Care Unit (ICU) Nurses & Nursing Officers
            </span>
          </div>
        </div>

        {/* Main CTA Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Estimated completion: 6–8 minutes</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasDraft && (
              <button
                type="button"
                onClick={onResumeDraft}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                <span>Resume Saved Draft</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartFresh}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{hasDraft ? 'Start Anew' : 'Begin Questionnaire'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
