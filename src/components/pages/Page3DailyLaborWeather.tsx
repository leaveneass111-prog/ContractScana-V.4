import React from 'react';
import { ContractProjectData, LaborMatrixRow, WeatherCondition, WeatherDay } from '../../types';
import { calculateLaborMatrixTotals } from '../../utils/calculations';
import { resetPage3Data } from '../../utils/pageResetHelpers';
import { ClearPageButton } from '../ClearPageButton';
import {
  Calendar,
  Users,
  Plus,
  Trash2,
  Sun,
  Cloud,
  CloudRain,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

interface Page3DailyLaborWeatherProps {
  project: ContractProjectData;
  onChange: (updatedProject: ContractProjectData) => void;
}

// 3 Weather conditions only: แจ่มใส, ครื้มฝน, ฝนตก
export const WEATHER_CONFIG: Record<
  string,
  {
    key: WeatherCondition;
    label: string;
    icon: React.ElementType;
    badgeStyle: string;
  }
> = {
  sunny: {
    key: 'sunny',
    label: 'แจ่มใส',
    icon: Sun,
    badgeStyle:
      'text-orange-400 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20',
  },
  overcast: {
    key: 'overcast',
    label: 'ครื้มฝน',
    icon: Cloud,
    badgeStyle:
      'text-sky-400 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20',
  },
  rain: {
    key: 'rain',
    label: 'ฝนตก',
    icon: CloudRain,
    badgeStyle:
      'text-blue-400 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20',
  },
};

// Cycle function: sunny -> overcast -> rain -> sunny
const getNextWeather = (current: WeatherCondition): WeatherCondition => {
  if (current === 'sunny') return 'overcast';
  if (current === 'overcast') return 'rain';
  return 'sunny';
};

export const Page3DailyLaborWeather: React.FC<Page3DailyLaborWeatherProps> = ({
  project,
  onChange,
}) => {
  // Daily log changes
  const handleWorkDescriptionChange = (index: number, desc: string) => {
    const updated = [...project.dailyLogs];
    updated[index] = { ...updated[index], workDescription: desc };
    onChange({ ...project, dailyLogs: updated });
  };

  const handleDateChange = (index: number, dateStr: string) => {
    const updated = [...project.dailyLogs];
    updated[index] = { ...updated[index], dateStr };
    onChange({ ...project, dailyLogs: updated });
  };

  // Click-to-cycle weather handler
  const handleToggleWeather = (
    index: number,
    period: 'morning' | 'afternoon'
  ) => {
    const current = project.dailyLogs[index][period] || 'sunny';
    const nextCondition = getNextWeather(current);
    const updated = [...project.dailyLogs];
    updated[index] = { ...updated[index], [period]: nextCondition };
    onChange({ ...project, dailyLogs: updated });
  };

  const handleAddDailyLog = () => {
    const nextDayNum = project.dailyLogs.length + 1;
    const newDay: WeatherDay = {
      dayNumber: nextDayNum,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: 'ไม่ปฏิบัติงาน',
    };
    onChange({
      ...project,
      dailyLogs: [...project.dailyLogs, newDay],
    });
  };

  const handleDeleteDailyLog = (index: number) => {
    if (project.dailyLogs.length <= 1) return;
    const updated = project.dailyLogs
      .filter((_, i) => i !== index)
      .map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onChange({ ...project, dailyLogs: updated });
  };

  // Labor Matrix changes
  const handleMatrixCountChange = (
    rowIndex: number,
    dayIndex: number,
    valStr: string
  ) => {
    const nextMatrix = [...project.laborMatrix];
    const targetRow = { ...nextMatrix[rowIndex] };
    const nextCounts = [...targetRow.counts] as [
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ];
    const num =
      valStr === '' || valStr === '-'
        ? 0
        : Math.max(0, parseInt(valStr, 10) || 0);
    nextCounts[dayIndex] = num;
    targetRow.counts = nextCounts;
    nextMatrix[rowIndex] = targetRow;

    onChange({
      ...project,
      laborMatrix: nextMatrix,
    });
  };

  const handleMatrixNameChange = (rowIndex: number, newName: string) => {
    const nextMatrix = [...project.laborMatrix];
    nextMatrix[rowIndex] = { ...nextMatrix[rowIndex], name: newName };
    onChange({
      ...project,
      laborMatrix: nextMatrix,
    });
  };

  const handleAddLaborRow = () => {
    const nextRow: LaborMatrixRow = {
      id: `labor-${Date.now()}`,
      category: 'labor',
      name: 'แรงงานทั่วไป/ช่าง',
      unit: 'คน',
      counts: [0, 0, 0, 0, 0, 0, 0],
    };
    onChange({
      ...project,
      laborMatrix: [...project.laborMatrix, nextRow],
    });
  };

  const handleDeleteMatrixRow = (rowIndex: number) => {
    if (project.laborMatrix.length <= 1) return;
    const nextMatrix = project.laborMatrix.filter((_, i) => i !== rowIndex);
    onChange({
      ...project,
      laborMatrix: nextMatrix,
    });
  };

  const handleClearAllLabor = () => {
    const cleared = project.laborMatrix.map((row) => ({
      ...row,
      counts: [0, 0, 0, 0, 0, 0, 0] as [
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ],
    }));
    onChange({
      ...project,
      laborMatrix: cleared,
    });
  };

  const laborTotals = calculateLaborMatrixTotals(project.laborMatrix);

  const handleClearPage3 = () => {
    onChange(resetPage3Data(project));
  };

  return (
    <div id="page-3-daily-labor-weather" className="space-y-8">
      {/* ========================================================= */}
      {/* การ์ดบน: บันทึกรายวัน (รายละเอียด & สภาพอากาศ) */}
      {/* ========================================================= */}
      <div className="neu-flat p-6 rounded-3xl space-y-5" id="card-daily-log">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="neu-section-capsule">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <Calendar className="w-4 h-4 text-orange-500" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
              บันทึกรายวัน (รายละเอียด & สภาพอากาศ)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <ClearPageButton pageNumber={3} onClear={handleClearPage3} />
            <button
              id="btn-add-daily-log"
              type="button"
              onClick={handleAddDailyLog}
              className="neu-button px-4 py-2 rounded-full text-xs font-bold text-orange-400 border border-orange-500/30 bg-orange-500/10 flex items-center gap-1.5 active:scale-95 hover:bg-orange-500/20"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              + เพิ่มบันทึกรายวัน
            </button>
          </div>
        </div>

        {/* หัวคอลัมน์ Inset Pill Capsules */}
        <div className="hidden lg:grid grid-cols-12 gap-2.5 text-xs font-bold text-slate-400">
          <div className="col-span-2 neu-pill-inset py-2 px-3 flex items-center justify-center text-center">
            <span>วัน/เดือน/ปี</span>
          </div>
          <div className="col-span-5 neu-pill-inset py-2 px-3 flex items-center justify-center text-center">
            <span>รายละเอียดการดำเนินงาน</span>
          </div>
          <div className="col-span-2 neu-pill-inset py-2 px-3 flex items-center justify-center text-center">
            <span>สภาพอากาศ (เช้า)</span>
          </div>
          <div className="col-span-2 neu-pill-inset py-2 px-3 flex items-center justify-center text-center">
            <span>สภาพอากาศ (บ่าย)</span>
          </div>
          <div className="col-span-1 neu-pill-inset py-2 px-1 flex items-center justify-center text-center">
            <span>ลบ</span>
          </div>
        </div>

        {/* รายการ 7 วัน (Day 1 ถึง Day 7) ด้วย Seamless Input Rows & Selective Inset */}
        <div className="space-y-2.5">
          {project.dailyLogs.map((day, idx) => {
            const morningConfig =
              WEATHER_CONFIG[day.morning] || WEATHER_CONFIG.sunny;
            const afternoonConfig =
              WEATHER_CONFIG[day.afternoon] || WEATHER_CONFIG.sunny;
            const MorningIcon = morningConfig.icon;
            const AfternoonIcon = afternoonConfig.icon;

            return (
              <div
                key={`daily-day-${day.dayNumber}-${idx}`}
                id={`daily-row-d${day.dayNumber}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center p-3 rounded-2xl neu-flat hover:border-white/[0.09] transition-all"
              >
                {/* วันที่: Selective Inset Pill {{D1}} ถึง {{D7}} */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="lg:hidden text-xs font-bold text-slate-400">
                    วัน/เดือน/ปี:
                  </div>
                  <div className="neu-pill-inset px-3 py-1.5 flex items-center justify-between gap-2 border border-orange-500/20">
                    <span className="font-bold text-orange-400 text-xs shrink-0">
                      {`{{D${day.dayNumber}}}`}
                    </span>
                    <input
                      type="text"
                      value={day.dateStr}
                      onChange={(e) => handleDateChange(idx, e.target.value)}
                      placeholder={`วัน ${day.dayNumber}`}
                      className="w-full bg-transparent text-xs text-right text-slate-300 font-medium outline-none"
                    />
                  </div>
                </div>

                {/* รายละเอียด: Seamless Input Row */}
                <div className="lg:col-span-5 space-y-1">
                  <div className="lg:hidden text-xs font-bold text-slate-400">
                    รายละเอียดการดำเนินงาน:
                  </div>
                  <input
                    type="text"
                    value={day.workDescription}
                    onChange={(e) =>
                      handleWorkDescriptionChange(idx, e.target.value)
                    }
                    placeholder="ไม่ปฏิบัติงาน"
                    className="seamless-input text-xs text-slate-200 placeholder:text-slate-500 font-medium"
                  />
                </div>

                {/* สภาพอากาศ (เช้า): ปุ่มคลิกเปลี่ยน (แจ่มใส -> ครื้มฝน -> ฝนตก) */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="lg:hidden text-xs font-bold text-slate-400">
                    สภาพอากาศ (เช้า):
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleWeather(idx, 'morning')}
                    title="คลิกเพื่อเปลี่ยนสภาพอากาศ (แจ่มใส → ครื้มฝน → ฝนตก)"
                    className={`w-full neu-button py-2 px-3 rounded-full text-xs font-bold flex items-center justify-between gap-1.5 active:scale-95 transition-all ${morningConfig.badgeStyle}`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <MorningIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{morningConfig.label}</span>
                    </div>
                    <RefreshCw className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                </div>

                {/* สภาพอากาศ (บ่าย): ปุ่มคลิกเปลี่ยน (แจ่มใส -> ครื้มฝน -> ฝนตก) */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="lg:hidden text-xs font-bold text-slate-400">
                    สภาพอากาศ (บ่าย):
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleWeather(idx, 'afternoon')}
                    title="คลิกเพื่อเปลี่ยนสภาพอากาศ (แจ่มใส → ครื้มฝน → ฝนตก)"
                    className={`w-full neu-button py-2 px-3 rounded-full text-xs font-bold flex items-center justify-between gap-1.5 active:scale-95 transition-all ${afternoonConfig.badgeStyle}`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <AfternoonIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{afternoonConfig.label}</span>
                    </div>
                    <RefreshCw className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                </div>

                {/* ท้ายแถว: ปุ่มถังขยะ */}
                <div className="lg:col-span-1 flex items-center justify-end lg:justify-center pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteDailyLog(idx)}
                    className="neu-button p-2 rounded-full text-rose-400 hover:text-rose-300 active:scale-95"
                    title="ลบแถวบันทึกวัน"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* การ์ดล่าง: บัญชีแสดงจำนวนแรงงาน */}
      {/* ========================================================= */}
      <div className="neu-flat p-6 rounded-3xl space-y-5" id="card-labor-matrix">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="neu-section-capsule">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <Users className="w-4 h-4 text-orange-500" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
              บัญชีแสดงจำนวนแรงงาน
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-clear-all-labor"
              type="button"
              onClick={handleClearAllLabor}
              className="neu-button px-3.5 py-2 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5 active:scale-95 hover:bg-rose-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              ล้างข้อมูลแรงงาน
            </button>

            <button
              id="btn-add-labor-row"
              type="button"
              onClick={handleAddLaborRow}
              className="neu-button px-4 py-2 rounded-full text-xs font-bold text-orange-400 border border-orange-500/30 bg-orange-500/10 flex items-center gap-1.5 active:scale-95 hover:bg-orange-500/20"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              + เพิ่มรายการแรงงาน
            </button>
          </div>
        </div>

        {/* แถบหัวตารางตัวแปรวัน */}
        <div className="hidden lg:grid grid-cols-12 gap-2 text-xs font-bold text-slate-400">
          <div className="col-span-4 neu-pill-inset py-2 px-4 flex items-center justify-center text-center">
            <span className="text-orange-400 font-extrabold">
              ประเภทแรงงาน
            </span>
          </div>

          {[1, 2, 3, 4, 5, 6, 7].map((sdNum) => (
            <div
              key={`sd-capsule-head-${sdNum}`}
              className="col-span-1 neu-pill-inset py-2 px-1 flex items-center justify-center text-center"
            >
              <span className="font-bold text-orange-400 text-[11px]">
                {`{{SD${sdNum}}}`}
              </span>
            </div>
          ))}

          <div className="col-span-1 neu-pill-inset py-2 px-1 flex items-center justify-center text-center">
            <span>ลบ</span>
          </div>
        </div>

        {/* รายการแถวแรงงาน */}
        <div className="space-y-2.5">
          {project.laborMatrix.map((row, rIdx) => {
            return (
              <div
                key={row.id}
                id={`labor-matrix-row-${row.id}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center p-3 rounded-2xl neu-flat hover:border-white/[0.09] transition-all"
              >
                {/* ชื่อประเภทแรงงาน: Seamless input */}
                <div className="lg:col-span-4 space-y-1">
                  <div className="lg:hidden text-xs font-bold text-slate-400">
                    ประเภทแรงงาน:
                  </div>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleMatrixNameChange(rIdx, e.target.value)
                    }
                    placeholder="หัวหน้าคนงาน/ช่าง หรือ กรรมกร"
                    className="seamless-input text-xs text-slate-200 font-bold"
                  />
                </div>

                {/* ช่องตัวเลข 7 วัน: Selective Inset เมื่อมีค่า */}
                <div className="lg:col-span-7 grid grid-cols-7 gap-1.5">
                  {row.counts.map((val, dIdx) => (
                    <div
                      key={`row-${row.id}-day-${dIdx}`}
                      className={`p-1 rounded-xl text-center flex items-center justify-center ${
                        val > 0
                          ? 'neu-pill-inset text-orange-400 border border-orange-500/30 bg-orange-500/10 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      <input
                        type="text"
                        value={val === 0 ? '-' : val}
                        onChange={(e) =>
                          handleMatrixCountChange(rIdx, dIdx, e.target.value)
                        }
                        placeholder="-"
                        className="w-full bg-transparent text-xs text-center text-slate-200 font-bold outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* ปุ่มถังขยะ */}
                <div className="lg:col-span-1 flex items-center justify-end lg:justify-center pt-2 lg:pt-0">
                  <button
                    type="button"
                    id={`btn-del-labor-${row.id}`}
                    onClick={() => handleDeleteMatrixRow(rIdx)}
                    className="neu-button p-2 rounded-full text-rose-400 hover:text-rose-300 active:scale-95"
                    title="ลบแถวแรงงานนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* แถวสรุปรวมทั้งหมด */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center p-3 rounded-2xl neu-pill-inset border border-orange-500/20 bg-orange-500/5">
            <div className="lg:col-span-4">
              <div className="py-1 px-2 text-xs font-black text-orange-400 uppercase tracking-wider text-center lg:text-left">
                รวมทั้งหมด
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-7 gap-1.5 text-center">
              {laborTotals.dailyAllTotals.map((tot, idx) => (
                <div
                  key={`grand-tot-sd-${idx + 1}`}
                  className="py-1.5 px-1 rounded-xl text-center text-xs font-black text-slate-200"
                >
                  {tot > 0 ? tot : '-'}
                </div>
              ))}
            </div>

            <div className="hidden lg:block lg:col-span-1"></div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* โซนลายมือชื่อท้ายสุด (Signatures) */}
      {/* ========================================================= */}
      <div
        id="signatures-zone"
        className="pt-6 border-t border-dashed border-white/[0.08] space-y-4"
      >
        <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
          การรับรองและลงนามรายงานการปฏิบัติงาน
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ซ้าย: กล่อง Inset {{SUPERVISOR_NAME}} */}
          <div
            className="neu-flat p-5 rounded-3xl space-y-2 text-center"
            id="signature-supervisor-box"
          >
            <div className="neu-pill-inset py-2.5 px-4 text-xs font-black text-slate-100 flex items-center justify-center border border-white/[0.06]">
              <span>
                {project.signatories.supervisor.name || '{{SUPERVISOR_NAME}}'}
              </span>
            </div>
            <div className="text-xs font-bold text-orange-400 tracking-wide">
              ผู้ควบคุมงาน
            </div>
          </div>

          {/* ขวา: กล่อง Inset {{CONTRACTOR_NAME}} */}
          <div
            className="neu-flat p-5 rounded-3xl space-y-2 text-center"
            id="signature-contractor-box"
          >
            <div className="neu-pill-inset py-2.5 px-4 text-xs font-black text-slate-100 flex items-center justify-center border border-white/[0.06]">
              <span>{project.contractorName || '{{CONTRACTOR_NAME}}'}</span>
            </div>
            <div className="text-xs font-bold text-orange-400 tracking-wide">
              ผู้รับจ้าง
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
