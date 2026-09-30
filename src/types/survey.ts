export type SurveyType = 'pain';

export interface DemographicData {
  age: string;
  sex: 'Male' | 'Female' | '';
  nursingQualification: string;
  qualificationOther?: string;
  nursingExperience: string;
  icuExperience: string;
}

export interface PainAssessmentScores {
  sectionB: Record<string, number>; // B1 to B8 (1-4: Always=4, Often=3, Sometimes=2, Never=1)
  sectionC: Record<string, number>; // C1 to C7 (1-4: SA=4, A=3, D=2, SD=1)
  sectionD: Record<string, number>; // D1 to D7 (1-4: SA=4, A=3, D=2, SD=1)
}

export interface PainSurveyDraft {
  demographics: Partial<DemographicData>;
  scores: PainAssessmentScores;
  currentStep: number;
  lastUpdated: string;
}

export interface PainSurveySubmission {
  id: string;
  referenceCode: string;
  timestamp: string;
  formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE';
  demographics: DemographicData;
  practicesScores: Record<string, number>; // B1-B8
  barriersFacilitatorsScores: Record<string, number>; // C1-C7
  organizationalScores: Record<string, number>; // D1-D7
  totalPracticesScore: number; // 8 - 32
  meanPracticesScore: number; // 1.0 - 4.0
  practicesLevel: 'High Practice' | 'Moderate Practice' | 'Low / Suboptimal Practice';
  barriersMean: number; // C1-C4 mean
  facilitatorsMean: number; // C5-C7 mean
  organizationalTotal: number; // 7 - 28
  organizationalMean: number;
  syncedToSheets: boolean;
  syncTimestamp?: string;
}

export interface QuestionItem {
  code: string;
  title: string;
  category?: string;
  hint?: string;
}

export interface ScaleOption {
  value: number;
  label: string;
  shortLabel: string;
  subtext?: string;
}
