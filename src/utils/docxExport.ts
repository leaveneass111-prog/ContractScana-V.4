import { ContractProjectData } from '../types';
import { buildTemplateVariables, ContractScanTemplateVariables } from './templateVariables';

/**
 * Generates an MS Word-compatible document based on the complete Template Variables V2 specification
 */
export function generateDocxBlob(project: ContractProjectData): Blob {
  const vars: ContractScanTemplateVariables = buildTemplateVariables(project);

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>รายงานผลการปฏิบัติงาน - ${vars.PROJECT}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 2cm 2cm 2cm 2.5cm;
    mso-header-margin: 36pt;
    mso-footer-margin: 36pt;
  }
  body {
    font-family: 'TH Sarabun PSK', 'Sarabun', 'Angsana New', sans-serif;
    font-size: 16pt;
    line-height: 1.35;
    color: #000000;
  }
  h1 {
    font-size: 26pt;
    text-align: center;
    font-weight: bold;
    margin-top: 6pt;
    margin-bottom: 8pt;
  }
  h2 {
    font-size: 18pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 6pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8pt;
    margin-bottom: 10pt;
    font-size: 14pt;
  }
  th, td {
    border: 1px solid #000000;
    padding: 4pt 6pt;
    vertical-align: middle;
  }
  th {
    background-color: #f2f2f2;
    text-align: center;
    font-weight: bold;
  }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
  .signature-block {
    margin-top: 24pt;
    page-break-inside: avoid;
  }
  .page-break {
    page-break-after: always;
  }
  .indent {
    text-indent: 2.5cm;
  }
</style>
</head>
<body>

<!-- หน้า 1: บันทึกข้อความ (ข้อมูลโครงการ สัญญา และคณะกรรมการ) -->
<div class="page-break">
  <div style="text-align: center; margin-bottom: 8pt;">
    <div style="font-size: 28pt; font-weight: bold;">(ตราครุฑ)</div>
    <h1>บันทึกข้อความ</h1>
  </div>

  <table style="border: none; margin-bottom: 8pt;">
    <tr style="border: none;">
      <td style="border: none; width: 60%;"><span class="bold">ส่วนราชการ:</span> ${project.organization || '-'}</td>
      <td style="border: none; width: 40%; text-align: right;"><span class="bold">ที่:</span> ${vars.DOC_NO || '-'}</td>
    </tr>
    <tr style="border: none;">
      <td style="border: none;"><span class="bold">เรื่อง:</span> ${project.subjectWeekly || 'รายงานผลการปฏิบัติงานของผู้ควบคุมงานประจำสัปดาห์'}</td>
      <td style="border: none; text-align: right;"><span class="bold">วันที่:</span> ${vars.R_DATE || '-'}</td>
    </tr>
  </table>

  <p><span class="bold">เรียน</span> ประธานกรรมการตรวจรับพัสดุ</p>

  <p class="indent">
    ตามที่ ได้มีสัญญาจ้างเลขที่ <span class="bold">${vars.C_NO}</span> ลงวันที่ <span class="bold">${vars.C_DATE}</span> 
    โครงการ <span class="bold">${vars.PROJECT}</span> สถานที่ก่อสร้าง ${vars.LOCATION} 
    ปริมาณงาน ${vars.QTY} 
    วงเงินค่าก่อสร้าง <b>${vars.COST} บาท</b> เริ่มต้นสัญญาวันที่ ${vars.START} สิ้นสุดสัญญาวันที่ ${vars.C_END} 
    รวมระยะเวลาทำการ <b>${vars.DAYS} วัน</b> อัตราค่าปรับวันละ <b>${vars.FINE} บาท</b> โดยมี <b>${vars.CONTRACTOR}</b> เป็นผู้รับจ้าง นั้น
  </p>

  <p class="indent">
    ผู้ควบคุมงานขอรายงานผลการปฏิบัติงานก่อสร้าง ประจำสัปดาห์ที่ <b>${vars.WEEK}</b> 
    ตั้งแต่วันที่ <b>${vars.START} ถึงวันที่ ${vars.END}</b> 
    โดยมีระยะเวลาก่อสร้างคงเหลือ <b>${vars.REMAIN} วัน</b> งบประมาณรวม <b>${vars.BUDGET} บาท</b> ดังรายละเอียดต่อไปนี้
  </p>

  <div class="signature-block">
    <table style="border: none; margin-top: 24pt;">
      <tr style="border: none;">
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.SUP_NAME}</b>)<br>
          ${vars.SUP_POS}<br>
          <b>ผู้ควบคุมงาน</b>
        </td>
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.COM_P_NAME}</b>)<br>
          ${vars.COM_P_POS}<br>
          <b>ประธานกรรมการตรวจรับพัสดุ</b>
        </td>
      </tr>
      <tr style="border: none; height: 26pt;"><td style="border: none;" colspan="2"></td></tr>
      <tr style="border: none;">
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.COM_1_NAME}</b>)<br>
          ${vars.COM_1_POS}<br>
          <b>กรรมการตรวจรับพัสดุ</b>
        </td>
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.COM_2_NAME}</b>)<br>
          ${vars.COM_2_POS}<br>
          <b>กรรมการตรวจรับพัสดุ</b>
        </td>
      </tr>
    </table>
  </div>
