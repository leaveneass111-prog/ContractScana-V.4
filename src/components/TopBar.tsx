import React from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  Sun,
  Moon,
  Eye,
  FileDown,
  CheckCircle,
  ScanLine,
} from 'lucide-react';

interface TopBarProps {
  onToggleDrawer: () => void;
  activePage: number;
  onSelectPage: (page: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAutoSaved: boolean;
  onOpenPreview: () => void;
  onExportDocx: () => void;
  projectName: string;
  contractNumber: string;
}

const PAGE_TABS = [
  { id: 0, label: 'สแกนเอกสาร', name: 'สแกน & สกัดเอกสาร (PDF/TXT/PNG)', isScan: true },
  { id: 1, label: 'หน้า 1', name: 'บันทึกสัปดาห์' },
  { id: 2, label: 'หน้า 2', name: 'ผลงานสัปดาห์' },
  { id: 3, label: 'หน้า 3', name: 'บันทึกรายวัน' },
  { id: 4, label: 'หน้า 4', name: 'บันทึกเดือน' },
  { id: 5, label: 'หน้า 5', name: 'ข้อมูลสัญญา' },
  { id: 6, label: 'หน้า 6', name: 'สะสมรายเดือน' },
  { id: 7, label: 'หน้า 7', name: 'งวดงาน/ทดสอบ' },
  { id: 8, label: 'หน้า 8', name: 'Dashboard' },
];

export const TopBar: React.FC<TopBarProps> = ({
  onToggleDrawer,
  activePage,
  onSelectPage,
  isDarkMode,
  onToggleDarkMode,
  isAutoSaved,
  onOpenPreview,
  onExportDocx,
  projectName,
  contractNumber,
}) => {
  return (
    <header
      id="main-topbar"
      className="sticky top-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md border-b border-white/[0.06] px-3 sm:px-6 py-2.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Drawer Toggle & Brand/Project */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            id="btn-hamburger-drawer"
            type="button"
            onClick={onToggleDrawer}
            className="neu-button p-2.5 rounded-2xl text-slate-200 flex items-center justify-center min-w-[44px] min-h-[44px] hover:border-orange-500/30"
            title="เปิดเมนูโครงการ"
            aria-label="เปิดเมนูโครงการ"
          >
            <Menu className="w-5 h-5 text-orange-500" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-100 flex items-center gap-1">
                <span className="text-orange-500">Contract</span>Scan
              </span>
              <span className="neu-pill-inset px-2.5 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/20">
                Sarabun UI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-[260px] md:max-w-[340px]">
              {contractNumber ? `สัญญา ${contractNumber}: ` : ''}{projectName || 'ยังไม่ได้ระบุชื่อโครงการ'}
            </p>
          </div>
        </div>

        {/* Center: Quick Page Switcher Segmented Tabs with Inset Pill Capsule (Desktop) */}
        <div className="hidden lg:flex items-center neu-pill-inset p-1 gap-1 relative" id="desktop-page-switcher">
          {PAGE_TABS.map((tab) => {
            const isSelected = activePage === tab.id;
            return (
              <button
                key={`topbar-tab-${tab.id}`}
                id={`btn-topbar-page-${tab.id}`}
                type="button"
                onClick={() => onSelectPage(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 ${
                  isSelected
                    ? 'text-orange-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={tab.name}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTopBarTab"
                    className="absolute inset-0 rounded-full bg-[#12151f] shadow-md border border-orange-500/30"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                {tab.isScan && <ScanLine className="w-3.5 h-3.5 relative z-10 shrink-0" />}
                <span className="relative z-10">{tab.label}</span>
                {isSelected && (
                  <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Dark Mode, Auto-Save, Preview & Export */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Auto-Save Indicator with Inset Pill */}
          <div
            id="status-autosave"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full neu-pill-inset text-[11px] font-medium text-emerald-400 border border-emerald-500/20"
            title="ระบบบันทึกลงหน่วยความจำเบราว์เซอร์อัตโนมัติ"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isAutoSaved ? 'บันทึกแล้ว' : 'กำลังบันทึก...'}</span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={onToggleDarkMode}
            className="neu-button p-2.5 rounded-2xl text-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title={isDarkMode ? 'สลับเป็น Light Mode' : 'สลับเป็น Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-orange-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-300" />
            )}
          </button>

          {/* Preview Modal Button */}
          <button
            id="btn-open-preview-modal"
            type="button"
            onClick={onOpenPreview}
            className="neu-button px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-100 flex items-center gap-1.5 min-h-[44px] hover:border-orange-500/30"
            title="ดูตัวอย่างเอกสารทางการ (ราชการไทย)"
          >
            <Eye className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">ดูตัวอย่างเอกสาร</span>
            <span className="sm:hidden">พรีวิว</span>
          </button>

          {/* Export Button */}
          <button
            id="btn-export-docx-topbar"
            type="button"
            onClick={onExportDocx}
            className="neu-button px-3.5 py-2 rounded-2xl text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 min-h-[44px] hover:bg-orange-500/20 active:scale-95 shadow-sm"
            title="ส่งออกเอกสารราชการ (.doc / .docx / สรุปรายงาน)"
          >
            <FileDown className="w-4 h-4" />
            <span>Export .docx</span>
          </button>
        </div>
      </div>
    </header>
  );
};
