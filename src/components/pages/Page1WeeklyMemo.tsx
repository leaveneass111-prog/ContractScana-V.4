import React from 'react';
import { ContractProjectData } from '../../types';
import { calculateProjectSummary, formatCurrency } from '../../utils/calculations';
import { resetPage1Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface Page1Props {
  project: ContractProjectData;
  onChange: (updated: ContractProjectData) => void;
}

export const Page1WeeklyMemo: React.FC<Page1Props> = ({ project, onChange }) => {
  const summary = calculateProjectSummary(project);

  const handleFieldChange = (field: keyof ContractProjectData, value: any) => {
    onChange({
      ...project,
      [field]: value,
    });
  };

  const handleSignatoryChange = (
    role: keyof ContractProjectData['signatories'],
    subField: 'name' | 'position',
    value: string
  ) => {
    onChange({
      ...project,
      signatories: {
        ...project.signatories,
        [role]: {
          ...project.signatories[role],
          [subField]: value,
        },
      },
    });
  };

  const handleClearPage1 = () => {
    onChange(resetPage1Data(project));
  };

  return (
    <div id="page-1-weekly-memo" className="space-y-6">
      {/* Page Title & Clear Action with Inset Pill Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="neu-section-capsule">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
          <FileText className="w-4 h-4 text-orange-500" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            บันทึกข้อความ (รายงานประจำสัปดาห์)
          </h2>
        </div>

        <ClearPageButton pageNumber={1} onClear={handleClearPage1} />
      </div>

      {/* Report Scope & Contract Info Card */}
      <div className="neu-flat p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="field-reportWeekNo" className="block text-xs font-bold text-slate-400 mb-1.5">
              รายงานประจำสัปดาห์ที่ (ครั้งที่):
            </label>
            <div className="neu-inset rounded-2xl p-1">
              <input
                id="field-reportWeekNo"
                type="number"
                min={1}
                value={project.reportWeekNo}
                onChange={(e) => handleFieldChange('reportWeekNo', Number(e.target.value))}
                className="w-full bg-transparent px-3 py-1.5 text-sm font-bold text-center text-orange-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="field-periodStart" className="block text-xs font-bold text-slate-400 mb-1.5">
              ระหว่างวันที่:
            </label>
            <input
              id="field-periodStart"
              type="date"
              value={project.periodStart}
              onChange={(e) => handleFieldChange('periodStart', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>

          <div>
            <label htmlFor="field-periodEnd" className="block text-xs font-bold text-slate-400 mb-1.5">
              ถึงวันที่:
            </label>
            <input
              id="field-periodEnd"
              type="date"
              value={project.periodEnd}
              onChange={(e) => handleFieldChange('periodEnd', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-projectName" className="block text-xs font-bold text-slate-400 mb-1.5">
              โครงการ:
            </label>
            <input
              id="field-projectName"
              type="text"
              value={project.projectName}
              onChange={(e) => handleFieldChange('projectName', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>

          <div>
            <label htmlFor="field-location" className="block text-xs font-bold text-slate-400 mb-1.5">
              สถานที่ก่อสร้าง:
            </label>
            <input
              id="field-location"
              type="text"
              value={project.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="field-contractNumber" className="block text-xs font-bold text-slate-400 mb-1.5">
              สัญญาจ้างเลขที่:
            </label>
            <input
              id="field-contractNumber"
              type="text"
              value={project.contractNumber}
              onChange={(e) => handleFieldChange('contractNumber', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>

          <div>
            <label htmlFor="field-startDate" className="block text-xs font-bold text-slate-400 mb-1.5">
              วันที่เริ่มต้นสัญญา:
            </label>
            <input
              id="field-startDate"
              type="date"
              value={project.startDate}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>

          <div>
            <label htmlFor="field-endDate" className="block text-xs font-bold text-slate-400 mb-1.5">
              วันที่สิ้นสุดสัญญา:
            </label>
            <input
              id="field-endDate"
              type="date"
              value={project.endDate}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              className="w-full neu-input px-4 py-2.5 rounded-2xl text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Auto-calculated Summary Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="neu-section-capsule">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              ตารางสรุปการปฏิบัติงานและงบประมาณ
            </h3>
          </div>
          <span className="neu-pill-inset px-3 py-1 text-xs text-orange-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            คำนวณอัตโนมัติ
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1: Current Actual % with Inset Pill */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5" id="stat-current-progress">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              % ผลงานปัจจุบัน
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-xl sm:text-2xl font-black text-orange-400 border border-orange-500/30">
              {summary.currentActualProgress.toFixed(2)}%
            </div>
            <span className="text-[11px] text-slate-400 block">รวมจากตารางงานหน้า 2</span>
          </div>

          {/* 2: Ahead / Behind Plan */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5" id="stat-variance-plan">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              งานเร็วกว่า/ช้ากว่าแผน
            </span>
            <div
              className={`neu-pill-inset px-3 py-1.5 inline-block text-xl sm:text-2xl font-black ${
                summary.isAhead ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'
              }`}
            >
              {summary.variance >= 0 ? `+${summary.variance}%` : `${summary.variance}%`}
            </div>
            <span className="text-[11px] text-slate-400 block">
              {summary.isAhead ? 'เร็วกว่าแผนงาน' : 'ช้ากว่าแผนงาน'}
            </span>
          </div>

          {/* 3: Remaining Days */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5" id="stat-remaining-days">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              ระยะเวลาก่อสร้างคงเหลือ
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-xl sm:text-2xl font-black text-slate-100">
              {summary.remainingDays} <span className="text-xs font-semibold text-slate-400">วัน</span>
            </div>
            <span className="text-[11px] text-slate-400 block">จากทั้งหมด {summary.totalDays} วัน</span>
          </div>

          {/* 4: Disbursed Amount */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5" id="stat-disbursed-amount">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              วงเงินเบิกจ่ายแล้ว
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-lg sm:text-xl font-black text-emerald-400 border border-emerald-500/30">
              ฿{formatCurrency(project.disbursedAmount)}
            </div>
            <span className="text-[11px] text-slate-400 block">
              คิดเป็น {summary.disbursedPct}% ของสัญญา
            </span>
          </div>
        </div>

        {/* Second Row of Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="neu-flat-sm p-3.5 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-400 block">ค่างวดงานทั้งหมด:</span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {project.totalInstallments} งวด
            </div>
          </div>

          <div className="neu-flat-sm p-3.5 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-400 block">งวดที่ตรวจรับแล้ว:</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {project.inspectedInstallments} / {project.totalInstallments} งวด
            </div>
          </div>

          <div className="neu-flat-sm p-3.5 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-400 block">ปีงบประมาณ:</span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {project.budgetYear}
            </div>
          </div>

          <div className="neu-flat-sm p-3.5 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-400 block">วงเงินงบประมาณรวม:</span>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              ฿{formatCurrency(project.totalBudget)}
            </div>
          </div>
        </div>
      </div>

      {/* Signatories Section */}
      <div className="neu-flat p-6 rounded-3xl space-y-4">
        <div className="neu-section-capsule">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
          <UserCheck className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            ผู้ลงนามรับรองรายงาน
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supervisor */}
          <div className="neu-flat-sm p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">
                {project.signatories.supervisor.roleTitle}
              </span>
              <span className="text-[11px] text-slate-400">ผู้จัดทำรายงาน</span>
            </div>
            <input
              type="text"
              value={project.signatories.supervisor.name}
              onChange={(e) => handleSignatoryChange('supervisor', 'name', e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs font-medium"
            />
            <input
              type="text"
              value={project.signatories.supervisor.position}
              onChange={(e) => handleSignatoryChange('supervisor', 'position', e.target.value)}
              placeholder="ตำแหน่ง"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Committee Chair */}
          <div className="neu-flat-sm p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">
                {project.signatories.committeeChair.roleTitle}
              </span>
              <span className="text-[11px] text-slate-400">ประธานกรรมการ</span>
            </div>
            <input
              type="text"
              value={project.signatories.committeeChair.name}
              onChange={(e) => handleSignatoryChange('committeeChair', 'name', e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs font-medium"
            />
            <input
              type="text"
              value={project.signatories.committeeChair.position}
              onChange={(e) => handleSignatoryChange('committeeChair', 'position', e.target.value)}
              placeholder="ตำแหน่ง"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Committee Member 1 */}
          <div className="neu-flat-sm p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {project.signatories.committeeMember1.roleTitle} (คนที่ 1)
              </span>
              <span className="text-[11px] text-slate-400">กรรมการ</span>
            </div>
            <input
              type="text"
              value={project.signatories.committeeMember1.name}
              onChange={(e) => handleSignatoryChange('committeeMember1', 'name', e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs font-medium"
            />
            <input
              type="text"
              value={project.signatories.committeeMember1.position}
              onChange={(e) => handleSignatoryChange('committeeMember1', 'position', e.target.value)}
              placeholder="ตำแหน่ง"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Committee Member 2 */}
          <div className="neu-flat-sm p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {project.signatories.committeeMember2.roleTitle} (คนที่ 2)
              </span>
              <span className="text-[11px] text-slate-400">กรรมการ</span>
            </div>
            <input
              type="text"
              value={project.signatories.committeeMember2.name}
              onChange={(e) => handleSignatoryChange('committeeMember2', 'name', e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs font-medium"
            />
            <input
              type="text"
              value={project.signatories.committeeMember2.position}
              onChange={(e) => handleSignatoryChange('committeeMember2', 'position', e.target.value)}
              placeholder="ตำแหน่ง"
              className="w-full neu-input px-3 py-2 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
