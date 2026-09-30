import React from 'react';
import { Lock } from 'lucide-react';
import { INSTITUTIONAL_INFO } from '../data/painSurveyData';

interface HospitalFooterProps {
  onUnlockResearcher: () => void;
}

export const HospitalFooter: React.FC<HospitalFooterProps> = ({ onUnlockResearcher }) => {
  return (
    <footer className="mt-auto py-8 px-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left text-[11px] space-y-0.5">
          <div className="font-semibold text-slate-800">
            {INSTITUTIONAL_INFO.hospital}
          </div>
          <div>
            {INSTITUTIONAL_INFO.institution} · {INSTITUTIONAL_INFO.programme}
          </div>
        </div>

        {/* Discreet Faculty / Researcher Link */}
        <div>
          <button
            type="button"
            onClick={onUnlockResearcher}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-700 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-slate-50"
          >
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Faculty & Researcher Access</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
