import { QuestionItem, ScaleOption } from '../types/survey';

export const INSTITUTIONAL_INFO = {
  title: "QUESTIONNAIRE ON NURSES’ PRACTICE OF PAIN ASSESSMENT AND MANAGEMENT AMONG CRITICALLY ILL PATIENTS IN THE INTENSIVE CARE UNIT",
  documentIdentifier: "APPENDIX II",
  institution: "College of Nursing Science",
  programme: "Post Basic Critical Care Nursing Programme",
  hospital: "University of Abuja Teaching Hospital (UATH)",
  location: "Gwagwalada, Abuja, Nigeria",
  targetGroup: "Registered nurses & critical care nursing officers practicing in the Intensive Care Unit (ICU).",
  instruction: "Please tick (✓) the option that best describes you.",
  ethicsPreamble: [
    "Participation is entirely voluntary and your identity remains strictly anonymous.",
    "No names, personal IDs, or hospital numbers are required.",
    "All collected data will be analyzed and published only in aggregate form.",
    "There are no right or wrong answers; your sincere clinical feedback represents the true strength of this study."
  ]
};

// Section A: Socio-demographic and Professional Characteristics (Exact from PDF Page 1)
export const SECTION_A_CONFIG = {
  ageOptions: [
    '20–29 years',
    '30–39 years',
    '40–49 years',
    '50 years and above'
  ],
  sexOptions: ['Male', 'Female'] as const,
  qualificationOptions: [
    'RN',
    'BNSc',
    'Post-Basic Critical Care Nursing',
    "Master's degree",
    'Other'
  ],
  nursingExperienceOptions: [
    'Less than 1 year',
    '1–5 years',
    '6–10 years',
    '11–15 years',
    'More than 15 years'
  ],
  icuExperienceOptions: [
    'Less than 1 year',
    '1–5 years',
    '6–10 years',
    '11–15 years',
    'More than 15 years'
  ]
};

// Section B: Nurses’ Pain Assessment and Management Practices (Exact from PDF Page 2 & 3)
// 4 = Always, 3 = Often, 2 = Sometimes, 1 = Never
export const SECTION_B_SCALE: ScaleOption[] = [
  { value: 4, label: 'Always', shortLabel: 'Always (4)', subtext: 'Routine in every shift' },
  { value: 3, label: 'Often', shortLabel: 'Often (3)', subtext: 'Most shifts' },
  { value: 2, label: 'Sometimes', shortLabel: 'Sometimes (2)', subtext: 'Occasional / ~50% shifts' },
  { value: 1, label: 'Never', shortLabel: 'Never (1)', subtext: '0% of shifts' }
];

export const SECTION_B_ITEMS: QuestionItem[] = [
  {
    code: 'B1',
    category: 'Assessment Routines',
    title: 'I assess patients’ pain routinely during their ICU stay'
  },
  {
    code: 'B2',
    category: 'Communicative Tools',
    title: 'I use a standardized pain assessment scale for patients who can communicate'
  },
  {
    code: 'B3',
    category: 'Non-Communicative Tools',
    title: 'I use a behavioural pain assessment tool for patients who cannot communicate their pain'
  },
  {
    code: 'B4',
    category: 'Procedure-Related Assessment',
    title: 'I assess pain before and after procedures that may cause pain'
  },
  {
    code: 'B5',
    category: 'Post-Analgesia Reassessment',
    title: 'I reassess patients’ pain after administering analgesics or other pain-relieving interventions'
  },
  {
    code: 'B6',
    category: 'Clinical Records',
    title: 'I document patients’ pain assessment findings and pain scores in their clinical records'
  },
  {
    code: 'B7',
    category: 'Pharmacological Interventions',
    title: 'I use appropriate combine pharmacological interventions when managing patients’ pain'
  },
  {
    code: 'B8',
    category: 'Non-Pharmacological Interventions',
    title: 'I use appropriate non-pharmacological interventions when managing patients’ pain'
  }
];

// Section C: Barriers and Facilitators Influencing Nurses’ Pain Assessment and Management Practices (Exact from PDF Page 3 & 4)
// 4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)
export const SECTION_CD_SCALE: ScaleOption[] = [
  { value: 4, label: 'Strongly Agree', shortLabel: 'SA (4)', subtext: 'Strongly Agree' },
  { value: 3, label: 'Agree', shortLabel: 'A (3)', subtext: 'Agree' },
  { value: 2, label: 'Disagree', shortLabel: 'D (2)', subtext: 'Disagree' },
  { value: 1, label: 'Strongly Disagree', shortLabel: 'SD (1)', subtext: 'Strongly Disagree' }
];

export const SECTION_C_ITEMS: QuestionItem[] = [
  {
    code: 'C1',
    category: 'Workload Barrier',
    title: 'Heavy workload is a barrier to regular pain assessment and management'
  },
  {
    code: 'C2',
    category: 'Communication Barrier',
    title: 'Patients’ inability to communicate their pain makes accurate pain assessment difficult'
  },
  {
    code: 'C3',
    category: 'Knowledge & Training Barrier',
    title: 'Lack of adequate knowledge and training on pain assessment tools affects my pain assessment practice'
  },
  {
    code: 'C4',
    category: 'Time Constraint Barrier',
    title: 'Limited time for patient care makes it difficult to carry out regular pain assessment and reassessment'
  },
  {
    code: 'C5',
    category: 'Interprofessional Facilitator',
    title: 'Good collaboration between nurses and doctors facilitates effective pain management'
  },
  {
    code: 'C6',
    category: 'Education Facilitator',
    title: 'Regular education and training on pain assessment and management improve my practice'
  },
  {
    code: 'C7',
    category: 'Healthcare Team Facilitator',
    title: 'Clear communication among members of the healthcare team facilitates effective pain management'
  }
];

// Section D: Influence of Organizational Factors on Nurses’ Pain Assessment and Management Practices (Exact from PDF Page 4 & 5)
// 4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)
export const SECTION_D_ITEMS: QuestionItem[] = [
  {
    code: 'D1',
    category: 'Staffing Adequacy',
    title: 'The number of nurses available on each shift is adequate for effective pain assessment and management of ICU patients'
  },
  {
    code: 'D2',
    category: 'Patient Assignment',
    title: 'The nurse-to-patient assignment in the ICU allows adequate attention to patients’ pain needs'
  },
  {
    code: 'D3',
    category: 'Resource Availability',
    title: 'The ICU has adequate availability of pain assessment tools for routine use'
  },
  {
    code: 'D4',
    category: 'Written Protocols',
    title: 'The ICU has written institutional guidelines or protocols for pain assessment and management'
  },
  {
    code: 'D5',
    category: 'Management Support',
    title: 'ICU management provides adequate support for nurses to implement recommended pain assessment and management practices'
  },
  {
    code: 'D6',
    category: 'Clinical Supervision',
    title: 'Nurses receive regular supervision regarding compliance with pain assessment and management practices'
  },
  {
    code: 'D7',
    category: 'Handover & Documentation',
    title: 'Pain assessment and management are routinely incorporated into ICU patient-care documentation and handover practices'
  }
];
