import React from 'react';
import { WeatherCondition, WeatherDay } from '../types';
import { Sun, Cloud, CloudRain, Copy, Check, RefreshCw } from 'lucide-react';

interface WeatherSelectorProps {
  dailyLogs: WeatherDay[];
  onChange: (updatedLogs: WeatherDay[]) => void;
}

export const WEATHER_OPTIONS: {
  key: WeatherCondition;
  label: string;
  icon: React.ElementType;
  colorClass: string;
}[] = [
  {
    key: 'sunny',
    label: 'แจ่มใส',
    icon: Sun,
    colorClass: 'text-amber-500 bg-amber-500/15 border-amber-500/30',
  },
  {
    key: 'overcast',
    label: 'ครื้มฝน',
    icon: Cloud,
    colorClass: 'text-sky-500 bg-sky-500/15 border-sky-500/30',
  },
  {
    key: 'rain',
    label: 'ฝนตก',
    icon: CloudRain,
    colorClass: 'text-blue-500 bg-blue-500/15 border-blue-500/30',
  },
];

const getNextWeather = (current: WeatherCondition): WeatherCondition => {
  if (current === 'sunny') return 'overcast';
  if (current === 'overcast') return 'rain';
  return 'sunny';
};

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({
  dailyLogs,
  onChange,
}) => {
  const [copiedDayIdx, setCopiedDayIdx] = React.useState<number | null>(null);

  const handleToggleWeather = (
    dayIndex: number,
    period: 'morning' | 'afternoon'
  ) => {
    const nextLogs = [...dailyLogs];
    const current = nextLogs[dayIndex][period] || 'sunny';
    nextLogs[dayIndex] = {
      ...nextLogs[dayIndex],
      [period]: getNextWeather(current),
    };
    onChange(nextLogs);
  };

  const handleCopyToAllDays = (sourceDayIdx: number) => {
    const source = dailyLogs[sourceDayIdx];
    const nextLogs = dailyLogs.map((item) => ({
      ...item,
      morning: source.morning,
      afternoon: source.afternoon,
    }));
    onChange(nextLogs);
    setCopiedDayIdx(sourceDayIdx);
    setTimeout(() => setCopiedDayIdx(null), 2000);
  };

  return (
    <div id="weather-selector-container" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/5 dark:border-white/5">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            บันทึกสภาพอากาศรายวัน 7 วัน (เช้า - บ่าย)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            คลิกที่ปุ่มเพื่อเปลี่ยนสภาพอากาศ (แจ่มใส → ครื้มฝน → ฝนตก)
          </p>
        </div>

        {dailyLogs.length > 0 && (
          <button
            type="button"
            id="btn-copy-weather-d1"
            onClick={() => handleCopyToAllDays(0)}
            className="neu-button px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 active:scale-95"
            title="คัดลอกสภาพอากาศของวันแรกไปยังทุกวันในสัปดาห์นี้"
          >
            {copiedDayIdx === 0 ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                คัดลอกสำเร็จแล้ว
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                คัดลอกสภาพอากาศ D1 ไปยังทุกวัน
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
        {dailyLogs.map((day, idx) => {
          const morningOpt =
            WEATHER_OPTIONS.find((w) => w.key === day.morning) ||
            WEATHER_OPTIONS[0];
          const afternoonOpt =
            WEATHER_OPTIONS.find((w) => w.key === day.afternoon) ||
            WEATHER_OPTIONS[0];
          const MorningIcon = morningOpt.icon;
          const AfternoonIcon = afternoonOpt.icon;

          return (
            <div
              key={`weather-day-${day.dayNumber}`}
              id={`weather-card-d${day.dayNumber}`}
              className="neu-flat p-3.5 rounded-2xl flex flex-col justify-between space-y-3"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  D{day.dayNumber}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                  {day.dateStr || `วัน ${day.dayNumber}`}
                </span>
              </div>

              {/* Morning Selector */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ช่วงเช้า
                </div>
                <button
                  type="button"
                  id={`btn-weather-d${day.dayNumber}-morning`}
                  onClick={() => handleToggleWeather(idx, 'morning')}
                  title="คลิกเพื่อเปลี่ยนสภาพอากาศ"
                  className={`w-full neu-button py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-1 border transition-all active:scale-95 ${morningOpt.colorClass}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MorningIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{morningOpt.label}</span>
                  </div>
                  <RefreshCw className="w-3 h-3 opacity-60 shrink-0" />
                </button>
              </div>

              {/* Afternoon Selector */}
              <div className="space-y-1.5 pt-1 border-t border-black/5 dark:border-white/5">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ช่วงบ่าย
                </div>
                <button
                  type="button"
                  id={`btn-weather-d${day.dayNumber}-afternoon`}
                  onClick={() => handleToggleWeather(idx, 'afternoon')}
                  title="คลิกเพื่อเปลี่ยนสภาพอากาศ"
                  className={`w-full neu-button py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-1 border transition-all active:scale-95 ${afternoonOpt.colorClass}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <AfternoonIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{afternoonOpt.label}</span>
                  </div>
                  <RefreshCw className="w-3 h-3 opacity-60 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
