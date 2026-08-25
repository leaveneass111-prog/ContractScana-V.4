import React from 'react';
import { ContractProjectData } from '../../types';
import { resetPage5Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  Building,
  FileSignature,
  DollarSign,
  FileText,
  Users,
  UserCheck,
  HardHat,
} from 'lucide-react';

interface Page5ProjectDetailsProps {
  project: ContractProjectData;
  onChange: (updatedProject: ContractProjectData) => void;
}

export const Page5ProjectDetails: React.FC<Page5ProjectDetailsProps> = ({
  project,
  onChange,
}) => {
  const handleFieldChange = (field: keyof ContractProjectData, value: any) => {
    onChange({
      ...project,
      [field]: value,
    });
  };

  const handleSignatoryChange = (
    role: 'supervisor' | 'committeeChair' | 'committeeMember1' | 'committeeMember2',
    field: 'name' | 'position',
    value: string
  ) => {
    onChange({
      ...project,
      signatories: {
        ...project.signatories,
        [role]: {
          ...project.signatories[role],
          [field]: value,
        },
      },
    });
  };

  const handleClearPage5 = () => {
    onChange(resetPage5Data(project));
  };

  return (
    <div id="page-5-project-details" className="space-y-6">
      {/* Header with Inset Pill Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="neu-section-capsule">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
          <FileSignature className="w-4 h-4 text-orange-500" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            ข้อมูลโครงการและสัญญาจ้างฉบับเต็ม
          </h2>
        </div>

        <ClearPageButton pageNumber={5} onClear={handleClearPage5} />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: ข้อมูลผู้รับจ้าง */}
        <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-operator-info">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-orange-400" />
              <span>ข้อมูลผู้รับจ้าง</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="field-contractor" className="block text-xs font-bold text-orange-400 mb-1">
                ผู้รับจ้าง (Contractor):
              </label>
              <input
                id="field-contractor"
                type="text"
                value={project.contractorName}
                onChange={(e) => handleFieldChange('contractorName', e.target.value)}
                className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-bold text-orange-400"
              />
            </div>

            <div>
              <label htmlFor="field-contractor-address" className="block text-xs font-bold text-slate-400 mb-1">
                ที่อยู่ผู้รับจ้าง:
              </label>
              <input
                id="field-contractor-address"
                type="text"
                value={project.contractorAddress}
                onChange={(e) => handleFieldChange('contractorAddress', e.target.value)}
                className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: ข้อมูลสัญญาจ้าง */}
        <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-contract-info">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-orange-400" />
              <span>ข้อมูลสัญญาจ้าง</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-contract-num-full" className="block text-xs font-bold text-slate-400 mb-1">
                  สัญญาจ้างเลขที่:
                </label>
                <input
                  id="field-contract-num-full"
                  type="text"
                  value={project.contractNumber}
                  onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label htmlFor="field-contract-date-full" className="block text-xs font-bold text-slate-400 mb-1">
                  วันที่ทำสัญญา:
                </label>
                <input
                  id="field-contract-date-full"
                  type="date"
                  value={project.contractDate}
                  onChange={(e) => handleFieldChange('contractDate', e.target.value)}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-contract-amt" className="block text-xs font-bold text-orange-400 mb-1">
                  วงเงินค่าก่อสร้างตามสัญญา (บาท):
                </label>
                <input
                  id="field-contract-amt"
                  type="number"
                  value={project.contractAmount}
                  onChange={(e) => handleFieldChange('contractAmount', Number(e.target.value))}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-bold text-orange-400"
                />
              </div>

              <div>
                <label htmlFor="field-penalty-rate" className="block text-xs font-bold text-rose-400 mb-1">
                  ค่าปรับรายวัน (บาท/วัน):
                </label>
                <input
                  id="field-penalty-rate"
                  type="number"
                  value={project.dailyPenaltyRate}
                  onChange={(e) => handleFieldChange('dailyPenaltyRate', Number(e.target.value))}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="field-start-date-full" className="block text-xs font-bold text-slate-400 mb-1">
                  วันที่เริ่มสัญญา:
                </label>
                <input
                  id="field-start-date-full"
                  type="date"
                  value={project.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label htmlFor="field-end-date-full" className="block text-xs font-bold text-slate-400 mb-1">
                  วันที่สิ้นสุดสัญญา:
                </label>
                <input
                  id="field-end-date-full"
                  type="date"
                  value={project.endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label htmlFor="field-extended-date" className="block text-xs font-bold text-slate-400 mb-1">
                  วันต่อสัญญา (ถ้ามี):
                </label>
                <input
                  id="field-extended-date"
                  type="date"
                  value={project.extendedEndDate || ''}
                  onChange={(e) => handleFieldChange('extendedEndDate', e.target.value)}
                  className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-duration-days" className="block text-xs font-bold text-slate-400 mb-1">
                  ระยะเวลาสัญญา (วัน):
                </label>
                <input
                  id="field-duration-days"
                  type="number"
                  value={project.totalDurationDays}
                  onChange={(e) => handleFieldChange('totalDurationDays', Number(e.target.value))}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label htmlFor="field-total-installments-5" className="block text-xs font-bold text-slate-400 mb-1">
                  จำนวนงวดงานทั้งหมด:
                </label>
                <input
                  id="field-total-installments-5"
                  type="number"
                  value={project.totalInstallments}
                  onChange={(e) => handleFieldChange('totalInstallments', Number(e.target.value))}
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            {/* UI-only: CURRENT_PCT (% ผลงานปัจจุบัน) */}
            <div className="neu-pill-inset p-3 rounded-2xl flex items-center justify-between border border-orange-500/20 bg-orange-500/5">
              <div>
                <div className="text-[11px] font-bold text-slate-400">% ผลงานปัจจุบัน (สะสม WC)</div>
                <div className="text-[10px] text-slate-500">ดึงค่าผลงานสะสมล่าสุดมาแสดง</div>
              </div>
              <div className="text-base font-extrabold text-orange-400">
                {project.weeklyTasks.reduce((sum, t) => sum + (Number(t.wp) || 0) + (Number(t.wt) || 0), 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: รายละเอียดขอบเขตงาน */}
      <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-dimension-scope">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-400" />
            <span>ลักษณะและขอบเขตงาน</span>
          </div>
        </div>

        <div>
          <label htmlFor="field-scope-summary" className="block text-xs font-bold text-slate-400 mb-1.5">
            รายละเอียดขอบเขตงานโดยย่อ:
          </label>
          <textarea
            id="field-scope-summary"
            rows={4}
            value={project.scopeSummary}
            onChange={(e) => handleFieldChange('scopeSummary', e.target.value)}
            placeholder="ระบุข้อกำหนดทางเทคนิค งานโครงสร้าง ท่อระบายน้ำ ป้ายโครงการ..."
            className="w-full neu-input p-3.5 rounded-2xl text-xs focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>

      {/* CARD 4: ๑.๔ คณะกรรมการตรวจรับพัสดุ */}
      <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-committee-section">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span>๑.๔ คณะกรรมการตรวจรับพัสดุ</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* 1. ประธานกรรมการ */}
          <div className="p-4 rounded-2xl neu-flat-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">
                ๑. ประธานกรรมการตรวจรับพัสดุ
              </span>
              <span className="neu-pill-inset px-2.5 py-0.5 text-[11px] font-semibold text-orange-400/90 border border-orange-500/20">
                ประธานกรรมการ
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-com-p-name" className="block text-xs font-bold text-slate-400 mb-1">
                  ชื่อ-สกุล {'{{COM_P_NAME}}'}:
                </label>
                <input
                  id="field-com-p-name"
                  type="text"
                  value={project.signatories.committeeChair.name}
                  onChange={(e) => handleSignatoryChange('committeeChair', 'name', e.target.value)}
                  placeholder="เช่น นายมนตรี ฟูฟ้า"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label htmlFor="field-com-p-pos" className="block text-xs font-bold text-slate-400 mb-1">
                  ตำแหน่ง {'{{COM_P_POS}}'}:
                </label>
                <input
                  id="field-com-p-pos"
                  type="text"
                  value={project.signatories.committeeChair.position}
                  onChange={(e) => handleSignatoryChange('committeeChair', 'position', e.target.value)}
                  placeholder="เช่น ผู้อำนวยการกองช่าง"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. กรรมการ คนที่ 1 */}
          <div className="p-4 rounded-2xl neu-flat-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                ๒. กรรมการตรวจรับพัสดุ (คนที่ ๑)
              </span>
              <span className="neu-pill-inset px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 border border-white/10">
                กรรมการ
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-com-1-name" className="block text-xs font-bold text-slate-400 mb-1">
                  ชื่อ-สกุล {'{{COM_1_NAME}}'}:
                </label>
                <input
                  id="field-com-1-name"
                  type="text"
                  value={project.signatories.committeeMember1.name}
                  onChange={(e) => handleSignatoryChange('committeeMember1', 'name', e.target.value)}
                  placeholder="เช่น นางสาวธัญญารัตน์ กันทาสุข"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label htmlFor="field-com-1-pos" className="block text-xs font-bold text-slate-400 mb-1">
                  ตำแหน่ง {'{{COM_1_POS}}'}:
                </label>
                <input
                  id="field-com-1-pos"
                  type="text"
                  value={project.signatories.committeeMember1.position}
                  onChange={(e) => handleSignatoryChange('committeeMember1', 'position', e.target.value)}
                  placeholder="เช่น นักวิชาการเงินและบัญชีชำนาญการ"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. กรรมการ คนที่ 2 */}
          <div className="p-4 rounded-2xl neu-flat-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                ๓. กรรมการตรวจรับพัสดุ (คนที่ ๒)
              </span>
              <span className="neu-pill-inset px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 border border-white/10">
                กรรมการ
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-com-2-name" className="block text-xs font-bold text-slate-400 mb-1">
                  ชื่อ-สกุล {'{{COM_2_NAME}}'}:
                </label>
                <input
                  id="field-com-2-name"
                  type="text"
                  value={project.signatories.committeeMember2.name}
                  onChange={(e) => handleSignatoryChange('committeeMember2', 'name', e.target.value)}
                  placeholder="เช่น นายศราวุฒิ ทรายใจ"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label htmlFor="field-com-2-pos" className="block text-xs font-bold text-slate-400 mb-1">
                  ตำแหน่ง {'{{COM_2_POS}}'}:
                </label>
                <input
                  id="field-com-2-pos"
                  type="text"
                  value={project.signatories.committeeMember2.position}
                  onChange={(e) => handleSignatoryChange('committeeMember2', 'position', e.target.value)}
                  placeholder="เช่น นักวิชาการศึกษาชำนาญการ"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: CARD 5 & CARD 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 5: ๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง */}
        <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-supervisor-section">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl neu-flat-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">
                ๑. ผู้ควบคุมงาน
              </span>
              <span className="neu-pill-inset px-2.5 py-0.5 text-[11px] font-semibold text-orange-400/90 border border-orange-500/20">
                ผู้ควบคุมงาน
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="field-sup-name" className="block text-xs font-bold text-slate-400 mb-1">
                  ชื่อ-สกุล {'{{SUP_NAME}}'}:
                </label>
                <input
                  id="field-sup-name"
                  type="text"
                  value={project.signatories.supervisor.name}
                  onChange={(e) => handleSignatoryChange('supervisor', 'name', e.target.value)}
                  placeholder="เช่น นายช่างผู้ควบคุมงาน"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label htmlFor="field-sup-pos" className="block text-xs font-bold text-slate-400 mb-1">
                  ตำแหน่ง {'{{SUP_POS}}'}:
                </label>
                <input
                  id="field-sup-pos"
                  type="text"
                  value={project.signatories.supervisor.position}
                  onChange={(e) => handleSignatoryChange('supervisor', 'position', e.target.value)}
                  placeholder="เช่น นายช่างโยธาปฏิบัติงาน"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: ๑.๖ ผู้แทนผู้รับจ้าง */}
        <div className="neu-flat p-6 rounded-3xl space-y-4" id="card-contractor-rep-section">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-orange-400" />
              <span>๑.๖ ผู้แทนผู้รับจ้าง</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl neu-flat-sm space-y-3">
            <div>
              <label htmlFor="field-rep-1" className="block text-xs font-bold text-slate-400 mb-1">
                1. ผู้แทนผู้รับจ้าง {'{{REP_1}}'}:
              </label>
              <input
                id="field-rep-1"
                type="text"
                value={project.contractorRep1 || ''}
                onChange={(e) => handleFieldChange('contractorRep1', e.target.value)}
                placeholder="ระบุชื่อผู้แทนผู้รับจ้าง คนที่ 1"
                className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label htmlFor="field-rep-2" className="block text-xs font-bold text-slate-400 mb-1">
                ๒. ผู้แทนผู้รับจ้าง {'{{REP_2}}'}:
              </label>
              <input
                id="field-rep-2"
                type="text"
                value={project.contractorRep2 || ''}
                onChange={(e) => handleFieldChange('contractorRep2', e.target.value)}
                placeholder="ระบุชื่อผู้แทนผู้รับจ้าง คนที่ 2"
                className="w-full neu-input px-3.5 py-2 rounded-xl text-xs font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
