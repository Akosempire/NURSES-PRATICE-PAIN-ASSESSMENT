import JSZip from 'jszip';
import { INSTITUTIONAL_INFO, SECTION_A_CONFIG, SECTION_B_ITEMS, SECTION_C_ITEMS, SECTION_D_ITEMS } from '../data/painSurveyData';
import { sheetsService } from './sheetsService';

export const zipExportService = {
  async downloadQuestionnairePackage(): Promise<void> {
    const zip = new JSZip();

    // 1. Questionnaire Appendix II JSON
    const painData = {
      metadata: INSTITUTIONAL_INFO,
      sectionA: SECTION_A_CONFIG,
      sectionB_Practices: SECTION_B_ITEMS,
      sectionC_BarriersFacilitators: SECTION_C_ITEMS,
      sectionD_OrganizationalFactors: SECTION_D_ITEMS,
      responseScales: {
        sectionB: "4 = Always, 3 = Often, 2 = Sometimes, 1 = Never",
        sectionC: "4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)",
        sectionD: "4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)"
      }
    };
    zip.file("APPENDIX_II_ICU_Pain_Questionnaire.json", JSON.stringify(painData, null, 2));

    // 2. Google Apps Script file
    zip.file("Google_Apps_Script_Sheet_Integration.js", sheetsService.getGoogleAppsScriptCode());

    // 3. Printable Standalone HTML Questionnaire exactly formatted from PDF
    const printableHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>APPENDIX II — RESEARCH QUESTIONNAIRE (UATH Gwagwalada)</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 30px 40px; color: #111; line-height: 1.4; font-size: 12pt; }
    h1, h2, h3 { text-align: center; margin: 3px 0; }
    h1 { font-size: 13pt; font-weight: bold; text-transform: uppercase; }
    h2 { font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-top: 15px; }
    .box { border: 1px solid #000; padding: 10px; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
    th, td { border: 1px solid #000; padding: 5px 6px; font-size: 10.5pt; text-align: left; }
    th { background: #f0f0f0; text-align: center; }
    .center { text-align: center; }
    @media print { body { margin: 15mm; } .page-break { page-break-before: always; } }
  </style>
</head>
<body>
  <h1>APPENDIX II</h1>
  <h1>QUESTIONNAIRE ON NURSES’ PRACTICE OF PAIN ASSESSMENT AND MANAGEMENT AMONG CRITICALLY ILL PATIENTS IN THE INTENSIVE CARE UNIT</h1>

  <h2>SECTION A: SOCIO-DEMOGRAPHIC AND PROFESSIONAL CHARACTERISTICS</h2>
  <p>Please tick (✓) the option that best describes you.</p>
  <p><strong>Age:</strong> [ ] 20–29 years &nbsp;&nbsp; [ ] 30–39 years &nbsp;&nbsp; [ ] 40–49 years &nbsp;&nbsp; [ ] 50 years and above</p>
  <p><strong>Sex:</strong> [ ] Male &nbsp;&nbsp; [ ] Female</p>
  <p><strong>Highest nursing qualification:</strong> [ ] RN &nbsp;&nbsp; [ ] BNSc &nbsp;&nbsp; [ ] Post-Basic Critical Care Nursing &nbsp;&nbsp; [ ] Master's degree &nbsp;&nbsp; [ ] Other: __________________</p>
  <p><strong>Years of nursing experience:</strong> [ ] Less than 1 year &nbsp;&nbsp; [ ] 1–5 years &nbsp;&nbsp; [ ] 6–10 years &nbsp;&nbsp; [ ] 11–15 years &nbsp;&nbsp; [ ] More than 15 years</p>
  <p><strong>Years of ICU experience:</strong> [ ] Less than 1 year &nbsp;&nbsp; [ ] 1–5 years &nbsp;&nbsp; [ ] 6–10 years &nbsp;&nbsp; [ ] 11–15 years &nbsp;&nbsp; [ ] More than 15 years</p>

  <h2>SECTION B: NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES</h2>
  <p><strong>Instruction:</strong> Please indicate how frequently you perform each of the following practices when caring for critically ill patients.<br>
  <strong>Response options:</strong> 4 = Always, 3 = Often, 2 = Sometimes, 1 = Never</p>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">S/N</th>
        <th>Practice</th>
        <th style="width: 75px;">Always (4)</th>
        <th style="width: 75px;">Often (3)</th>
        <th style="width: 85px;">Sometimes (2)</th>
        <th style="width: 75px;">Never (1)</th>
      </tr>
    </thead>
    <tbody>
      ${SECTION_B_ITEMS.map((item, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td>${item.title}</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>SECTION C: BARRIERS AND FACILITATORS INFLUENCING NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES</h2>
  <p><strong>Instruction:</strong> Please indicate your level of agreement with each statement.<br>
  <strong>Response options:</strong> 4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)</p>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">S/N</th>
        <th>Statement</th>
        <th style="width: 65px;">SA (4)</th>
        <th style="width: 65px;">A (3)</th>
        <th style="width: 65px;">D (2)</th>
        <th style="width: 65px;">SD (1)</th>
      </tr>
    </thead>
    <tbody>
      ${SECTION_C_ITEMS.map((item, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td>${item.title}</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>SECTION D: INFLUENCE OF ORGANIZATIONAL FACTORS ON NURSES’ PAIN ASSESSMENT AND MANAGEMENT PRACTICES</h2>
  <p><strong>Instruction:</strong> Please indicate how much each statement reflects your experience in the ICU.<br>
  <strong>Response options:</strong> 4 = Strongly Agree (SA), 3 = Agree (A), 2 = Disagree (D), 1 = Strongly Disagree (SD)</p>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">S/N</th>
        <th>Statement</th>
        <th style="width: 65px;">SA (4)</th>
        <th style="width: 65px;">A (3)</th>
        <th style="width: 65px;">D (2)</th>
        <th style="width: 65px;">SD (1)</th>
      </tr>
    </thead>
    <tbody>
      ${SECTION_D_ITEMS.map((item, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td>${item.title}</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
          <td class="center">[ ]</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
    zip.file("APPENDIX_II_Printable_Questionnaire.html", printableHtml);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UATH_APPENDIX_II_ICU_Pain_Questionnaire_Package.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
