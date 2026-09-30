import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { INSTITUTIONAL_INFO } from '../data/painSurveyData';
import { FileSpreadsheet, Plus, RefreshCw, Download, Check, Sparkles, Database, ExternalLink, ArrowRight, Table, Layers } from 'lucide-react';

interface GoogleSheetPreviewProps {
  onReturnToSurvey: () => void;
  onOpenSyncSettings: () => void;
  onShowToast: (msg: string) => void;
}

interface SheetRow {
  rowNum: number;
  timestamp: string;
  refCode: string;
  formType: string;
  age: string;
  sex: string;
  qualification: string;
  qualificationOther: string;
  nursingExp: string;
  icuExp: string;
  bTotal: number;
  bMean: number;
  practicesLevel: string;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  b7: number;
  b8: number;
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
  c7: number;
  cBarriersMean: number;
  cFacilitatorsMean: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d5: number;
  d6: number;
  d7: number;
  dTotal: number;
  dMean: number;
}

const INITIAL_SAMPLE_ROWS: SheetRow[] = [
  {
    rowNum: 2,
    timestamp: '2026-09-30 08:30:12',
    refCode: 'UATH-ICU-7A89F-4921',
    formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
    age: '30–39 years',
    sex: 'Female',
    qualification: 'Post-Basic Critical Care Nursing',
    qualificationOther: '',
    nursingExp: '6–10 years',
    icuExp: '6–10 years',
    bTotal: 29,
    bMean: 3.6,
    practicesLevel: 'High Practice',
    b1: 4, b2: 4, b3: 4, b4: 3, b5: 4, b6: 4, b7: 3, b8: 3,
    c1: 4, c2: 3, c3: 2, c4: 4, c5: 4, c6: 4, c7: 4,
    cBarriersMean: 3.3,
    cFacilitatorsMean: 4.0,
    d1: 2, d2: 2, d3: 4, d4: 4, d5: 3, d6: 3, d7: 4,
    dTotal: 22,
    dMean: 3.1
  },
  {
    rowNum: 3,
    timestamp: '2026-09-30 09:12:45',
    refCode: 'UATH-ICU-3B22C-8810',
    formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
    age: '20–29 years',
    sex: 'Male',
    qualification: 'BNSc',
    qualificationOther: '',
    nursingExp: '1–5 years',
    icuExp: '1–5 years',
    bTotal: 24,
    bMean: 3.0,
    practicesLevel: 'Moderate Practice',
    b1: 4, b2: 3, b3: 3, b4: 3, b5: 3, b6: 3, b7: 3, b8: 2,
    c1: 4, c2: 4, c3: 3, c4: 4, c5: 3, c6: 4, c7: 3,
    cBarriersMean: 3.8,
    cFacilitatorsMean: 3.3,
    d1: 1, d2: 2, d3: 3, d4: 3, d5: 3, d6: 2, d7: 3,
    dTotal: 17,
    dMean: 2.4
  },
  {
    rowNum: 4,
    timestamp: '2026-09-30 11:20:04',
    refCode: 'UATH-ICU-9K44P-1205',
    formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
    age: '40–49 years',
    sex: 'Female',
    qualification: "Master's degree",
    qualificationOther: '',
    nursingExp: '11–15 years',
    icuExp: '6–10 years',
    bTotal: 31,
    bMean: 3.9,
    practicesLevel: 'High Practice',
    b1: 4, b2: 4, b3: 4, b4: 4, b5: 4, b6: 4, b7: 4, b8: 3,
    c1: 3, c2: 3, c3: 2, c4: 3, c5: 4, c6: 4, c7: 4,
    cBarriersMean: 2.8,
    cFacilitatorsMean: 4.0,
    d1: 2, d2: 3, d3: 4, d4: 4, d5: 4, d6: 4, d7: 4,
    dTotal: 25,
    dMean: 3.6
  }
];

