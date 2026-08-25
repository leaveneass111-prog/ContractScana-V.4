import React, { useState } from 'react';
import {
  ContractProjectData,
  MilestoneItem,
  MaterialTestItem,
  MaterialApprovalItem,
} from '../../types';
import { resetPage7Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  Award,
  FlaskConical,
  FileCheck2,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface Page7MilestonesMaterialsProps {
  project: ContractProjectData;
  onChange: (updatedProject: ContractProjectData) => void;
}

const toThaiDigit = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return val.toString().replace(/[0-9]/g, (d) => thaiDigits[parseInt(d, 10)]);
};

const parseThaiOrArabicNumber = (str: string): number => {
  if (!str) return 0;
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  let normalized = str;
  thaiDigits.forEach((td, idx) => {
    normalized = normalized.split(td).join(idx.toString());
  });
  const cleaned = normalized.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const Page7MilestonesMaterials: React.FC<Page7MilestonesMaterialsProps> = ({
  project,
  onChange,
}) => {
  const [useThaiNumerals, setUseThaiNumerals] = useState<boolean>(true);

  // Milestone handlers
  const handleMilestoneChange = (index: number, field: keyof MilestoneItem, value: any) => {
    const updated = [...project.milestones];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...project, milestones: updated });
  };

  const handleAddMilestone = () => {
    const nextNo = project.milestones.length + 1;
    const thaiNo = toThaiDigit(nextNo);
    const newMs: MilestoneItem = {
      id: `ms-${Date.now()}`,
      installmentNo: nextNo,
      description: `งานงวดที่ ${useThaiNumerals ? thaiNo : nextNo}`,
      amount: 0,
      contractDueDate: '',
      actualFinishDate: '',
      inspectionDate: '',
      paymentStatus: 'pending',
      finishDateText: '',
      inspectionDateText: '',
      remarks: '-',
    };
    onChange({ ...project, milestones: [...project.milestones, newMs] });
  };

  const handleDeleteMilestone = (index: number) => {
    const updated = project.milestones
      .filter((_, i) => i !== index)
      .map((m, i) => ({ ...m, installmentNo: i + 1 }));
    onChange({ ...project, milestones: updated });
  };

  // Material Tests handlers
  const handleTestChange = (index: number, field: keyof MaterialTestItem, value: any) => {
    const updated = [...project.materialTests];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...project, materialTests: updated });
  };

  const handleAddTest = () => {
    const newTest: MaterialTestItem = {
      id: `mt-${Date.now()}`,
      item: '',
      sampleCount: '',
      testDate: '',
      testDateText: '',
      testingAuthority: 'โยธาธิการและผังเมือง',
      location: 'พื้นถนน',
      result: 'passed',
      resultText: 'ตามผลการทดสอบ',
      testCertNo: '',
      notes: '',
    };
    onChange({ ...project, materialTests: [...project.materialTests, newTest] });
  };

  const handleDeleteTest = (index: number) => {
    onChange({
      ...project,
      materialTests: project.materialTests.filter((_, i) => i !== index),
    });
  };

  // Material Approvals handlers
  const handleApprovalChange = (index: number, field: keyof MaterialApprovalItem, value: any) => {
    const updated = [...project.materialApprovals];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...project, materialApprovals: updated });
  };

  const handleAddApproval = () => {
    const newAppr: MaterialApprovalItem = {
      id: `ma-${Date.now()}`,
      item: '',
      requestDate: '',
      requestDateText: '',
      reviewer: 'นายกฯ',
      status: 'approved',
      decisionText: 'อนุมัติ',
      approvalDate: '',
      remarks: '',
    };
    onChange({ ...project, materialApprovals: [...project.materialApprovals, newAppr] });
  };

  const handleDeleteApproval = (index: number) => {
    onChange({
      ...project,
      materialApprovals: project.materialApprovals.filter((_, i) => i !== index),
    });
  };

  const handleClearPage7 = () => {
    onChange(resetPage7Data(project));
  };

  return (
    <div id="page-7-milestones-materials" className="space-y-8">
      {/* Page Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="neu-section-capsule">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
          <Award className="w-4 h-4 text-orange-500" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            งวดงาน การตรวจรับ และผลการทดสอบ/ขออนุมัติใช้วัสดุ
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <ClearPageButton pageNumber={7} onClear={handleClearPage7} />

          <button
            type="button"
            onClick={() => setUseThaiNumerals(!useThaiNumerals)}
            className="neu-button px-3.5 py-2 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-1.5 hover:border-orange-500/30"
            title="สลับการแสดงผลตัวเลขอารบิก / ตัวเลขไทย"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            {useThaiNumerals ? 'ใช้เลขอารบิก (1, 2, 3)' : 'ใช้เลขไทย (๑, ๒, ๓)'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ๓. รายละเอียดงวดงาน และการตรวจรับงาน */}
      {/* ========================================================= */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl space-y-4">
        {/* Section 3 Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="neu-pill-inset px-3.5 py-1.5 text-xs sm:text-sm font-bold text-orange-400 border border-orange-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>รายละเอียดงวดงาน และการตรวจรับงาน</span>
          </div>

          <button
            type="button"
            id="btn-add-milestone"
            onClick={handleAddMilestone}
            className="neu-button px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            + เพิ่มงวดงาน
          </button>
        </div>

        {/* Section 3 Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-white/[0.02] text-slate-300 font-bold text-center border-b border-white/[0.06]">
                <th className="py-3 px-2 w-20">
                  <div className="neu-pill-inset py-1 px-1">
                    งานงวดที่
                  </div>
                </th>
                <th className="py-3 px-3 w-40">
                  <div className="neu-pill-inset py-1 px-2 leading-tight text-orange-400">
                    จำนวนเงิน<br />(บาท)
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[150px]">
                  <div className="neu-pill-inset py-1 px-2 leading-tight">
                    วัน เดือน ปี<br />ที่แล้วเสร็จ
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[150px]">
                  <div className="neu-pill-inset py-1 px-2 leading-tight">
                    วัน เดือน ปี<br />ที่ตรวจรับ
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[140px]">
                  <div className="neu-pill-inset py-1 px-2">
                    หมายเหตุ
                  </div>
                </th>
                <th className="py-3 px-2 w-12 text-center">
                  ลบ
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {project.milestones.map((ms, idx) => {
                const thaiNo = toThaiDigit(ms.installmentNo);
                const amountVal = ms.amount || 0;

                return (
                  <tr
                    key={ms.id}
                    id={`row-milestone-${ms.id}`}
                    className="hover:bg-white/[0.02] transition-colors align-middle"
                  >
                    {/* 1. งานงวดที่ */}
                    <td className="p-2.5 text-center">
                      <div className="neu-pill-inset py-2 px-2 font-black text-xs text-orange-400 flex items-center justify-center">
                        {useThaiNumerals ? thaiNo : ms.installmentNo}
                      </div>
                    </td>

                    {/* 2. จำนวนเงิน (บาท) */}
                    <td className="p-2.5 text-center">
                      <div className="neu-pill-inset p-1 flex items-center justify-center border border-orange-500/30">
                        <input
                          type="text"
                          value={
                            useThaiNumerals
                              ? toThaiDigit(amountVal.toLocaleString())
                              : amountVal === 0
                              ? '0'
                              : amountVal.toLocaleString()
                          }
                          onChange={(e) =>
                            handleMilestoneChange(
                              idx,
                              'amount',
                              parseThaiOrArabicNumber(e.target.value)
                            )
                          }
                          placeholder="{{BUDGET}}"
                          className="w-full bg-transparent text-center text-xs font-black text-orange-400 outline-none py-1"
                        />
                      </div>
                    </td>

                    {/* 3. วัน เดือน ปี ที่แล้วเสร็จ (ผู้ใช้งานกรอกเอง) */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={ms.finishDateText ?? ms.actualFinishDate ?? ''}
                        onChange={(e) =>
                          handleMilestoneChange(idx, 'finishDateText', e.target.value)
                        }
                        placeholder="เช่น ๒๐ มิ.ย. ๒๕๖๗"
                        className="seamless-input px-3 py-2 text-xs text-center font-medium"
                      />
                    </td>

                    {/* 4. วัน เดือน ปี ที่ตรวจรับ (ผู้ใช้งานกรอกเอง) */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={ms.inspectionDateText ?? ms.inspectionDate ?? ''}
                        onChange={(e) =>
                          handleMilestoneChange(idx, 'inspectionDateText', e.target.value)
                        }
                        placeholder="เช่น ๒๕ มิ.ย. ๒๕๖๗"
                        className="seamless-input px-3 py-2 text-xs text-center font-medium"
                      />
                    </td>

                    {/* 5. หมายเหตุ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={ms.remarks ?? ''}
                        onChange={(e) => handleMilestoneChange(idx, 'remarks', e.target.value)}
                        placeholder="ระบุหมายเหตุ..."
                        className="seamless-input px-3 py-2 text-xs"
                      />
                    </td>

                    {/* 6. ลบ */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(idx)}
                        className="neu-button p-2 rounded-full text-rose-400 hover:text-rose-300 transition-colors"
                        title="ลบงวดงานนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ๔. ผลการทดสอบ/ขออนุมัติใช้วัสดุ */}
      {/* ========================================================= */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl space-y-6">
        {/* Section Header */}
        <div className="pb-3 border-b border-white/[0.06]">
          <div className="neu-pill-inset px-3.5 py-1.5 text-xs sm:text-sm font-bold text-orange-400 border border-orange-500/20 flex items-center gap-2 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>ผลการทดสอบ/ขออนุมัติใช้วัสดุ</span>
          </div>
        </div>

        {/* การทดสอบวัสดุ */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-orange-400" />
              การทดสอบวัสดุ
            </h4>

            <button
              type="button"
              id="btn-add-material-test"
              onClick={handleAddTest}
              className="neu-button px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              + เพิ่มรายการทดสอบ
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-white/[0.02] text-slate-300 font-bold text-center border-b border-white/[0.06]">
                  <th className="py-2.5 px-3 min-w-[240px]">
                    <div className="neu-pill-inset py-1 px-2">
                      รายการทดสอบวัสดุ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-32">
                    <div className="neu-pill-inset py-1 px-1 leading-tight">
                      จำนวน<br />ตัวอย่าง
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-28">
                    <div className="neu-pill-inset py-1 px-1 leading-tight">
                      วันที่<br />ทดสอบ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-36">
                    <div className="neu-pill-inset py-1 px-1 leading-tight">
                      หน่วยงานที่ทดสอบ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-28">
                    <div className="neu-pill-inset py-1 px-1 leading-tight">
                      ตำแหน่ง<br />ที่ทดสอบ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-32">
                    <div className="neu-pill-inset py-1 px-1 text-emerald-400">
                      ผลการทดสอบ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-12 text-center">
                    ลบ
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {project.materialTests.map((test, idx) => (
                  <tr
                    key={test.id}
                    id={`row-material-test-${test.id}`}
                    className="hover:bg-white/[0.02] transition-colors align-middle"
                  >
                    {/* 1. รายการทดสอบวัสดุ */}
                    <td className="p-2.5">
                      <textarea
                        rows={2}
                        value={test.item}
                        onChange={(e) => handleTestChange(idx, 'item', e.target.value)}
                        placeholder="เช่น รายงานผลการทดสอบวัสดุการทดสอบเหล็กเสริมคอนกรีต..."
                        className="seamless-input p-2 text-xs font-medium resize-none"
                      />
                    </td>

                    {/* 2. จำนวนตัวอย่าง */}
                    <td className="p-2.5">
                      <textarea
                        rows={2}
                        value={test.sampleCount ?? ''}
                        onChange={(e) => handleTestChange(idx, 'sampleCount', e.target.value)}
                        placeholder="เช่น RB19&#10;Wire Mesh"
                        className="seamless-input p-2 text-xs text-center resize-none"
                      />
                    </td>

                    {/* 3. วันที่ทดสอบ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={test.testDateText ?? test.testDate ?? ''}
                        onChange={(e) => handleTestChange(idx, 'testDateText', e.target.value)}
                        placeholder="เช่น ๑ ก.ค. ๖๗"
                        className="seamless-input px-2 py-2 text-xs text-center"
                      />
                    </td>

                    {/* 4. หน่วยงานที่ทดสอบ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={test.testingAuthority}
                        onChange={(e) => handleTestChange(idx, 'testingAuthority', e.target.value)}
                        placeholder="เช่น โยธาธิการและผังเมือง"
                        className="seamless-input px-2 py-2 text-xs text-center"
                      />
                    </td>

                    {/* 5. ตำแหน่งที่ทดสอบ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={test.location ?? ''}
                        onChange={(e) => handleTestChange(idx, 'location', e.target.value)}
                        placeholder="เช่น พื้นถนน"
                        className="seamless-input px-2 py-2 text-xs text-center"
                      />
                    </td>

                    {/* 6. ผลการทดสอบ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={test.resultText ?? 'ตามผลการทดสอบ'}
                        onChange={(e) => handleTestChange(idx, 'resultText', e.target.value)}
                        placeholder="เช่น ตามผลการทดสอบ"
                        className="seamless-input px-2 py-2 text-xs text-center font-bold text-emerald-400"
                      />
                    </td>

                    {/* 7. ลบ */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteTest(idx)}
                        className="neu-button p-2 rounded-full text-rose-400 hover:text-rose-300 transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* การขออนุมัติใช้วัสดุ */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-orange-400" />
              การขออนุมัติใช้วัสดุ
            </h4>

            <button
              type="button"
              id="btn-add-material-approval"
              onClick={handleAddApproval}
              className="neu-button px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              + เพิ่มการขออนุมัติ
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-white/[0.02] text-slate-300 font-bold text-center border-b border-white/[0.06]">
                  <th className="py-2.5 px-3 min-w-[280px]">
                    <div className="neu-pill-inset py-1 px-2">
                      รายการที่ขออนุมัติ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-36">
                    <div className="neu-pill-inset py-1 px-1 leading-tight">
                      วันที่ขออนุมัติ
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-36">
                    <div className="neu-pill-inset py-1 px-1">
                      ผู้พิจารณา
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-32">
                    <div className="neu-pill-inset py-1 px-1 text-emerald-400">
                      ผลการพิจารณา
                    </div>
                  </th>
                  <th className="py-2.5 px-2 w-12 text-center">
                    ลบ
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {project.materialApprovals.map((appr, idx) => (
                  <tr
                    key={appr.id}
                    id={`row-material-approval-${appr.id}`}
                    className="hover:bg-white/[0.02] transition-colors align-middle"
                  >
                    {/* 1. รายการที่ขออนุมัติ */}
                    <td className="p-2.5">
                      <textarea
                        rows={2}
                        value={appr.item}
                        onChange={(e) => handleApprovalChange(idx, 'item', e.target.value)}
                        placeholder="เช่น ขออนุมัติใช้เหล็กเสริมคอนกรีต..."
                        className="seamless-input p-2 text-xs font-medium resize-none"
                      />
                    </td>

                    {/* 2. วันที่ขออนุมัติ */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={appr.requestDateText ?? appr.requestDate ?? ''}
                        onChange={(e) => handleApprovalChange(idx, 'requestDateText', e.target.value)}
                        placeholder="เช่น ๑๖ ก.ค. ๖๔"
                        className="seamless-input px-2 py-2 text-xs text-center"
                      />
                    </td>

                    {/* 3. ผู้พิจารณา */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={appr.reviewer}
                        onChange={(e) => handleApprovalChange(idx, 'reviewer', e.target.value)}
                        placeholder="เช่น นายกฯ"
                        className="seamless-input px-2 py-2 text-xs text-center"
                      />
                    </td>

                    {/* 4. ผลการพิจารณา */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={appr.decisionText ?? 'อนุมัติ'}
                        onChange={(e) => handleApprovalChange(idx, 'decisionText', e.target.value)}
                        placeholder="เช่น อนุมัติ"
                        className="seamless-input px-2 py-2 text-xs text-center font-bold text-emerald-400"
                      />
                    </td>

                    {/* 5. ลบ */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteApproval(idx)}
                        className="neu-button p-2 rounded-full text-rose-400 hover:text-rose-300 transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
