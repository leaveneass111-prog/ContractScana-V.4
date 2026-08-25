import React from 'react';
import { ContractProjectData } from '../../types';
import { calculateProjectSummary, formatCurrency } from '../../utils/calculations';
import { resetPage8Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  LayoutDashboard,
  TrendingUp,
  Coins,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Page8ObstaclesSummaryProps {
  project: ContractProjectData;
  onChange: (updatedProject: ContractProjectData) => void;
  onOpenPreview: () => void;
}

export const Page8ObstaclesSummary: React.FC<Page8ObstaclesSummaryProps> = ({
  project,
  onChange,
  onOpenPreview,
}) => {
  const summary = calculateProjectSummary(project);

  const handleTriggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleClearPage8 = () => {
    onChange(resetPage8Data(project));
  };

  return (
    <div id="page-8-obstacles-summary" className="space-y-6">
      {/* Page Header with Inset Pill Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="neu-section-capsule">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
          <LayoutDashboard className="w-4 h-4 text-orange-500" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            สรุปผลโครงการ (Executive Dashboard)
          </h2>
        </div>

        <ClearPageButton pageNumber={8} onClear={handleClearPage8} />
      </div>

      {/* EXECUTIVE DASHBOARD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="neu-pill-inset px-3.5 py-1.5 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>สรุปผลการดำเนินงานถึงปัจจุบัน</span>
          </div>

          <button
            type="button"
            onClick={handleTriggerCelebrate}
            className="neu-button px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            ตรวจทานครบถ้วน
          </button>
        </div>

        {/* 4 Main Summary Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Actual Progress */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ผลงานรวมสะสมจริง (Actual)
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-2xl sm:text-3xl font-black text-orange-400 border border-orange-500/30">
              {summary.currentActualProgress.toFixed(2)}%
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full neu-inset p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                style={{ width: `${Math.min(100, summary.currentActualProgress)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Planned Progress */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ผลงานตามแผนงาน (Planned)
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-2xl sm:text-3xl font-black text-slate-100">
              {summary.plannedProgress.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-400">
              ความก้าวหน้าตามกรอบเวลาสัญญา
            </div>
          </div>

          {/* Card 3: Status Variance (+/-) */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              สถานะเปรียบเทียบ (Variance)
            </span>
            <div>
              <div
                className={`neu-pill-inset px-3 py-1.5 inline-block text-2xl sm:text-3xl font-black ${
                  summary.isAhead
                    ? 'text-emerald-400 border-emerald-500/30'
                    : 'text-rose-400 border-rose-500/30'
                }`}
              >
                {summary.variance >= 0 ? `+${summary.variance}%` : `${summary.variance}%`}
              </div>
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                summary.isAhead
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {summary.isAhead ? '✓ เร็วกว่าแผนงาน' : '⚠ ช้ากว่าแผนงาน'}
            </span>
          </div>

          {/* Card 4: Remaining Days & Value */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ระยะเวลาก่อสร้างคงเหลือ
            </span>
            <div className="neu-pill-inset px-3 py-1.5 inline-block text-2xl sm:text-3xl font-black text-slate-100">
              {summary.remainingDays} <span className="text-xs font-semibold text-slate-400">วัน</span>
            </div>
            <div className="text-xs text-slate-400">
              (ผ่านไปแล้ว {summary.elapsedDays} วัน จาก {summary.totalDays} วัน)
            </div>
          </div>
        </div>

        {/* Financial Metrics Row */}
        <div className="neu-flat p-6 rounded-3xl space-y-4">
          <div className="neu-pill-inset px-3.5 py-1.5 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-2 inline-flex">
            <Coins className="w-4 h-4 text-orange-400" />
            <span>สรุปมูลค่าการดำเนินงานและการเบิกจ่าย</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="neu-flat-sm p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block">มูลค่างานก่อสร้างตามสัญญา:</span>
              <div className="text-base font-black text-slate-100 mt-1">
                ฿{formatCurrency(project.contractAmount)}
              </div>
            </div>

            <div className="neu-flat-sm p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block">มูลค่างานที่แล้วเสร็จจริงรวม:</span>
              <div className="text-base font-black text-orange-400 mt-1">
                ฿{formatCurrency(summary.completedValue)}
              </div>
            </div>

            <div className="neu-flat-sm p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block">มูลค่าเบิกจ่ายเงินแล้ว:</span>
              <div className="text-base font-black text-emerald-400 mt-1">
                ฿{formatCurrency(project.disbursedAmount)} ({summary.disbursedPct}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Official Document Preview Action */}
      <div className="neu-flat p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            เอกสารครบถ้วนพร้อมจัดทำรายงานทางการ
          </h4>
          <p className="text-xs text-slate-400">
            ระบบจัดรูปแบบเอกสารบันทึกข้อความราชการ หน้า 1 ถึง 8 พร้อมตราครุฑและตารางคำนวณอัตโนมัติ
          </p>
        </div>

        <button
          type="button"
          id="btn-preview-official-doc"
          onClick={onOpenPreview}
          className="w-full sm:w-auto neu-button px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center gap-2 hover:bg-orange-500/20 active:scale-95 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          เปิดดูตัวอย่างเอกสารทางการ (Official Preview)
        </button>
      </div>
    </div>
  );
};