export const GoogleSheetPreview: React.FC<GoogleSheetPreviewProps> = ({
  onReturnToSurvey,
  onOpenSyncSettings,
  onShowToast
}) => {
  const [rows, setRows] = useState<SheetRow[]>(INITIAL_SAMPLE_ROWS);
  const [selectedCell, setSelectedCell] = useState<string>('J2');
  const [animatingRowId, setAnimatingRowId] = useState<string | null>(null);

  useEffect(() => {
    const subs = storageService.getAllSubmissions();
    if (subs.length > 0) {
      const liveRows: SheetRow[] = subs.map((s: any, idx: number) => {
        const d = s.demographics || {};
        const b = s.practicesScores || {};
        const c = s.barriersFacilitatorsScores || {};
        const dSec = s.organizationalScores || {};

        return {
          rowNum: idx + 2,
          timestamp: s.timestamp ? new Date(s.timestamp).toLocaleString() : 'Just now',
          refCode: s.referenceCode || `UATH-ICU-${idx + 1000}`,
          formType: s.formType || 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
          age: d.age || '30–39 years',
          sex: d.sex || 'Female',
          qualification: d.nursingQualification || 'BNSc',
          qualificationOther: d.qualificationOther || '',
          nursingExp: d.nursingExperience || '1–5 years',
          icuExp: d.icuExperience || '1–5 years',
          bTotal: s.totalPracticesScore || 25,
          bMean: s.meanPracticesScore || 3.1,
          practicesLevel: s.practicesLevel || 'Moderate Practice',
          b1: b['B1'] || 3, b2: b['B2'] || 3, b3: b['B3'] || 3, b4: b['B4'] || 3,
          b5: b['B5'] || 3, b6: b['B6'] || 3, b7: b['B7'] || 3, b8: b['B8'] || 3,
          c1: c['C1'] || 3, c2: c['C2'] || 3, c3: c['C3'] || 3, c4: c['C4'] || 3,
          c5: c['C5'] || 3, c6: c['C6'] || 3, c7: c['C7'] || 3,
          cBarriersMean: s.barriersMean || 3.0,
          cFacilitatorsMean: s.facilitatorsMean || 3.3,
          d1: dSec['D1'] || 3, d2: dSec['D2'] || 3, d3: dSec['D3'] || 3, d4: dSec['D4'] || 3,
          d5: dSec['D5'] || 3, d6: dSec['D6'] || 3, d7: dSec['D7'] || 3,
          dTotal: s.organizationalTotal || 21,
          dMean: s.organizationalMean || 3.0
        };
      });

      const existingRefs = new Set(liveRows.map(r => r.refCode));
      const remaining = INITIAL_SAMPLE_ROWS.filter(r => !existingRefs.has(r.refCode));
      setRows([...liveRows, ...remaining].map((r, i) => ({ ...r, rowNum: i + 2 })));
    }
  }, []);

  const handleSimulateResponse = () => {
    const ages = ['20–29 years', '30–39 years', '40–49 years', '50 years and above'];
    const quals = ['RN', 'BNSc', 'Post-Basic Critical Care Nursing', "Master's degree"];
    const exps = ['Less than 1 year', '1–5 years', '6–10 years', '11–15 years'];
    const newRef = storageService.generateReferenceCode();

    const bScores = Array.from({ length: 8 }, () => 2 + Math.floor(Math.random() * 3)); // 2, 3, or 4
    const bSum = bScores.reduce((a, b) => a + b, 0);
    const bMean = Math.round((bSum / 8) * 10) / 10;
    const level = bSum >= 26 ? 'High Practice' : bSum >= 20 ? 'Moderate Practice' : 'Low / Suboptimal Practice';

    const cScores = Array.from({ length: 7 }, () => 2 + Math.floor(Math.random() * 3));
    const cBarriersMean = Math.round(((cScores[0] + cScores[1] + cScores[2] + cScores[3]) / 4) * 10) / 10;
    const cFacilitatorsMean = Math.round(((cScores[4] + cScores[5] + cScores[6]) / 3) * 10) / 10;

    const dScores = Array.from({ length: 7 }, () => 1 + Math.floor(Math.random() * 4));
    const dSum = dScores.reduce((a, b) => a + b, 0);
    const dMean = Math.round((dSum / 7) * 10) / 10;

    const newRow: SheetRow = {
      rowNum: 2,
      timestamp: new Date().toLocaleString(),
      refCode: newRef,
      formType: 'APPENDIX_II_ICU_PAIN_QUESTIONNAIRE',
      age: ages[Math.floor(Math.random() * ages.length)],
      sex: Math.random() > 0.4 ? 'Female' : 'Male',
      qualification: quals[Math.floor(Math.random() * quals.length)],
      qualificationOther: '',
      nursingExp: exps[Math.floor(Math.random() * exps.length)],
      icuExp: exps[Math.floor(Math.random() * exps.length)],
      bTotal: bSum,
      bMean,
      practicesLevel: level,
      b1: bScores[0], b2: bScores[1], b3: bScores[2], b4: bScores[3],
      b5: bScores[4], b6: bScores[5], b7: bScores[6], b8: bScores[7],
      c1: cScores[0], c2: cScores[1], c3: cScores[2], c4: cScores[3],
      c5: cScores[4], c6: cScores[5], c7: cScores[6],
      cBarriersMean,
      cFacilitatorsMean,
      d1: dScores[0], d2: dScores[1], d3: dScores[2], d4: dScores[3],
      d5: dScores[4], d6: dScores[5], d7: dScores[6],
      dTotal: dSum,
      dMean
    };

    setRows(prev => [newRow, ...prev.map(r => ({ ...r, rowNum: r.rowNum + 1 }))]);
    setAnimatingRowId(newRef);
    setSelectedCell('B2');
    onShowToast(`Automated ICU response ${newRef} logged into Google Sheets row 2!`);

    setTimeout(() => {
      setAnimatingRowId(null);
    }, 3000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Reference Code',
      'Form Identifier',
      'Age',
      'Sex',
      'Highest Nursing Qualification',
      'Qualification Other',
      'Years of Nursing Experience',
      'Years of ICU Experience',
      'Section B Total (8-32)',
      'Section B Mean (1-4)',
      'Practices Level',
      'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8',
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
      'C Barriers Mean', 'C Facilitators Mean',
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7',
      'Section D Total (7-28)', 'Section D Mean'
    ];

    const csvData = rows.map(r => [
      `"${r.timestamp}"`,
      `"${r.refCode}"`,
      `"${r.formType}"`,
      `"${r.age}"`,
      `"${r.sex}"`,
      `"${r.qualification}"`,
      `"${r.qualificationOther}"`,
      `"${r.nursingExp}"`,
      `"${r.icuExp}"`,
      r.bTotal,
      r.bMean,
      `"${r.practicesLevel}"`,
      r.b1, r.b2, r.b3, r.b4, r.b5, r.b6, r.b7, r.b8,
      r.c1, r.c2, r.c3, r.c4, r.c5, r.c6, r.c7,
      r.cBarriersMean, r.cFacilitatorsMean,
      r.d1, r.d2, r.d3, r.d4, r.d5, r.d6, r.d7,
      r.dTotal, r.dMean
    ].join(','));

    const fullCsv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Google_Sheet_APPENDIX_II_ICU_Pain_Responses_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Appendix II responses as CSV.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Google Sheets Live Replica (Appendix II)
            </span>
            <span className="text-xs text-slate-500 font-mono">· Automated Ingestion Stream</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            QUESTIONNAIRE ON NURSES’ PRACTICE OF PAIN ASSESSMENT AND MANAGEMENT IN ICU
          </h2>
          <p className="text-xs text-slate-500">
            Preview the exact Google Sheet columns and automated rows configured from the PDF research questionnaire.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleSimulateResponse}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Simulate Incoming Response</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenSyncSettings}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Sync Settings</span>
          </button>
        </div>
      </div>

      {/* Realistic Google Sheets Chrome Container */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden font-sans">
        {/* Google Sheets Header Bar */}
        <div className="bg-[#f9fbfd] border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-2xs">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  APPENDIX_II_ICU_Pain_Assessment_And_Management_Master
                </span>
                <span className="text-[11px] text-slate-400 font-mono">.xlsx</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                <span className="hover:text-slate-900 cursor-pointer">File</span>
                <span className="hover:text-slate-900 cursor-pointer">Edit</span>
                <span className="hover:text-slate-900 cursor-pointer">View</span>
                <span className="hover:text-slate-900 cursor-pointer">Insert</span>
                <span className="hover:text-slate-900 cursor-pointer">Format</span>
                <span className="hover:text-slate-900 cursor-pointer">Data</span>
                <span className="hover:text-slate-900 cursor-pointer">Tools</span>
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Auto-sync Configured
                </span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <span className="font-semibold text-slate-900">{rows.length}</span> rows recorded
          </div>
        </div>

        {/* Formula Bar */}
        <div className="bg-[#f0f4f9] border-b border-slate-200 px-4 py-1.5 flex items-center gap-3 text-xs font-mono">
          <div className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-slate-700 w-14 text-center">
            {selectedCell}
          </div>
          <div className="text-slate-400 font-bold select-none">fx</div>
          <div className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-0.5 text-slate-800 truncate">
            {selectedCell === 'J2'
              ? `=SUM(M2:T2) /* Section B Total Practices Score (8-32) */`
              : selectedCell === 'B2'
              ? rows[0]?.refCode || 'UATH-ICU-7A89F-4921'
              : 'Google Sheets Ingestion Pipeline for UATH Critical Care Nurses'}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto max-h-[480px] divide-y divide-slate-200">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            {/* Column Letters Header */}
            <thead className="bg-[#f8f9fa] sticky top-0 z-20 select-none">
              <tr className="border-b border-slate-300 text-slate-500 font-mono text-[11px] text-center">
                <th className="w-10 px-2 py-1 bg-slate-200 border-r border-slate-300 font-normal">#</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">A</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">B</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">C</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">D</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">E</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">F</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">G</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">H</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">I</th>
                <th className="px-3 py-1 border-r border-slate-300 font-bold text-blue-700 bg-blue-50/60">J</th>
                <th className="px-3 py-1 border-r border-slate-300 font-bold text-blue-700 bg-blue-50/60">K</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">L</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">M..T (B1-B8)</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">U..AA (C1-C7)</th>
                <th className="px-3 py-1 border-r border-slate-300 font-normal">AB..AH (D1-D7)</th>
                <th className="px-3 py-1 font-normal text-blue-700 bg-blue-50/60">AI (D Total)</th>
              </tr>

              {/* Row 1: Field Names */}
              <tr className="border-b border-slate-300 bg-slate-100 font-semibold text-slate-800 text-[11px]">
                <td className="w-10 px-2 py-2 text-center bg-slate-200 border-r border-slate-300 text-slate-500 font-mono">1</td>
                <td className="px-3 py-2 border-r border-slate-200">Timestamp</td>
                <td className="px-3 py-2 border-r border-slate-200">Reference Code</td>
                <td className="px-3 py-2 border-r border-slate-200">Form Identifier</td>
                <td className="px-3 py-2 border-r border-slate-200">Age</td>
                <td className="px-3 py-2 border-r border-slate-200">Sex</td>
                <td className="px-3 py-2 border-r border-slate-200">Qualification</td>
                <td className="px-3 py-2 border-r border-slate-200">Nursing Experience</td>
                <td className="px-3 py-2 border-r border-slate-200">ICU Experience</td>
                <td className="px-3 py-2 border-r border-slate-200 bg-blue-50/60 text-blue-900 font-bold">Sec B Total (8-32)</td>
                <td className="px-3 py-2 border-r border-slate-200 bg-blue-50/60 text-blue-900 font-bold">Sec B Mean (1-4)</td>
                <td className="px-3 py-2 border-r border-slate-200">Practices Level</td>
                <td className="px-3 py-2 border-r border-slate-200 text-slate-600">B1 to B8 Items</td>
                <td className="px-3 py-2 border-r border-slate-200 text-slate-600">C1 to C7 Items</td>
                <td className="px-3 py-2 border-r border-slate-200 text-slate-600">D1 to D7 Items</td>
                <td className="px-3 py-2 text-blue-900 font-bold bg-blue-50/60">Sec D Total (7-28)</td>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-700">
              {rows.map((row) => {
                const isNew = animatingRowId === row.refCode;
                return (
                  <tr
                    key={row.refCode}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      isNew ? 'bg-emerald-100 font-semibold text-emerald-950 animate-pulse' : ''
                    }`}
                  >
                    <td className="w-10 px-2 py-2 text-center bg-slate-100 border-r border-slate-200 text-slate-500 select-none">
                      {row.rowNum}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">{row.timestamp}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-bold text-blue-700">{row.refCode}</td>
                    <td className="px-3 py-2 border-r border-slate-200 text-[10px] text-slate-500">{row.formType}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans">{row.age}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans">{row.sex}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans truncate max-w-[150px]">{row.qualification}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans">{row.nursingExp}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans">{row.icuExp}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-bold text-center bg-blue-50/40 text-blue-900">
                      {row.bTotal} / 32
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 font-bold text-center bg-blue-50/40 text-blue-900">
                      {row.bMean}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.practicesLevel === 'High Practice'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.practicesLevel === 'Moderate Practice'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.practicesLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-[10px]">
                      [{row.b1},{row.b2},{row.b3},{row.b4},{row.b5},{row.b6},{row.b7},{row.b8}]
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-[10px]">
                      [{row.c1},{row.c2},{row.c3},{row.c4},{row.c5},{row.c6},{row.c7}]
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-[10px]">
                      [{row.d1},{row.d2},{row.d3},{row.d4},{row.d5},{row.d6},{row.d7}]
                    </td>
                    <td className="px-3 py-2 font-bold text-center bg-blue-50/40 text-blue-900">
                      {row.dTotal} / 28
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-[#f0f4f9] border-t border-slate-300 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-emerald-800">Appendix II Live Grid:</span>
            <span>Sections A, B (Practices), C (Barriers/Facilitators), and D (Organizational Factors)</span>
          </div>

          <button
            type="button"
            onClick={onReturnToSurvey}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Return to Questionnaire →
          </button>
        </div>
      </div>
    </div>
  );
};
