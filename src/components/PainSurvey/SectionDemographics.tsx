import React from 'react';
import { DemographicData } from '../../types/survey';
import { SECTION_A_CONFIG } from '../../data/painSurveyData';
import { Check } from 'lucide-react';

interface SectionDemographicsProps {
  data: Partial<DemographicData>;
  onChange: (updated: Partial<DemographicData>) => void;
  errors: Record<string, string>;
}

export const SectionDemographics: React.FC<SectionDemographicsProps> = ({
  data,
  onChange,
  errors
}) => {
  const updateField = (field: keyof DemographicData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Intro Card matching PDF page 1 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
          APPENDIX II · PAGE 1
        </div>
        <h3 className="text-base font-bold text-slate-900 mt-1">
          SECTION A: SOCIO-DEMOGRAPHIC AND PROFESSIONAL CHARACTERISTICS
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Please tick (✓) the option that best describes you.
        </p>
      </div>

      {/* Age */}
      <div className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative overflow-hidden ${
        errors.age ? 'border-red-400 bg-red-50/20' : data.age ? 'border-emerald-300' : 'border-slate-200'
      }`}>
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${data.age ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Age</span>
          {data.age && <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Selected</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SECTION_A_CONFIG.ageOptions.map((opt) => {
            const isSelected = data.age === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateField('age', opt)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.age && <p className="text-xs text-red-600 mt-2 font-medium">{errors.age}</p>}
      </div>

      {/* Sex */}
      <div className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative overflow-hidden ${
        errors.sex ? 'border-red-400 bg-red-50/20' : data.sex ? 'border-emerald-300' : 'border-slate-200'
      }`}>
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${data.sex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Sex</span>
          {data.sex && <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Selected</span>}
        </div>
        <div className="grid grid-cols-2 gap-2.5 max-w-sm">
          {SECTION_A_CONFIG.sexOptions.map((opt) => {
            const isSelected = data.sex === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateField('sex', opt)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.sex && <p className="text-xs text-red-600 mt-2 font-medium">{errors.sex}</p>}
      </div>

      {/* Highest nursing qualification */}
      <div className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative overflow-hidden ${
        errors.nursingQualification ? 'border-red-400 bg-red-50/20' : data.nursingQualification ? 'border-emerald-300' : 'border-slate-200'
      }`}>
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${data.nursingQualification ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Highest nursing qualification</span>
          {data.nursingQualification && <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Selected</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SECTION_A_CONFIG.qualificationOptions.map((opt) => {
            const isSelected = data.nursingQualification === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateField('nursingQualification', opt)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Conditional other input */}
        {data.nursingQualification === 'Other' && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <label htmlFor="qual-other" className="block text-xs font-medium text-slate-700 mb-1">
              Please specify other qualification:
            </label>
            <input
              id="qual-other"
              type="text"
              value={data.qualificationOther || ''}
              onChange={(e) => updateField('qualificationOther', e.target.value)}
              placeholder="e.g. PGDE, Health Admin, Fellowship"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        )}
        {errors.nursingQualification && <p className="text-xs text-red-600 mt-2 font-medium">{errors.nursingQualification}</p>}
      </div>

      {/* Years of nursing experience */}
      <div className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative overflow-hidden ${
        errors.nursingExperience ? 'border-red-400 bg-red-50/20' : data.nursingExperience ? 'border-emerald-300' : 'border-slate-200'
      }`}>
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${data.nursingExperience ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Years of nursing experience</span>
          {data.nursingExperience && <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Selected</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SECTION_A_CONFIG.nursingExperienceOptions.map((opt) => {
            const isSelected = data.nursingExperience === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateField('nursingExperience', opt)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.nursingExperience && <p className="text-xs text-red-600 mt-2 font-medium">{errors.nursingExperience}</p>}
      </div>

      {/* Years of ICU experience */}
      <div className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative overflow-hidden ${
        errors.icuExperience ? 'border-red-400 bg-red-50/20' : data.icuExperience ? 'border-emerald-300' : 'border-slate-200'
      }`}>
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${data.icuExperience ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-slate-900">Years of ICU experience</span>
          {data.icuExperience && <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Selected</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SECTION_A_CONFIG.icuExperienceOptions.map((opt) => {
            const isSelected = data.icuExperience === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => updateField('icuExperience', opt)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.icuExperience && <p className="text-xs text-red-600 mt-2 font-medium">{errors.icuExperience}</p>}
      </div>
    </div>
  );
};
