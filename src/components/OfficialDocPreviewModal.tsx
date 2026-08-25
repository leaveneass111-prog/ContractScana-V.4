import React from 'react';
import { ContractProjectData } from '../types';
import { GarudaEmblem } from './GarudaEmblem';
import {
  calculateProjectSummary,
  calculateTaskTotals,
  calculateLaborMatrixTotals,
  formatCurrency,
} from '../utils/calculations';
import { downloadDocxFile } from '../utils/docxExport';
import { buildTemplateVariables } from '../utils/templateVariables';
import {
  X,
  Printer,
  FileDown,
  BookOpen,
} from 'lucide-react';

interface OfficialDocPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ContractProjectData;
}

const toThaiDigit = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return val.toString().replace(/[0-9]/g, (d) => thaiDigits[parseInt(d, 10)]);
};

export const OfficialDocPreviewModal: React.FC<OfficialDocPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [selectedPreviewPage, setSelectedPreviewPage] = React.useState<number>(1);
  const vars = React.useMemo(() => buildTemplateVariables(project), [project]);
  const summary = calculateProjectSummary(project);
  const taskTotals = calculateTaskTotals(project.weeklyTasks);
  const laborTotals = calculateLaborMatrixTotals(project.laborMatrix);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      id="official-doc-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      {/* Modal Card Container */}
      <div
        className="relative w-full max-w-5xl bg-[#0c0e14] text-slate-100 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/[0.08]"
      >
        {/* Modal Top Controls Bar (Hidden during print) */}
        <div className="no-print p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-[#12151f]/70">
          <div className="neu-section-capsule">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <BookOpen className="w-4 h-4 text-orange-400" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                ตัวอย่างเอกสารราชการทางการ (Official A4 Preview - Template V2)
              </h3>
              <p className="text-[11px] text-slate-400">
                สัญญาเลขที่: {vars.C_NO || '-'} | สัปดาห์ที่ {vars.WEEK}
              </p>
            </div>
          </div>

          {/* Quick Page Picker Tabs */}
          <div className="flex items-center neu-pill-inset p-1 rounded-full gap-1 overflow-x-auto max-w-full border border-orange-500/20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={`prev-page-tab-${num}`}
                type="button"
                onClick={() => setSelectedPreviewPage(num)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedPreviewPage === num
                    ? 'neu-button text-orange-400 bg-orange-500/10 border border-orange-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                หน้า {num}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-doc"
              onClick={handlePrint}
              className="neu-button px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1.5 hover:border-orange-500/30"
              title="พิมพ์เอกสารออกเครื่องพิมพ์ / บันทึกเป็น PDF"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>พิมพ์ / PDF</span>
            </button>

            <button
              type="button"
              id="btn-export-docx-modal"
              onClick={() => downloadDocxFile(project)}
              className="neu-button px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20"
              title="ดาวน์โหลดไฟล์เอกสาร .doc/.docx"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export .docx</span>
            </button>

            <button
              type="button"
              id="btn-close-preview-modal"
              onClick={onClose}
              className="neu-button p-1.5 rounded-full text-slate-400 hover:text-slate-100"
              title="ปิดหน้าต่าง"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Document Sheet View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-black/40 flex justify-center">
          <div
            id="printable-official-a4"
            className="w-full max-w-[850px] bg-white text-slate-900 shadow-xl rounded-2xl p-8 sm:p-14 font-['Sarabun'] leading-relaxed text-[15px] space-y-6 print:shadow-none print:p-0 print:rounded-none"
          >
            {/* PAGE 1: บันทึกข้อความสัปดาห์ (Template V2 Variables) */}
            {selectedPreviewPage === 1 && (
              <div className="space-y-6 animate-in fade-in">
                {/* Garuda */}
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <GarudaEmblem size="lg" showFrame={false} />
                  <h1 className="text-3xl font-extrabold tracking-wide mt-2">
                    บันทึกข้อความ
                  </h1>
                </div>

                {/* Memo Header */}
                <div className="grid grid-cols-12 gap-2 text-sm border-b pb-4">
                  <div className="col-span-8">
                    <span className="font-bold">ส่วนราชการ:</span> {project.organization || 'องค์การบริหารส่วนตำบลตัวอย่างพัฒนา'}
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="font-bold">ที่:</span> {vars.DOC_NO || '-'}
                  </div>
                  <div className="col-span-8">
                    <span className="font-bold">เรื่อง:</span> {project.subjectWeekly || 'รายงานผลการปฏิบัติงานของผู้ควบคุมงานประจำสัปดาห์'}
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="font-bold">วันที่:</span> {vars.R_DATE || '-'}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="font-bold">เรียน:</span> ประธานกรรมการตรวจรับพัสดุ
                </div>

                {/* Content Paragraphs */}
                <p className="text-justify indent-10 text-sm">
                  ตามที่ {project.organization || 'องค์การบริหารส่วนตำบลตัวอย่างพัฒนา'} ได้ตกลงจ้าง <b>{vars.CONTRACTOR}</b> ตามสัญญาจ้างเลขที่ <b>{vars.C_NO}</b> ลงวันที่ <b>{vars.C_DATE}</b> เพื่อดำเนินงาน <b>{vars.PROJECT}</b> สถานที่ก่อสร้าง ณ {vars.LOCATION} {vars.QTY ? `ปริมาณงาน ${vars.QTY}` : ''} ในวงเงินค่าก่อสร้างจำนวน <b>{vars.COST} บาท</b> กำหนดระยะเวลาทำการ <b>{vars.DAYS} วัน</b> เริ่มต้นสัญญาวันที่ {vars.START} และสิ้นสุดสัญญาวันที่ {vars.C_END} อัตราค่าปรับวันละ <b>{vars.FINE} บาท</b> นั้น
                </p>

                <p className="text-justify indent-10 text-sm">
                  ข้าพเจ้า <b>{vars.SUP_NAME}</b> ในฐานะผู้ควบคุมงาน ขอรายงานผลการปฏิบัติงานก่อสร้างประจำสัปดาห์ที่ <b>{vars.WEEK}</b> ระหว่างวันที่ <b>{vars.START} ถึงวันที่ {vars.END}</b> โดยมีระยะเวลาก่อสร้างคงเหลือ <b>{vars.REMAIN} วัน</b> งบประมาณรวม <b>{vars.BUDGET} บาท</b> ดังนี้
                </p>

                {/* Summary Table */}
                <table className="w-full border-collapse border border-slate-400 text-xs text-center my-4">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-400 p-2">% ผลงานปัจจุบัน</th>
                      <th className="border border-slate-400 p-2">เปรียบเทียบแผนงาน</th>
                      <th className="border border-slate-400 p-2">ระยะเวลาคงเหลือ (REMAIN)</th>
                      <th className="border border-slate-400 p-2">งบประมาณรวม (BUDGET)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-400 p-2.5 font-bold text-base text-orange-600">
                        {summary.currentActualProgress.toFixed(2)}%
                      </td>
                      <td className="border border-slate-400 p-2.5 font-bold">
                        {summary.variance >= 0 ? `เร็วกว่าแผน (+${summary.variance}%)` : `ช้ากว่าแผน (${summary.variance}%)`}
                      </td>
                      <td className="border border-slate-400 p-2.5 font-medium">
                        {vars.REMAIN} วัน (จาก {vars.DAYS} วัน)
                      </td>
                      <td className="border border-slate-400 p-2.5 font-medium">
                        {vars.BUDGET} บาท
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-sm indent-10">
                  จึงเรียนมาเพื่อโปรดทราบและพิจารณา
                </p>

                {/* Signatures */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="space-y-1">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.SUP_NAME})</p>
                    <p>{vars.SUP_POS}</p>
                    <p className="font-bold text-slate-700">ผู้ควบคุมงาน</p>
                  </div>

                  <div className="space-y-1">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.COM_P_NAME})</p>
                    <p>{vars.COM_P_POS}</p>
                    <p className="font-bold text-slate-700">ประธานกรรมการตรวจรับพัสดุ</p>
                  </div>

                  <div className="space-y-1 pt-4">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.COM_1_NAME})</p>
                    <p>{vars.COM_1_POS}</p>
                    <p className="font-bold text-slate-700">กรรมการตรวจรับพัสดุ</p>
                  </div>

                  <div className="space-y-1 pt-4">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.COM_2_NAME})</p>
                    <p>{vars.COM_2_POS}</p>
                    <p className="font-bold text-slate-700">กรรมการตรวจรับพัสดุ</p>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 2: ตารางผลการดำเนินงานในสัปดาห์ (Template V2 Single-Row Structure) */}
            {selectedPreviewPage === 2 && (
              <div className="space-y-6 animate-in fade-in text-xs">
                <h2 className="text-lg font-bold text-center border-b pb-2">
                  เอกสารหน้า 2: ผลการดำเนินงานในสัปดาห์ที่ {vars.WN}
                </h2>

                <table className="w-full border-collapse border border-slate-400 text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th rowSpan={2} className="border border-slate-400 p-2 w-12">ที่<br/>(WN)</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 text-left">งานที่ดำเนินการ (WD)</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 w-20 leading-tight">สัดส่วนของงาน%<br/>(WW)</th>
                      <th colSpan={3} className="border border-slate-400 p-1.5">ผลงาน %</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 w-20 leading-tight">ผลงานรวม%<br/>(WR)</th>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-slate-400 p-1.5 w-20">ถึงสัปดาห์ก่อน<br/>(WP)</th>
                      <th className="border border-slate-400 p-1.5 w-20">ในสัปดาห์นี้<br/>(WT)</th>
                      <th className="border border-slate-400 p-1.5 w-20">สะสม<br/>(WC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="align-top">
                      <td className="border border-slate-400 p-2 font-bold">{vars.WN}</td>
                      <td className="border border-slate-400 p-2 text-left whitespace-pre-line leading-relaxed">
                        {vars.WD}
                      </td>
                      <td className="border border-slate-400 p-2 text-right font-bold">{Number(vars.WW).toFixed(2)}</td>
                      <td className="border border-slate-400 p-2 text-right">{Number(vars.WP).toFixed(2)}</td>
                      <td className="border border-slate-400 p-2 text-right font-bold text-orange-600">{Number(vars.WT).toFixed(2)}</td>
                      <td className="border border-slate-400 p-2 text-right font-bold text-emerald-600">{Number(vars.WC).toFixed(2)}</td>
                      <td className="border border-slate-400 p-2 text-right font-bold">{Number(vars.WR).toFixed(2)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="border border-slate-400 p-2 text-center">รวม</td>
                      <td className="border border-slate-400 p-2 text-right">{Number(vars.WW).toFixed(2)}</td>
                      <td colSpan={3} className="border border-slate-400 p-2 text-center">-</td>
                      <td className="border border-slate-400 p-2 text-right">{Number(vars.WR).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-8 p-4 border border-slate-300 rounded-lg space-y-2 bg-slate-50">
                  <p className="font-bold">ปัญหาและอุปสรรค:</p>
                  <p>[ &nbsp; ] ไม่มีปัญหาอุปสรรค &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] มีปัญหาอุปสรรค (ระบุ)............................................................................................................................</p>
                </div>
              </div>
            )}

            {/* PAGE 3: รายงานสภาพอากาศและแรงงาน (Template V2) */}
            {selectedPreviewPage === 3 && (
              <div className="space-y-6 animate-in fade-in text-xs">
                <h2 className="text-lg font-bold text-center border-b pb-2">
                  เอกสารหน้า 3: บันทึกการปฏิบัติงานของผู้รับจ้าง ประจำสัปดาห์ที่ {vars.WEEK}
                </h2>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">1. ตารางบันทึกการปฏิบัติงานและสภาพอากาศรายวัน (D1 - D7):</h4>
                  <table className="w-full border-collapse border border-slate-400 text-center">
                    <thead>
                      <tr className="bg-slate-100 font-bold">
                        <th className="border border-slate-400 p-1.5 w-12">ลำดับ</th>
                        <th className="border border-slate-400 p-1.5 w-32">วันที่ (D1-D7)</th>
                        <th className="border border-slate-400 p-1.5 w-24">สภาพอากาศ (เช้า)</th>
                        <th className="border border-slate-400 p-1.5 w-24">สภาพอากาศ (บ่าย)</th>
                        <th className="border border-slate-400 p-1.5 text-left">รายละเอียดการดำเนินงาน (DAY_DESC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { no: 1, date: vars.D1, wA: vars.W_A1, wP: vars.W_P1, desc: vars.DAY_DESC_1 },
                        { no: 2, date: vars.D2, wA: vars.W_A2, wP: vars.W_P2, desc: vars.DAY_DESC_2 },
                        { no: 3, date: vars.D3, wA: vars.W_A3, wP: vars.W_P3, desc: vars.DAY_DESC_3 },
                        { no: 4, date: vars.D4, wA: vars.W_A4, wP: vars.W_P4, desc: vars.DAY_DESC_4 },
                        { no: 5, date: vars.D5, wA: vars.W_A5, wP: vars.W_P5, desc: vars.DAY_DESC_5 },
                        { no: 6, date: vars.D6, wA: vars.W_A6, wP: vars.W_P6, desc: vars.DAY_DESC_6 },
                        { no: 7, date: vars.D7, wA: vars.W_A7, wP: vars.W_P7, desc: vars.DAY_DESC_7 },
                      ].map((item) => (
                        <tr key={item.no}>
                          <td className="border border-slate-400 p-1.5 font-bold">{item.no}</td>
                          <td className="border border-slate-400 p-1.5">{item.date || '-'}</td>
                          <td className="border border-slate-400 p-1.5">{item.wA}</td>
                          <td className="border border-slate-400 p-1.5">{item.wP}</td>
                          <td className="border border-slate-400 p-1.5 text-left">{item.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-sm">2. ตารางบัญชีแรงงาน ({'{#laborRows}'}):</h4>
                  <table className="w-full border-collapse border border-slate-400 text-center">
                    <thead>
                      <tr className="bg-slate-100 font-bold">
                        <th className="border border-slate-400 p-1.5 text-left">ประเภทแรงงาน</th>
                        <th className="border border-slate-400 p-1">{vars.SD1 || 'SD1'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD2 || 'SD2'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD3 || 'SD3'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD4 || 'SD4'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD5 || 'SD5'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD6 || 'SD6'}</th>
                        <th className="border border-slate-400 p-1">{vars.SD7 || 'SD7'}</th>
                        <th className="border border-slate-400 p-1.5">รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vars.laborRows.map((r, rIdx) => (
                        <tr key={rIdx}>
                          <td className="border border-slate-400 p-1 text-left">{r.category}</td>
                          <td className="border border-slate-400 p-1">{r.d1}</td>
                          <td className="border border-slate-400 p-1">{r.d2}</td>
                          <td className="border border-slate-400 p-1">{r.d3}</td>
                          <td className="border border-slate-400 p-1">{r.d4}</td>
                          <td className="border border-slate-400 p-1">{r.d5}</td>
                          <td className="border border-slate-400 p-1">{r.d6}</td>
                          <td className="border border-slate-400 p-1">{r.d7}</td>
                          <td className="border border-slate-400 p-1 font-bold">{r.total}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                        <td className="border border-slate-400 p-1.5 text-left">ยอดรวมแรงงาน (LABOR_TOTAL)</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_1}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_2}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_3}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_4}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_5}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_6}</td>
                        <td className="border border-slate-400 p-1.5">{vars.LABOR_TOTAL_7}</td>
                        <td className="border border-slate-400 p-1.5 font-black">{vars.LABOR_GRAND_TOTAL}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures zone */}
                <div className="pt-6 border-t border-dashed border-slate-400 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="space-y-1">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.SUPERVISOR_NAME || 'นายสมชาย ตัวอย่างช่าง'})</p>
                    <p className="font-bold text-slate-700">ผู้ควบคุมงาน</p>
                  </div>

                  <div className="space-y-1">
                    <p>(ลงชื่อ).......................................................</p>
                    <p className="font-bold">({vars.CONTRACTOR_NAME || 'ห้างหุ้นส่วนจำกัด ตัวอย่างการโยธาและก่อสร้าง'})</p>
                    <p className="font-bold text-slate-700">ผู้รับจ้าง</p>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 6: ตารางผลการดำเนินงานประจำเดือน */}
            {selectedPreviewPage === 6 && (
              <div className="space-y-6 animate-in fade-in text-xs">
                <h2 className="text-lg font-bold text-center border-b pb-2">
                  เอกสารหน้า 6 : ผลการดำเนินงานประจำเดือน
                </h2>

                <table className="w-full border-collapse border border-slate-400 text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th rowSpan={2} className="border border-slate-400 p-2 w-12">ที่</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 text-left">งานที่ดำเนินการ</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 w-20 leading-tight">สัดส่วน<br />ของงาน %</th>
                      <th colSpan={3} className="border border-slate-400 p-1.5">ผลงาน</th>
                      <th rowSpan={2} className="border border-slate-400 p-2 w-20 leading-tight">ผลงานรวม<br />%</th>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-slate-400 p-1.5 w-16">ถึงเดือนก่อน</th>
                      <th className="border border-slate-400 p-1.5 w-16">ในเดือน</th>
                      <th className="border border-slate-400 p-1.5 w-16">สะสม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.monthlyProgressLogs.map((item, idx) => {
                      const weightVal = item.weightPct ?? item.plannedPct ?? 0;
                      const prevVal = item.prevMonthPct ?? 0;
                      const inMonthVal = item.inMonthPct ?? item.actualPct ?? 0;
                      const accVal = item.accumulatedPct ?? item.cumulativePct ?? (prevVal + inMonthVal);
                      const totalWorkVal = item.totalWorkPct ?? accVal;
                      const activities = (item.activitiesText ?? item.keyActivities ?? '').split('\n').filter(Boolean);

                      return (
                        <tr key={item.id} className="align-top">
                          <td className="border border-slate-400 p-2 font-bold">{idx + 1}</td>
                          <td className="border border-slate-400 p-2 text-left space-y-1.5">
                            <div className="font-bold text-slate-900 text-center border-b border-slate-200 pb-1">{item.monthName}</div>
                            {activities.map((act, aIdx) => (
                              <div key={aIdx} className="text-slate-700 pl-1">{act}</div>
                            ))}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">{weightVal}</td>
                          <td className="border border-slate-400 p-2 text-center">{prevVal}</td>
                          <td className="border border-slate-400 p-2 text-center font-bold">{inMonthVal}</td>
                          <td className="border border-slate-400 p-2 text-center font-bold">{accVal}</td>
                          <td className="border border-slate-400 p-2 text-center font-bold">{totalWorkVal}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td className="border border-slate-400 p-2"></td>
                      <td className="border border-slate-400 p-2 text-center font-black">รวม</td>
                      <td className="border border-slate-400 p-2 text-center font-black">
                        {project.monthlyProgressLogs.reduce((sum, it) => sum + (Number(it.weightPct ?? it.plannedPct) || 0), 0)}
                      </td>
                      <td className="border border-slate-400 p-2"></td>
                      <td className="border border-slate-400 p-2 text-center font-black">รวม</td>
                      <td className="border border-slate-400 p-2"></td>
                      <td className="border border-slate-400 p-2 text-center font-black">
                        {project.monthlyProgressLogs[project.monthlyProgressLogs.length - 1]?.totalWorkPct ??
                         project.monthlyProgressLogs[project.monthlyProgressLogs.length - 1]?.accumulatedPct ?? 100}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGE 7 PREVIEW: Milestones & Material Quality Tests / Approvals */}
            {selectedPreviewPage === 7 && (
              <div className="space-y-6 animate-in fade-in text-xs font-serif leading-relaxed text-slate-900">
                <div className="space-y-2">
                  <div className="font-bold text-sm text-slate-900">
                    ๓. รายละเอียดงวดงาน และการตรวจรับงาน
                  </div>
                  <table className="w-full border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-400 p-2 w-16">งานงวดที่</th>
                        <th className="border border-slate-400 p-2 w-32">จำนวนเงิน<br />(บาท)</th>
                        <th className="border border-slate-400 p-2">วัน เดือน ปี<br />ที่แล้วเสร็จ</th>
                        <th className="border border-slate-400 p-2">วัน เดือน ปี<br />ที่ตรวจรับ</th>
                        <th className="border border-slate-400 p-2 w-32">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.milestones.map((ms) => (
                        <tr key={ms.id} className="text-center align-middle">
                          <td className="border border-slate-400 p-2 font-bold">{toThaiDigit(ms.installmentNo)}</td>
                          <td className="border border-slate-400 p-2 font-mono">
                            {ms.amount ? toThaiDigit(ms.amount.toLocaleString()) : vars.BUDGET}
                          </td>
                          <td className="border border-slate-400 p-2">{ms.finishDateText || ms.actualFinishDate || 'ตามแผนงาน'}</td>
                          <td className="border border-slate-400 p-2">{ms.inspectionDateText || ms.inspectionDate || 'ตามแผนงาน'}</td>
                          <td className="border border-slate-400 p-2">{ms.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="font-bold text-sm text-slate-900">
                    ๔. ผลการทดสอบ/ขออนุมัติใช้วัสดุ
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-xs pl-2">๔.๑ การทดสอบวัสดุ</div>
                    <table className="w-full border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-slate-400 p-2">รายการทดสอบวัสดุ</th>
                          <th className="border border-slate-400 p-2 w-28">จำนวนตัวอย่าง</th>
                          <th className="border border-slate-400 p-2 w-24">วันที่ทดสอบ</th>
                          <th className="border border-slate-400 p-2 w-32">หน่วยงานที่ทดสอบ</th>
                          <th className="border border-slate-400 p-2 w-24">ตำแหน่งที่ทดสอบ</th>
                          <th className="border border-slate-400 p-2 w-28">ผลการทดสอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.materialTests.map((test) => (
                          <tr key={test.id} className="align-middle text-center">
                            <td className="border border-slate-400 p-2 text-left">{test.item}</td>
                            <td className="border border-slate-400 p-2 whitespace-pre-line">{test.sampleCount || '-'}</td>
                            <td className="border border-slate-400 p-2">{test.testDateText || test.testDate || '-'}</td>
                            <td className="border border-slate-400 p-2">{test.testingAuthority || '-'}</td>
                            <td className="border border-slate-400 p-2">{test.location || '-'}</td>
                            <td className="border border-slate-400 p-2 font-bold">{test.resultText || 'ตามผลการทดสอบ'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-xs pl-2">๔.๒ การขออนุมัติใช้วัสดุ</div>
                    <table className="w-full border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-slate-400 p-2">รายการที่ขออนุมัติ</th>
                          <th className="border border-slate-400 p-2 w-28">วันที่ขออนุมัติ</th>
                          <th className="border border-slate-400 p-2 w-32">ผู้พิจารณา</th>
                          <th className="border border-slate-400 p-2 w-28">ผลการพิจารณา</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.materialApprovals.map((appr) => (
                          <tr key={appr.id} className="align-middle text-center">
                            <td className="border border-slate-400 p-2 text-left">{appr.item}</td>
                            <td className="border border-slate-400 p-2">{appr.requestDateText || appr.requestDate || '-'}</td>
                            <td className="border border-slate-400 p-2">{appr.reviewer || '-'}</td>
                            <td className="border border-slate-400 p-2 font-bold">{appr.decisionText || 'อนุมัติ'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other Pages Preview fallback */}
            {selectedPreviewPage >= 4 && selectedPreviewPage !== 6 && selectedPreviewPage !== 7 && (
              <div className="space-y-6 animate-in fade-in text-xs">
                <h2 className="text-lg font-bold text-center border-b pb-2">
                  เอกสารหน้า {selectedPreviewPage} : รายงานสรุปผลงานตามมาตรฐาน
                </h2>
                <div className="p-4 border rounded-xl space-y-3 bg-slate-50">
                  <p><span className="font-bold">โครงการ (PROJECT):</span> {vars.PROJECT}</p>
                  <p><span className="font-bold">สัญญาจ้างเลขที่ (C_NO):</span> {vars.C_NO} ลงวันที่ {vars.C_DATE}</p>
                  <p><span className="font-bold">ผู้รับจ้าง (CONTRACTOR):</span> {vars.CONTRACTOR}</p>
                  <p><span className="font-bold">วงเงินค่าก่อสร้าง (COST):</span> ฿{vars.COST}</p>
                  <p><span className="font-bold">ผลงานสะสมปัจจุบัน (WC / CURRENT_PCT):</span> {vars.WC}% ({summary.isAhead ? `เร็วกว่าแผน +${summary.variance}%` : `ช้ากว่าแผน ${summary.variance}%`})</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print p-4 border-t border-white/[0.06] flex items-center justify-between bg-[#12151f]/70 text-xs">
          <span className="text-slate-400">
            ระบบจัดทำแบบฟอร์มเอกสารก่อสร้างมาตรฐานราชการไทย ContractScan V2
          </span>
          <button
            type="button"
            onClick={onClose}
            className="neu-button px-5 py-2 rounded-full font-bold text-slate-300 hover:text-slate-100 hover:border-orange-500/30"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
