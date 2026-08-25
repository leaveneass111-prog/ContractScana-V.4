import React, { useState, useMemo } from 'react';
import { ContractProjectData, MonthlyProgressEntry } from '../../types';
import { resetPage6Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  CalendarRange,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface Page6MonthlyProgressLogProps {
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

// ฟังก์ชันคำนวณเชื่อมโยงอัตโนมัติทุกแถวประจำเดือน
const recalculateAllMonthlyLogs = (logs: MonthlyProgressEntry[]): MonthlyProgressEntry[] => {
  let runningCumulative = 0;
  return logs.map((log) => {
    const weight = Number(log.weightPct ?? log.plannedPct) || 0;
    const prev = parseFloat(runningCumulative.toFixed(2));
    const inMonth = weight; // ในเดือน = สัดส่วนของงาน%
    const acc = parseFloat((prev + inMonth).toFixed(2)); // สะสม = ถึงเดือนก่อน + ในเดือน
    runningCumulative = acc;

    return {
      ...log,
      weightPct: weight,
      prevMonthPct: prev,
      inMonthPct: inMonth,
      accumulatedPct: acc,
      totalWorkPct: acc, // ผลงานรวม% = สะสม
      plannedPct: weight,
      actualPct: inMonth,
      cumulativePct: acc,
    };
  });
};

export const Page6MonthlyProgressLog: React.FC<Page6MonthlyProgressLogProps> = ({
  project,
  onChange,
}) => {
  const [useThaiNumerals, setUseThaiNumerals] = useState<boolean>(true);

  // เตรียมข้อมูล logs โดยเชื่อมโยงการคำนวณอัตโนมัติ
  const rawLogs: MonthlyProgressEntry[] = useMemo(() => {
    if (project.monthlyProgressLogs && project.monthlyProgressLogs.length > 0) {
      return project.monthlyProgressLogs;
    }
    return [
      {
        id: 'mpl-1',
        monthName: 'เดือนที่ ๑',
        activitiesText: '',
        weightPct: 0,
        prevMonthPct: 0,
        inMonthPct: 0,
        accumulatedPct: 0,
        totalWorkPct: 0,
        plannedPct: 0,
        actualPct: 0,
        cumulativePct: 0,
        keyActivities: '',
        approvalStatus: 'รอดำเนินการ',
      },
    ];
  }, [project.monthlyProgressLogs]);

  const currentLogs = useMemo(() => recalculateAllMonthlyLogs(rawLogs), [rawLogs]);

  const syncState = (updatedLogs: MonthlyProgressEntry[]) => {
    const recalculated = recalculateAllMonthlyLogs(updatedLogs);
    onChange({
      ...project,
      monthlyProgressLogs: recalculated,
    });
  };

  const handleEntryChange = (index: number, field: keyof MonthlyProgressEntry, value: any) => {
    const updated = [...currentLogs];
    const item = { ...updated[index], [field]: value };

    if (field === 'activitiesText') {
      item.keyActivities = value;
    }

    updated[index] = item;
    syncState(updated);
  };

  const handleAddMonth = () => {
    const nextIndex = currentLogs.length + 1;
    const thaiIdx = toThaiDigit(nextIndex);

    const newEntry: MonthlyProgressEntry = {
      id: `mpl-${Date.now()}`,
      monthName: `เดือนที่ ${useThaiNumerals ? thaiIdx : nextIndex}`,
      activitiesText: '',
      weightPct: 0,
      prevMonthPct: 0,
      inMonthPct: 0,
      accumulatedPct: 0,
      totalWorkPct: 0,
      plannedPct: 0,
      actualPct: 0,
      cumulativePct: 0,
      keyActivities: '',
      approvalStatus: 'รอดำเนินการ',
    };

    syncState([...currentLogs, newEntry]);
  };

  const handleDeleteMonth = (index: number) => {
    if (currentLogs.length <= 1) {
      const resetEntry: MonthlyProgressEntry = {
        id: `mpl-${Date.now()}`,
        monthName: `เดือนที่ ${useThaiNumerals ? '๑' : '1'}`,
        activitiesText: '',
        weightPct: 0,
        prevMonthPct: 0,
        inMonthPct: 0,
        accumulatedPct: 0,
        totalWorkPct: 0,
        plannedPct: 0,
        actualPct: 0,
        cumulativePct: 0,
        keyActivities: '',
        approvalStatus: 'รอดำเนินการ',
      };
      syncState([resetEntry]);
      return;
    }
    const updated = currentLogs.filter((_, i) => i !== index);
    syncState(updated);
  };

  const handleClearPage6 = () => {
    onChange(resetPage6Data(project));
  };

  const formatNum = (val: number | undefined | null) => {
    if (val === undefined || val === null) return '-';
    if (val === 0) {
      return useThaiNumerals ? '๐' : '0';
    }
    const strVal = Number.isInteger(val) ? String(val) : String(Number(val.toFixed(2)));
    return useThaiNumerals ? toThaiDigit(strVal) : strVal;
  };

  // รวมผลรวมท้ายตาราง
  const totalWeight = currentLogs.reduce(
    (sum, item) => sum + (Number(item.weightPct ?? item.plannedPct) || 0),
    0
  );

  const lastEntry = currentLogs[currentLogs.length - 1];
  const grandTotalWork = lastEntry
    ? Number(lastEntry.totalWorkPct ?? lastEntry.accumulatedPct ?? lastEntry.cumulativePct ?? 0)
    : 0;

  return (
    <div id="page-6-monthly-progress-log" className="space-y-6">
      {/* ส่วนควบคุมด้านบน */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
              ผลการดำเนินงานประจำเดือน
            </h2>
            <p className="text-xs text-gray-400">
              กรอกเฉพาะช่อง &ldquo;สัดส่วนของงาน%&rdquo; ระบบจะคำนวณผลงานในเดือน สะสม และผลงานรวมให้อัตโนมัติ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ClearPageButton pageNumber={6} onClear={handleClearPage6} />

          <button
            type="button"
            onClick={() => setUseThaiNumerals(!useThaiNumerals)}
            className="neu-pressed px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-white/5 hover:border-orange-500/30 transition-all"
            title="สลับการแสดงผลตัวเลขอารบิก / ตัวเลขไทย"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            {useThaiNumerals ? 'ใช้เลขอารบิก (1, 2, 3)' : 'ใช้เลขไทย (๑, ๒, ๓)'}
          </button>

          <button
            type="button"
            id="btn-add-monthly-log"
            onClick={handleAddMonth}
            className="neu-pressed px-4 py-2 rounded-xl text-xs font-bold text-orange-400 border border-orange-500/30 bg-orange-500/10 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            + เพิ่มเดือนในตาราง
          </button>
        </div>
      </div>

      {/* บล็อกตารางสไตล์ Neumorphic Dark Mode */}
      <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[850px]">
            {/* หัวตาราง */}
            <div className="flex text-xs font-bold text-gray-400 text-center gap-2 mb-2 items-end select-none">
              <div className="w-12 py-2.5 neu-pressed rounded-xl border border-white/5 flex-shrink-0">
                ที่
              </div>
              <div className="flex-1 py-2.5 neu-pressed rounded-xl border border-white/5">
                งานที่ดำเนินการ
              </div>
              <div className="w-24 py-2 neu-pressed rounded-xl border border-orange-500/30 bg-orange-500/5 flex-shrink-0 leading-tight text-orange-400 font-bold">
                สัดส่วนของ<br />งาน% (กรอก)
              </div>
              <div className="flex flex-col w-64 gap-1 flex-shrink-0">
                <div className="py-1 neu-pressed rounded-xl border border-white/5 text-[11px] text-gray-400">
                  ผลงาน% (คำนวณอัตโนมัติ)
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 py-2 neu-pressed rounded-xl border border-white/5 leading-tight text-gray-400">
                    ถึงเดือน<br />ก่อน
                  </div>
                  <div className="flex-1 py-2 neu-pressed rounded-xl border border-orange-500/30 bg-orange-500/10 leading-tight text-orange-400 font-bold">
                    ในเดือน
                  </div>
                  <div className="flex-1 py-2 neu-pressed rounded-xl border border-white/5 leading-tight text-slate-300 font-semibold">
                    สะสม
                  </div>
                </div>
              </div>
              <div className="w-24 py-2 neu-pressed rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex-shrink-0 leading-tight text-emerald-400 font-bold">
                ผลงานรวม<br />% (สะสม)
              </div>
              <div className="w-10 py-2.5 neu-pressed rounded-xl border border-white/5 flex-shrink-0">
                ลบ
              </div>
            </div>

            {/* แถวรายการแต่ละเดือน */}
            <div className="space-y-2">
              {currentLogs.map((item, idx) => {
                const thaiIndex = toThaiDigit(idx + 1);
                const weightVal = item.weightPct ?? item.plannedPct ?? 0;
                const prevVal = item.prevMonthPct ?? 0;
                const inMonthVal = item.inMonthPct ?? item.actualPct ?? 0;
                const accVal = item.accumulatedPct ?? item.cumulativePct ?? (prevVal + inMonthVal);
                const totalWorkVal = item.totalWorkPct ?? accVal;
                const activities = item.activitiesText ?? item.keyActivities ?? '';

                return (
                  <div key={item.id || idx} className="flex gap-2 items-start text-sm">
                    {/* 1. ลำดับที่ (ล็อกความสูง h-11 เสมอ) */}
                    <div className="w-12 h-11 flex items-center justify-center text-orange-400 font-bold flex-shrink-0 neu-pressed rounded-xl border border-white/5 select-none">
                      {useThaiNumerals ? thaiIndex : idx + 1}
                    </div>

                    {/* 2. งานที่ดำเนินการ: กล่องแบบ 2 ชั้น (หัวข้อ + รายละเอียด) */}
                    <div className="flex-1 neu-pressed border border-white/5 rounded-xl p-2.5 space-y-2">
                      <input
                        type="text"
                        value={item.monthName || ''}
                        onChange={(e) => handleEntryChange(idx, 'monthName', e.target.value)}
                        placeholder="เช่น มิถุนายน พ.ศ. ๒๕๖๗"
                        className="w-full bg-transparent text-xs font-bold text-orange-400 outline-none placeholder:text-gray-600"
                      />
                      <textarea
                        rows={Math.max(2, activities.split('\n').length)}
                        value={activities}
                        onChange={(e) => handleEntryChange(idx, 'activitiesText', e.target.value)}
                        placeholder="ระบุรายละเอียดงานที่ดำเนินการ..."
                        className="w-full bg-transparent text-xs text-gray-300 outline-none resize-y min-h-[48px] leading-relaxed placeholder:text-gray-600"
                      />
                    </div>

                    {/* 3. สัดส่วนของงาน % (ช่องเดียวที่ผู้ใช้กรอกตัวเลข) */}
                    <div className="w-24 h-11 flex-shrink-0">
                      <input
                        type="text"
                        value={useThaiNumerals ? (weightVal === 0 ? '' : toThaiDigit(weightVal)) : (weightVal === 0 ? '' : weightVal)}
                        onChange={(e) => handleEntryChange(idx, 'weightPct', parseThaiOrArabicNumber(e.target.value))}
                        placeholder={useThaiNumerals ? '๐' : '0'}
                        className="w-full h-full text-center neu-pressed border border-orange-500/30 bg-orange-500/5 focus:border-orange-500 rounded-xl px-1 text-white font-bold outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* 4-6. กลุ่มผลงาน 3 ช่อง (แสดงผลลัพธ์อัตโนมัติ) */}
                    <div className="w-64 h-11 flex gap-1 flex-shrink-0 select-none">
                      {/* ถึงเดือนก่อน (ดึงสะสมจากแถวก่อนหน้า) */}
                      <div
                        className="flex-1 h-full flex items-center justify-center text-xs text-slate-400 font-semibold neu-pressed border border-white/5 rounded-xl px-1"
                        title="ผลงานสะสมถึงเดือนก่อนหน้า"
                      >
                        {formatNum(prevVal)}
                      </div>

                      {/* ในเดือน (= สัดส่วนของงาน%) */}
                      <div
                        className="flex-1 h-full flex items-center justify-center text-xs text-orange-400 font-bold neu-pressed border border-orange-500/30 bg-orange-500/10 rounded-xl px-1"
                        title="ผลงานในเดือน (เท่ากับสัดส่วนของงาน%)"
                      >
                        {formatNum(inMonthVal)}
                      </div>

                      {/* สะสม (= ถึงเดือนก่อน + ในเดือน) */}
                      <div
                        className="flex-1 h-full flex items-center justify-center text-xs text-slate-200 font-semibold neu-pressed border border-white/5 rounded-xl px-1"
                        title="ผลงานสะสม (ถึงเดือนก่อน + ในเดือน)"
                      >
                        {formatNum(accVal)}
                      </div>
                    </div>

                    {/* 7. ผลงานรวม % (สะสมรวม) */}
                    <div
                      className="w-24 h-11 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold neu-pressed border border-emerald-500/20 bg-emerald-500/5 rounded-xl px-1 select-none"
                      title="ผลงานสะสมรวมทั้งหมด"
                    >
                      {formatNum(totalWorkVal)}
                    </div>

                    {/* 8. ปุ่มลบ */}
                    <div className="w-10 h-11 flex flex-shrink-0 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteMonth(idx)}
                        className="w-8 h-8 rounded-xl neu-pressed flex items-center justify-center text-rose-400/70 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 transition-colors"
                        title="ลบแถว"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* แถวสรุปผลรวมท้ายตาราง */}
            <div className="flex gap-2 items-center text-sm font-bold pt-4 pb-2 select-none">
              <div className="w-12 flex-shrink-0"></div>
              <div className="flex-1 text-right text-gray-400 pr-4">รวม</div>
              <div className="w-24 h-11 flex items-center justify-center text-white neu-pressed border border-orange-500/30 bg-orange-500/10 rounded-xl flex-shrink-0">
                {formatNum(totalWeight)}
              </div>
              <div className="w-64 flex-shrink-0"></div>
              <div className="w-24 h-11 flex items-center justify-center text-emerald-400 neu-pressed border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex-shrink-0">
                {formatNum(grandTotalWork)}
              </div>
              <div className="w-10 flex-shrink-0"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