</div>

<!-- หน้า 2: ผลการดำเนินงานในสัปดาห์ (ตาราง 4 แถวคงที่ตามสเปก V2) -->
<div class="page-break">
  <h2>หน้า 2: ผลการดำเนินงานในสัปดาห์ที่ ${vars.WN}</h2>
  
  <table>
    <thead>
      <tr>
        <th rowspan="2" style="width: 8%;">ที่<br>(WN)</th>
        <th rowspan="2" style="width: 44%;">งานที่ดำเนินการ<br>(WD)</th>
        <th rowspan="2" style="width: 12%;">สัดส่วนของงาน%<br>(WW)</th>
        <th colspan="3" style="width: 24%;">ผลงาน %</th>
        <th rowspan="2" style="width: 12%;">ผลงานรวม%<br>(WR)</th>
      </tr>
      <tr>
        <th style="width: 8%;">ถึงสัปดาห์ก่อน (WP)</th>
        <th style="width: 8%;">ในสัปดาห์นี้ (WT)</th>
        <th style="width: 8%;">สะสม (WC)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center bold">${vars.WN}</td>
        <td style="white-space: pre-line;">${vars.WD}</td>
        <td class="text-right">${Number(vars.WW).toFixed(2)}</td>
        <td class="text-right">${Number(vars.WP).toFixed(2)}</td>
        <td class="text-right bold">${Number(vars.WT).toFixed(2)}</td>
        <td class="text-right bold">${Number(vars.WC).toFixed(2)}</td>
        <td class="text-right bold">${Number(vars.WR).toFixed(2)}</td>
      </tr>
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td colspan="2" class="text-center">รวม</td>
        <td class="text-right">${Number(vars.WW).toFixed(2)}</td>
        <td colspan="3" class="text-center">-</td>
        <td class="text-right">${Number(vars.WR).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 24pt;">
    <p><b>ปัญหาและอุปสรรค:</b></p>
    <p>[ &nbsp; ] ไม่มีปัญหาอุปสรรค &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] มีปัญหาอุปสรรค (ระบุ)............................................................................</p>
  </div>
</div>

