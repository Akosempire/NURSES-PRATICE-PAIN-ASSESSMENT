/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DemographicData, PainAssessmentScores, PainSurveyDraft, PainSurveySubmission } from './types/survey';
import {
  INSTITUTIONAL_INFO,
  SECTION_B_ITEMS,
  SECTION_B_SCALE,
  SECTION_C_ITEMS,
  SECTION_CD_SCALE,
  SECTION_D_ITEMS
} from './data/painSurveyData';
import { storageService } from './services/storageService';
import { sheetsService } from './services/sheetsService';
import { zipExportService } from './services/zipExportService';

import { HospitalHeader } from './components/HospitalHeader';
import { HospitalFooter } from './components/HospitalFooter';
import { StickyProgressHeader } from './components/StickyProgressHeader';
import { StickyFloatingFooter } from './components/StickyFloatingFooter';
import { PainWelcomeScreen } from './components/PainSurvey/PainWelcomeScreen';
import { SectionDemographics } from './components/PainSurvey/SectionDemographics';
import { SectionLikert } from './components/PainSurvey/SectionLikert';
import { PainSummaryScreen } from './components/PainSurvey/PainSummaryScreen';
import { GoogleSheetPreview } from './components/GoogleSheetPreview';
import { ResearcherModal } from './components/ResearcherModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeView, setActiveView] = useState<'survey' | 'preview'>('survey');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'true' || params.get('researcher') === 'true';
  });
  
  // Appendix II Questionnaire Steps:
  // 0: Welcome / Consent Screen
  // 1: Section A (Socio-demographic & Professional Characteristics)
  // 2: Section B (Nurses' Pain Assessment and Management Practices: B1-B8)
  // 3: Section C (Barriers and Facilitators: C1-C7)
  // 4: Section D (Influence of Organizational Factors: D1-D7)
  // 5: Summary / Submission Confirmation Screen
  const [step, setStep] = useState<number>(0);

  // Questionnaire Data State
  const [demographics, setDemographics] = useState<Partial<DemographicData>>({});
  const [demoErrors, setDemoErrors] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<PainAssessmentScores>({
    sectionB: {},
    sectionC: {},
    sectionD: {}
  });

  const [existingDraft, setExistingDraft] = useState<PainSurveyDraft | null>(null);
  const [highlightIncomplete, setHighlightIncomplete] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<PainSurveySubmission | null>(null);

  // Connectivity & Queue
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isResearcherModalOpen, setIsResearcherModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // 1. Initial Draft & Queue check
  useEffect(() => {
    const draft = storageService.getPainDraft();
    if (draft) {
      setExistingDraft(draft);
    }
    setOfflineQueueCount(storageService.getOfflineQueue().length);

    const handleOnline = () => {
      setIsOnline(true);
      showToast('Network restored. Flushing offline queue to Google Sheets...');
      sheetsService.flushOfflineQueue().then((res) => {
        setOfflineQueueCount(res.remainingCount);
        if (res.syncedCount > 0) {
          showToast(`Synced ${res.syncedCount} queued responses to Google Sheets.`);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are currently offline. Responses will be safely cached locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // 2. Draft Auto-saving to localStorage
  useEffect(() => {
    if (step > 0 && step < 5) {
      const draft: PainSurveyDraft = {
        demographics,
        scores,
        currentStep: step,
        lastUpdated: new Date().toISOString()
      };
      storageService.savePainDraft(draft);
    }
  }, [step, demographics, scores]);

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    showToast('Copied direct shareable link for Appendix II Questionnaire!');
  };

  const handleDownloadPackage = async () => {
    try {
      showToast('Generating complete Appendix II questionnaire package (.ZIP)...');
      await zipExportService.downloadQuestionnairePackage();
      showToast('Downloaded UATH Appendix II Questionnaire Package (.ZIP)!');
    } catch (err) {
      console.error(err);
      showToast('Failed to download package.');
    }
  };

  const handleResumeDraft = () => {
    if (existingDraft) {
      setDemographics(existingDraft.demographics);
      setScores(existingDraft.scores);
      setStep(existingDraft.currentStep || 1);
      showToast('Restored your unfinished questionnaire session.');
    }
  };

  const handleClearDraft = () => {
    storageService.clearPainDraft();
    setExistingDraft(null);
    showToast('Unfinished draft discarded.');
  };

  const handleStartFresh = () => {
    setDemographics({});
    setScores({ sectionB: {}, sectionC: {}, sectionD: {} });
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section A Validation
  const validateDemographics = (): boolean => {
    const errs: Record<string, string> = {};
    if (!demographics.age) errs.age = 'Please select age bracket.';
    if (!demographics.sex) errs.sex = 'Please select sex.';
    if (!demographics.nursingQualification) errs.nursingQualification = 'Please select highest qualification.';
    if (!demographics.nursingExperience) errs.nursingExperience = 'Please select years of nursing experience.';
    if (!demographics.icuExperience) errs.icuExperience = 'Please select years of ICU experience.';

    setDemoErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSection = (items: any[], values: Record<string, number>): boolean => {
    return items.every((item) => values[item.code] !== undefined);
  };

  // Navigation handlers
  const handleNextSection = () => {
    setHighlightIncomplete(false);

    if (step === 1) {
      if (!validateDemographics()) {
        showToast('Please answer all questions in Section A.');
        return;
      }
    } else if (step === 2) {
      if (!validateSection(SECTION_B_ITEMS, scores.sectionB)) {
        setHighlightIncomplete(true);
        showToast('Please answer all 8 practices items in Section B.');
        return;
      }
    } else if (step === 3) {
      if (!validateSection(SECTION_C_ITEMS, scores.sectionC)) {
        setHighlightIncomplete(true);
        showToast('Please answer all 7 items in Section C.');
        return;
      }
    }

    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousSection = () => {
    setHighlightIncomplete(false);
    setStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submission Handler
  const handleSubmitSurvey = async () => {
    if (!validateSection(SECTION_D_ITEMS, scores.sectionD)) {
      setHighlightIncomplete(true);
      showToast('Please answer all 7 organizational statements in Section D.');
      return;
    }

    setIsSubmitting(true);

    // Section B calculations (B1-B8: 1-4 scale)
    const bValues = Object.values(scores.sectionB);
    const bSum = bValues.reduce((a, b) => a + b, 0);
    const bMean = Math.round((bSum / 8) * 10) / 10;
    const level: 'High Practice' | 'Moderate Practice' | 'Low / Suboptimal Practice' =
      bSum >= 26 ? 'High Practice' : bSum >= 20 ? 'Moderate Practice' : 'Low / Suboptimal Practice';

    // Section C calculations (C1-C4 barriers, C5-C7 facilitators)
    const c14Sum = (scores.sectionC['C1'] || 0) + (scores.sectionC['C2'] || 0) + (scores.sectionC['C3'] || 0) + (scores.sectionC['C4'] || 0);
    const cBarriersMean = Math.round((c14Sum / 4) * 10) / 10;

    const c57Sum = (scores.sectionC['C5'] || 0) + (scores.sectionC['C6'] || 0) + (scores.sectionC['C7'] || 0);
    const cFacilitatorsMean = Math.round((c57Sum / 3) * 10) / 10;

    // Section D calculations (D1-D7: 1-4 scale)
    const dValues = Object.values(scores.sectionD);
    const dSum = dValues.reduce((a, b) => a + b, 0);
    const dMean = Math.round((dSum / 7) * 10) / 10;

    const refCode = storageService.generateReferenceCode();

    const submission: PainSurveySubmission = {
      id: crypto.randomUUID ? crypto.randomUUID() : `sub-icu-${Date.now()}`,
      referenceCode: refCode,
      timestamp: new Date().toISOString(),
      formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
      demographics: demographics as DemographicData,
      practicesScores: scores.sectionB,
      barriersFacilitatorsScores: scores.sectionC,
      organizationalScores: scores.sectionD,
      totalPracticesScore: bSum,
      meanPracticesScore: bMean,
      practicesLevel: level,
      barriersMean: cBarriersMean,
      facilitatorsMean: cFacilitatorsMean,
      organizationalTotal: dSum,
      organizationalMean: dMean,
      syncedToSheets: false
    };

    const syncRes = await sheetsService.submitToSheets(submission);
    storageService.clearPainDraft();
    setOfflineQueueCount(storageService.getOfflineQueue().length);
    setIsSubmitting(false);
    setSubmissionResult(submission);
    setStep(5);
    showToast(syncRes.message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section titles and counters
  const getSectionMetadata = () => {
    switch (step) {
      case 1:
        return {
          title: 'Section A: Socio-demographic and Professional Characteristics',
          total: 5,
          answered: [
            demographics.age,
            demographics.sex,
            demographics.nursingQualification,
            demographics.nursingExperience,
            demographics.icuExperience
          ].filter(Boolean).length
        };
      case 2:
        return {
          title: 'Section B: Nurses’ Pain Assessment and Management Practices',
          total: SECTION_B_ITEMS.length,
          answered: Object.keys(scores.sectionB).length
        };
      case 3:
        return {
          title: 'Section C: Barriers and Facilitators Influencing Practices',
          total: SECTION_C_ITEMS.length,
          answered: Object.keys(scores.sectionC).length
        };
      case 4:
        return {
          title: 'Section D: Influence of Organizational Factors on Practices',
          total: SECTION_D_ITEMS.length,
          answered: Object.keys(scores.sectionD).length
        };
      default:
        return { title: '', total: 0, answered: 0 };
    }
  };

  const currentMeta = getSectionMetadata();
  const totalQuestions = 5 + SECTION_B_ITEMS.length + SECTION_C_ITEMS.length + SECTION_D_ITEMS.length; // 5 + 8 + 7 + 7 = 27
  const answeredCount =
    [
      demographics.age,
      demographics.sex,
      demographics.nursingQualification,
      demographics.nursingExperience,
      demographics.icuExperience
    ].filter(Boolean).length +
    Object.keys(scores.sectionB).length +
    Object.keys(scores.sectionC).length +
    Object.keys(scores.sectionD).length;

  const progressPct = step === 0 ? 0 : step === 5 ? 100 : (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Institutional Hospital Header */}
      <HospitalHeader
        isAdminMode={isAdminMode}
        onToggleAdminMode={(enabled) => setIsAdminMode(enabled)}
        activeView={activeView}
        onToggleView={(view) => setActiveView(view)}
        onOpenResearcherModal={() => setIsResearcherModalOpen(true)}
        onDownloadPackage={handleDownloadPackage}
        onCopyShareLink={handleCopyShareLink}
        offlineQueueCount={offlineQueueCount}
        hasWebhookConfigured={!!storageService.getSheetsWebhookUrl()}
      />

      {/* Main Container */}
      <main className="flex-1 pb-24">
        {activeView === 'preview' ? (
          <GoogleSheetPreview
            onReturnToSurvey={() => setActiveView('survey')}
            onOpenSyncSettings={() => setIsResearcherModalOpen(true)}
            onShowToast={showToast}
          />
        ) : (
          <div>
            {/* Sticky Progress Header when in Steps 1 to 4 */}
            {step >= 1 && step <= 4 && (
              <StickyProgressHeader
                studyTitle={INSTITUTIONAL_INFO.title}
                documentId={INSTITUTIONAL_INFO.documentIdentifier}
                currentSectionTitle={currentMeta.title}
                sectionIndex={step}
                totalSections={4}
                answeredCount={currentMeta.answered}
                totalQuestionsInSection={currentMeta.total}
                overallPercentage={progressPct}
                isOnline={isOnline}
              />
            )}

            {/* Step 0: Welcome Screen */}
            {step === 0 && (
              <PainWelcomeScreen
                existingDraft={existingDraft}
                onResumeDraft={handleResumeDraft}
                onStartFresh={handleStartFresh}
                onClearDraft={handleClearDraft}
              />
            )}

            {/* Step 1: Section A (PDF Page 1) */}
            {step === 1 && (
              <SectionDemographics
                data={demographics}
                onChange={(updated) => {
                  setDemographics((prev) => ({ ...prev, ...updated }));
                  setDemoErrors({});
                }}
                errors={demoErrors}
              />
            )}

            {/* Step 2: Section B (PDF Page 2 & 3: B1-B8) */}
            {step === 2 && (
              <SectionLikert
                sectionTitle="SECTION B: NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES"
                sectionSubtitle="8 Standardized ICU Practice Items (PDF Pages 2 & 3)"
                instructions="Please indicate how frequently you perform each of the following practices when caring for critically ill patients."
                scaleOptions={SECTION_B_SCALE}
                items={SECTION_B_ITEMS}
                values={scores.sectionB}
                onChange={(code, val) => {
                  setScores((prev) => ({
                    ...prev,
                    sectionB: { ...prev.sectionB, [code]: val }
                  }));
                }}
                highlightIncomplete={highlightIncomplete}
              />
            )}

            {/* Step 3: Section C (PDF Page 3 & 4: C1-C7) */}
            {step === 3 && (
              <SectionLikert
                sectionTitle="SECTION C: BARRIERS AND FACILITATORS INFLUENCING NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES"
                sectionSubtitle="7 Practice Barriers & Collaboration Facilitators (PDF Pages 3 & 4)"
                instructions="Please indicate your level of agreement with each statement."
                scaleOptions={SECTION_CD_SCALE}
                items={SECTION_C_ITEMS}
                values={scores.sectionC}
                onChange={(code, val) => {
                  setScores((prev) => ({
                    ...prev,
                    sectionC: { ...prev.sectionC, [code]: val }
                  }));
                }}
                highlightIncomplete={highlightIncomplete}
              />
            )}

            {/* Step 4: Section D (PDF Page 4 & 5: D1-D7) */}
            {step === 4 && (
              <SectionLikert
                sectionTitle="SECTION D: INFLUENCE OF ORGANIZATIONAL FACTORS ON NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES"
                sectionSubtitle="7 Organizational & Staffing Experience Items (PDF Pages 4 & 5)"
                instructions="Please indicate how much each statement reflects your experience in the ICU."
                scaleOptions={SECTION_CD_SCALE}
                items={SECTION_D_ITEMS}
                values={scores.sectionD}
                onChange={(code, val) => {
                  setScores((prev) => ({
                    ...prev,
                    sectionD: { ...prev.sectionD, [code]: val }
                  }));
                }}
                highlightIncomplete={highlightIncomplete}
              />
            )}

            {/* Step 5: Summary / Thank You Screen */}
            {step === 5 && submissionResult && (
              <PainSummaryScreen
                submission={submissionResult}
                onResetToStart={() => {
                  setStep(0);
                  setSubmissionResult(null);
                }}
                onNewSubmission={() => {
                  setDemographics({});
                  setScores({ sectionB: {}, sectionC: {}, sectionD: {} });
                  setSubmissionResult(null);
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Sticky Floating Footer */}
            {step >= 1 && step <= 4 && (
              <StickyFloatingFooter
                canGoBack={step >= 1}
                onBack={handlePreviousSection}
                onNext={handleNextSection}
                onSubmit={handleSubmitSurvey}
                isSubmitting={isSubmitting}
                isLastSection={step === 4}
                progressPercentage={progressPct}
                nextButtonText={step === 3 ? 'Continue to Section D' : 'Next Section'}
              />
            )}
          </div>
        )}
      </main>

      {/* Institutional Footer with Discreet Faculty Link */}
      <HospitalFooter
        onUnlockResearcher={() => {
          setIsAdminMode(true);
          setIsResearcherModalOpen(true);
        }}
      />

      {/* Researcher Integration Modal */}
      <ResearcherModal
        isOpen={isResearcherModalOpen}
        onClose={() => setIsResearcherModalOpen(false)}
        onShowToast={showToast}
        onQueueUpdated={() => setOfflineQueueCount(storageService.getOfflineQueue().length)}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
