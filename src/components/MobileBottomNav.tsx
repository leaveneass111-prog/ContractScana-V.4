import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface MobileBottomNavProps {
  activePage: number;
  onSelectPage: (page: number) => void;
  totalPages?: number;
}

const PAGE_NAMES: Record<number, string> = {
  0: 'หน้าสแกน: สแกนเอกสาร (PDF/TXT/PNG)',
  1: 'หน้า 1: บันทึกรายสัปดาห์',
  2: 'หน้า 2: ผลงานในสัปดาห์',
  3: 'หน้า 3: บันทึกรายวัน',
  4: 'หน้า 4: บันทึกรายเดือน',
  5: 'หน้า 5: ข้อมูลสัญญาเต็ม',
  6: 'หน้า 6: สะสมรายเดือน',
  7: 'หน้า 7: งวดงาน/ทดสอบ',
  8: 'หน้า 8: สรุป & Dashboard',
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onSelectPage,
  totalPages = 8,
}) => {
  return (
    <div
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 backdrop-blur-xl border-t border-white/[0.08] p-2 px-3 flex items-center justify-between gap-2 shadow-2xl"
    >
      <button
        id="btn-mobile-prev-page"
        type="button"
        disabled={activePage <= 0}
        onClick={() => onSelectPage(Math.max(0, activePage - 1))}
        className="neu-button p-2.5 rounded-full text-slate-300 min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30 active:scale-95"
        title="หน้าก่อนหน้า"
      >
        <ChevronLeft className="w-5 h-5 text-orange-400" />
      </button>

      {/* Center Inset Pill dropdown selector */}
      <div className="flex-1 min-w-0 neu-pill-inset p-1 rounded-full flex items-center gap-2 px-3.5 min-h-[44px] border border-orange-500/20">
        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
        <Layers className="w-4 h-4 text-orange-400 shrink-0" />
        <select
          id="mobile-page-select-dropdown"
          value={activePage}
          onChange={(e) => onSelectPage(Number(e.target.value))}
          className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-100 outline-none cursor-pointer"
        >
          {Array.from({ length: totalPages + 1 }, (_, i) => i).map((pageNum) => (
            <option
              key={`mob-opt-page-${pageNum}`}
              value={pageNum}
              className="bg-[#12151f] text-slate-200"
            >
              {PAGE_NAMES[pageNum] || `หน้า ${pageNum}`}
            </option>
          ))}
        </select>
      </div>

      <button
        id="btn-mobile-next-page"
        type="button"
        disabled={activePage >= totalPages}
        onClick={() => onSelectPage(Math.min(totalPages, activePage + 1))}
        className="neu-button p-2.5 rounded-full text-slate-300 min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30 active:scale-95"
        title="หน้าถัดไป"
      >
        <ChevronRight className="w-5 h-5 text-orange-400" />
      </button>
    </div>
  );
};