<!-- หน้า 3: บันทึกการปฏิบัติงานของผู้รับจ้าง (ตารางรายวัน + ตารางแรงงาน) -->
<div class="page-break">
  <h2>หน้า 3: บันทึกการปฏิบัติงานของผู้รับจ้าง ประจำสัปดาห์ที่ ${vars.WEEK}</h2>
  
  <h3>1. ตารางบันทึกการปฏิบัติงานและสภาพอากาศรายวัน (D1 - D7)</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">ลำดับ</th>
        <th style="width: 25%;">วันที่ (D1-D7)</th>
        <th style="width: 15%;">สภาพอากาศ (เช้า)</th>
        <th style="width: 15%;">สภาพอากาศ (บ่าย)</th>
        <th style="width: 35%;">รายละเอียดการดำเนินงาน (DAY_DESC)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">1</td>
        <td>${vars.D1 || vars.SD1 || '-'}</td>
        <td class="text-center">${vars.W_A1}</td>
        <td class="text-center">${vars.W_P1}</td>
        <td>${vars.DAY_DESC_1}</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>${vars.D2 || vars.SD2 || '-'}</td>
        <td class="text-center">${vars.W_A2}</td>
        <td class="text-center">${vars.W_P2}</td>
        <td>${vars.DAY_DESC_2}</td>
      </tr>
      <tr>
        <td class="text-center">3</td>
        <td>${vars.D3 || vars.SD3 || '-'}</td>
        <td class="text-center">${vars.W_A3}</td>
        <td class="text-center">${vars.W_P3}</td>
        <td>${vars.DAY_DESC_3}</td>
      </tr>
      <tr>
        <td class="text-center">4</td>
        <td>${vars.D4 || vars.SD4 || '-'}</td>
        <td class="text-center">${vars.W_A4}</td>
        <td class="text-center">${vars.W_P4}</td>
        <td>${vars.DAY_DESC_4}</td>
      </tr>
      <tr>
        <td class="text-center">5</td>
        <td>${vars.D5 || vars.SD5 || '-'}</td>
        <td class="text-center">${vars.W_A5}</td>
        <td class="text-center">${vars.W_P5}</td>
        <td>${vars.DAY_DESC_5}</td>
      </tr>
      <tr>
        <td class="text-center">6</td>
        <td>${vars.D6 || vars.SD6 || '-'}</td>
        <td class="text-center">${vars.W_A6}</td>
        <td class="text-center">${vars.W_P6}</td>
        <td>${vars.DAY_DESC_6}</td>
      </tr>
      <tr>
        <td class="text-center">7</td>
        <td>${vars.D7 || vars.SD7 || '-'}</td>
        <td class="text-center">${vars.W_A7}</td>
        <td class="text-center">${vars.W_P7}</td>
        <td>${vars.DAY_DESC_7}</td>
      </tr>
    </tbody>
  </table>

  <h3 style="margin-top: 14pt;">2. ตารางบัญชีแรงงาน ({#laborRows})</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">ประเภทแรงงาน</th>
        <th style="width: 9%;">${vars.SD1 || 'D1'}</th>
        <th style="width: 9%;">${vars.SD2 || 'D2'}</th>
        <th style="width: 9%;">${vars.SD3 || 'D3'}</th>
        <th style="width: 9%;">${vars.SD4 || 'D4'}</th>
        <th style="width: 9%;">${vars.SD5 || 'D5'}</th>
        <th style="width: 9%;">${vars.SD6 || 'D6'}</th>
        <th style="width: 9%;">${vars.SD7 || 'D7'}</th>
        <th style="width: 7%;">รวม</th>
      </tr>
    </thead>
    <tbody>
      ${vars.laborRows.map(row => `
        <tr>
          <td>${row.category}</td>
          <td class="text-center">${row.d1}</td>
          <td class="text-center">${row.d2}</td>
          <td class="text-center">${row.d3}</td>
          <td class="text-center">${row.d4}</td>
          <td class="text-center">${row.d5}</td>
          <td class="text-center">${row.d6}</td>
          <td class="text-center">${row.d7}</td>
          <td class="text-center bold">${row.total}</td>
        </tr>
      `).join('')}
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td class="text-center">ยอดรวมแรงงาน (LABOR_TOTAL)</td>
        <td class="text-center">${vars.LABOR_TOTAL_1}</td>
        <td class="text-center">${vars.LABOR_TOTAL_2}</td>
        <td class="text-center">${vars.LABOR_TOTAL_3}</td>
        <td class="text-center">${vars.LABOR_TOTAL_4}</td>
        <td class="text-center">${vars.LABOR_TOTAL_5}</td>
        <td class="text-center">${vars.LABOR_TOTAL_6}</td>
        <td class="text-center">${vars.LABOR_TOTAL_7}</td>
        <td class="text-center">${vars.LABOR_GRAND_TOTAL}</td>
      </tr>
    </tbody>
  </table>

  <div class="signature-block">
    <table style="border: none; margin-top: 20pt;">
      <tr style="border: none;">
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.SUPERVISOR_NAME}</b>)<br>
          ผู้ควบคุมงาน
        </td>
        <td style="border: none; text-align: center; width: 50%;">
          (ลงชื่อ)........................................................<br>
          (<b>${vars.CONTRACTOR_NAME}</b>)<br>
          ผู้รับจ้าง
        </td>
      </tr>
    </table>
  </div>
</div>

</body>
</html>
  `;

  return new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
}

export function downloadDocxFile(project: ContractProjectData) {
  const blob = generateDocxBlob(project);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const safeContractNo = (project.contractNumber || 'sample').replace(/\//g, '-');
  anchor.download = `รายงานผลงานก่อสร้าง_สัญญา_${safeContractNo}_สัปดาห์ที่_${project.reportWeekNo || 1}.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
