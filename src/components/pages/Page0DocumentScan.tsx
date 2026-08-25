import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScanLine,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileType,
  FileCheck2,
  Sparkles,
  Check,
  ArrowRight,
  RefreshCw,
  FolderPlus,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Users,
  Ruler,
  Info,
} from 'lucide-react';
import { ContractProjectData } from '../../types';
import {
  processUploadedFile,
  ScanResult,
  getSampleConstructionDocument,
} from '../../utils/documentScanner';
import { formatCurrency } from '../../utils/calculations';

interface Page0DocumentScanProps {
  project: ContractProjectData;
  onChange: (updatedProject: ContractProjectData) => void;
  onNavigateToPage: (page: number) => void;
  onCreateNewProjectFromScan?: (scannedProject: ContractProjectData) => void;
}

export const Page0DocumentScan: React.FC<Page0DocumentScanProps> = ({
  project,
  onChange,
  onNavigateToPage,
  onCreateNewProjectFromScan,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsScanning(true);
    setErrorMessage(null);
    setAppliedSuccess(false);
    setScanProgress(`กำลังอ่านไฟล์ ${file.name}...`);

    try {
      setTimeout(() => {
        setScanProgress('กำลังวิเคราะห์ข้อมูลโครงการและตารางสัญญาด้วย AI...');
      }, 500);

      const result = await processUploadedFile(file);
      setScanResult(result);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'ไม่สามารถสแกนเอกสารได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsScanning(false);
      setScanProgress('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleLoadSample = async () => {
    const sampleText = getSampleConstructionDocument();
    const sampleFile = new File([sampleText], 'ตัวอย่างสัญญาจ้างก่อสร้าง_อบต.txt', {
      type: 'text/plain;charset=utf-8',
    });
    const dt = new DataTransfer();
    dt.items.add(sampleFile);
    await handleFiles(dt.files);
  };

  const handleApplyAllData = () => {
    if (!scanResult || !scanResult.extractedData) return;
    const ext = scanResult.extractedData;

    const mergedProject: ContractProjectData = {
      ...project,
      projectName: ext.projectName || project.projectName,
      contractNumber: ext.contractNumber || project.contractNumber,
      organization: ext.organization || project.organization,
      contractAmount: ext.contractAmount !== undefined && ext.contractAmount > 0 ? ext.contractAmount : project.contractAmount,
      contractDate: ext.contractDate || project.contractDate,
      contractStartDate: ext.contractStartDate || project.contractStartDate,
      contractEndDate: ext.contractEndDate || project.contractEndDate,
      contractDuration: ext.contractDuration || project.contractDuration,
      contractorName: ext.contractorName || project.contractorName,
      contractorAddress: ext.contractorAddress || project.contractorAddress,
      contractorPhone: ext.contractorPhone || project.contractorPhone,
      contractorSupervisor: ext.contractorSupervisor || project.contractorSupervisor,
      contractorRep1: ext.contractorRep1 || project.contractorRep1,
      contractorRep2: ext.contractorRep2 || project.contractorRep2,
      dimensionWidth: ext.dimensionWidth || project.dimensionWidth,
      dimensionLength: ext.dimensionLength || project.dimensionLength,
      dimensionThickness: ext.dimensionThickness || project.dimensionThickness,
      dimensionArea: ext.dimensionArea || project.dimensionArea,
      scopeSummary: ext.scopeSummary || project.scopeSummary,
      employerName: ext.employerName || ext.organization || project.employerName,
      signatories: {
        supervisor: {
          roleTitle: 'ผู้ควบคุมงาน',
          name: ext.signatories?.supervisor?.name || project.signatories.supervisor.name,
          position: ext.signatories?.supervisor?.position || project.signatories.supervisor.position,
        },
        committeeChair: {
          roleTitle: 'ประธานกรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeChair?.name || project.signatories.committeeChair.name,
          position: ext.signatories?.committeeChair?.position || project.signatories.committeeChair.position,
        },
        committeeMember1: {
          roleTitle: 'กรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeMember1?.name || project.signatories.committeeMember1.name,
          position: ext.signatories?.committeeMember1?.position || project.signatories.committeeMember1.position,
        },
        committeeMember2: {
          roleTitle: 'กรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeMember2?.name || project.signatories.committeeMember2.name,
          position: ext.signatories?.committeeMember2?.position || project.signatories.committeeMember2.position,
        },
      },
    };

    if (ext.weeklyTasks && ext.weeklyTasks.length > 0) {
      mergedProject.weeklyTasks = ext.weeklyTasks.map((t, idx) => ({
        id: `scanned-task-${idx + 1}`,
        taskNumber: t.taskNumber || idx + 1,
        description: t.description || `งานรายการที่ ${idx + 1}`,
        unit: t.unit || 'งาน',
        quantity: t.quantity || 0,
        previousAccum: t.previousAccum || 0,
        thisWeek: t.thisWeek || 0,
        totalAccum: t.totalAccum || 0,
        status: t.status || 'กำลังดำเนินการ',
      }));
    }

    onChange(mergedProject);
    setAppliedSuccess(true);
  };

  const handleCreateNewProject = () => {
    if (!scanResult || !scanResult.extractedData) return;
    const ext = scanResult.extractedData;

    const newProject: ContractProjectData = {
      ...project,
      id: `proj-${Date.now()}`,
      projectName: ext.projectName || 'โครงการใหม่จากการสแกน',
      contractNumber: ext.contractNumber || '',
      organization: ext.organization || project.organization,
      contractAmount: ext.contractAmount || 0,
      contractDate: ext.contractDate || '',
      contractStartDate: ext.contractStartDate || '',
      contractEndDate: ext.contractEndDate || '',
      contractDuration: ext.contractDuration || '',
      contractorName: ext.contractorName || '',
      contractorAddress: ext.contractorAddress || '',
      contractorPhone: ext.contractorPhone || '',
      contractorSupervisor: ext.contractorSupervisor || '',
      contractorRep1: ext.contractorRep1 || '',
      contractorRep2: ext.contractorRep2 || '',
      dimensionWidth: ext.dimensionWidth || '',
      dimensionLength: ext.dimensionLength || '',
      dimensionThickness: ext.dimensionThickness || '',
      dimensionArea: ext.dimensionArea || '',
      scopeSummary: ext.scopeSummary || '',
      signatories: {
        supervisor: {
          roleTitle: 'ผู้ควบคุมงาน',
          name: ext.signatories?.supervisor?.name || '',
          position: ext.signatories?.supervisor?.position || '',
        },
        committeeChair: {
          roleTitle: 'ประธานกรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeChair?.name || '',
          position: ext.signatories?.committeeChair?.position || '',
        },
        committeeMember1: {
          roleTitle: 'กรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeMember1?.name || '',
          position: ext.signatories?.committeeMember1?.position || '',
        },
        committeeMember2: {
          roleTitle: 'กรรมการตรวจรับพัสดุ',
          name: ext.signatories?.committeeMember2?.name || '',
          position: ext.signatories?.committeeMember2?.position || '',
        },
      },
    };

    if (onCreateNewProjectFromScan) {
      onCreateNewProjectFromScan(newProject);
    } else {
      onChange(newProject);
    }
    setAppliedSuccess(true);
  };

  const handleResetScan = () => {
    setScanResult(null);
    setErrorMessage(null);
    setAppliedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="page-0-document-scanner">
      {/* Header Banner */}
      <div className="neu-flat p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                Smart AI Scanner
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                ระบบสแกนเอกสารและสกัดข้อมูลอัตโนมัติ
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-orange-500" />
              สแกนเอกสารสัญญาและรายงาน (Document Scan)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              อัปโหลดไฟล์สัญญาจ้างก่อสร้าง, บันทึกข้อความ, รูปภาพ หรือเอกสาร PDF เพื่อสกัดข้อมูลโครงการ, วงเงิน, ผู้รับจ้าง และคณะกรรมการเข้าสู่ระบบอัตโนมัติ
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLoadSample}
              className="neu-button px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:text-orange-400 flex items-center gap-2 min-h-[44px]"
              title="ทดสอบด้วยตัวอย่างข้อความสัญญาจ้างก่อสร้าง อบต."
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>โหลดตัวอย่างทดสอบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      {!scanResult && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`neu-flat p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center relative overflow-hidden group ${
            isDragging
              ? 'border-orange-500 bg-orange-500/5 scale-[1.01]'
              : 'border-white/10 hover:border-orange-500/40 hover:bg-white/[0.01]'
          }`}
          id="dropzone-upload-contract"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.json,.docx,.md"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-scanner-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl neu-flat-sm mx-auto flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-200">
              {isScanning ? (
                <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
              ) : (
                <UploadCloud className="w-8 h-8 text-orange-400" />
              )}
            </div>

            {isScanning ? (
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-200 animate-pulse">
                  {scanProgress || 'กำลังสแกนและประมวลผลเอกสาร...'}
                </h3>
                <p className="text-xs text-slate-400">
                  ระบบกำลังถอดรหัสข้อความและจัดหมวดหมู่ข้อมูลโครงการ กรุณารอสักครู่
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">
                  ลากไฟล์มาวางที่นี่ หรือ <span className="text-orange-400 underline decoration-orange-500/40 underline-offset-4">คลิกเพื่อเลือกไฟล์</span>
                </h3>
                <p className="text-xs text-slate-400">
                  รองรับไฟล์รูปแบบ <span className="font-semibold text-slate-300">PDF, PNG, JPG, TXT, DOCX, CSV, JSON</span>
                </p>
              </div>
            )}

            {/* Supported Formats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="neu-pill-inset px-2.5 py-1 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <FileType className="w-3 h-3 text-red-400" /> PDF
              </span>
              <span className="neu-pill-inset px-2.5 py-1 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-blue-400" /> PNG / JPG
              </span>
              <span className="neu-pill-inset px-2.5 py-1 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-400" /> TXT / DOCX
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Success Notification Bar */}
      <AnimatePresence>
        {appliedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2 font-bold">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>นำเข้าข้อมูลเข้าสู่โครงการสำเร็จเรียบร้อยแล้ว!</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToPage(1)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>ตรวจเช็คหน้า 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToPage(5)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
              >
                <span>ตรวจเช็คหน้า 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned Results Container */}
      {scanResult && (
        <div className="space-y-6">
          {/* File Overview Card */}
          <div className="neu-flat p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-orange-400 shrink-0">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                    {scanResult.fileName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    ขนาด: {(scanResult.fileSize / 1024).toFixed(1)} KB • สแกนผ่าน{' '}
                    <span className="text-orange-400 font-semibold uppercase">
                      {scanResult.method}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetScan}
                  className="neu-button px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300 hover:text-orange-400 flex items-center gap-1.5 min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>สแกนไฟล์ใหม่</span>
                </button>
              </div>
            </div>

            {/* AI Summary Highlight */}
            {scanResult.rawSummary && (
              <div className="p-3.5 rounded-2xl neu-pill-inset text-xs text-slate-300 flex items-start gap-2.5 border border-white/[0.04]">
                <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{scanResult.rawSummary}</span>
              </div>
            )}
          </div>

          {/* Action Apply Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 neu-flat rounded-2xl">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              พร้อมนำเข้าข้อมูลที่สแกนเข้าสู่โครงการ
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-apply-scanned-data"
                type="button"
                onClick={handleApplyAllData}
                className="neu-button px-5 py-2.5 rounded-2xl text-xs font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 active:scale-95 flex items-center gap-2 min-h-[44px] shadow-md"
              >
                <Check className="w-4 h-4 text-orange-400" />
                <span>นำเข้าข้อมูลเข้าสู่โครงการนี้ (Apply)</span>
              </button>

              <button
                id="btn-create-project-scanned"
                type="button"
                onClick={handleCreateNewProject}
                className="neu-button px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:text-slate-100 flex items-center gap-2 min-h-[44px]"
              >
                <FolderPlus className="w-4 h-4 text-slate-300" />
                <span>สร้างเป็นโครงการใหม่</span>
              </button>
            </div>
          </div>

          {/* Extracted Fields Categorized Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: ข้อมูลโครงการและสัญญา */}
            <div className="neu-flat p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>ข้อมูลโครงการ & สัญญาจ้าง</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl neu-flat-sm">
                  <span className="font-bold text-slate-400 block mb-1">ชื่อโครงการ:</span>
                  <span className="font-semibold text-slate-100 text-sm">
                    {scanResult.extractedData.projectName || '—'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl neu-flat-sm">
                    <span className="font-bold text-slate-400 block mb-1">สัญญาเลขที่:</span>
                    <span className="font-semibold text-orange-400">
                      {scanResult.extractedData.contractNumber || '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl neu-flat-sm">
                    <span className="font-bold text-slate-400 block mb-1">วงเงินค่าก่อสร้าง:</span>
                    <span className="font-bold text-emerald-400">
                      {scanResult.extractedData.contractAmount
                        ? formatCurrency(scanResult.extractedData.contractAmount)
                        : '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl neu-flat-sm">
                  <span className="font-bold text-slate-400 block mb-1">ส่วนราชการ / หน่วยงาน:</span>
                  <span className="text-slate-200">
                    {scanResult.extractedData.organization || '—'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">เริ่มต้น</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {scanResult.extractedData.contractStartDate || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">สิ้นสุด</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {scanResult.extractedData.contractEndDate || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">ระยะเวลา</span>
                    <span className="font-semibold text-orange-400 text-[11px]">
                      {scanResult.extractedData.contractDuration || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: ข้อมูลผู้รับจ้าง & ผู้แทน */}
            <div className="neu-flat p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-400" />
                  <span>ข้อมูลผู้รับจ้าง & ผู้แทน</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl neu-flat-sm">
                  <span className="font-bold text-slate-400 block mb-1">ผู้รับจ้าง (Contractor):</span>
                  <span className="font-semibold text-slate-100">
                    {scanResult.extractedData.contractorName || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl neu-flat-sm">
                  <span className="font-bold text-slate-400 block mb-1">ที่อยู่ / ติดต่อ:</span>
                  <span className="text-slate-300">
                    {scanResult.extractedData.contractorAddress || '—'}
                  </span>
                  {scanResult.extractedData.contractorPhone && (
                    <span className="block mt-1 text-slate-400">
                      โทร: {scanResult.extractedData.contractorPhone}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl neu-flat-sm space-y-1.5">
                  <span className="font-bold text-orange-400 block">๑.๖ ผู้แทนผู้รับจ้าง:</span>
                  <div className="text-slate-200">
                    1. {scanResult.extractedData.contractorRep1 || '—'}
                  </div>
                  <div className="text-slate-200">
                    2. {scanResult.extractedData.contractorRep2 || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: ขอบเขตงานและมิติขนาด */}
            <div className="neu-flat p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-orange-400" />
                  <span>ขนาด & ขอบเขตงานก่อสร้าง</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">กว้าง</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {scanResult.extractedData.dimensionWidth || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">ยาว</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {scanResult.extractedData.dimensionLength || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-slate-400 block">หนา</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {scanResult.extractedData.dimensionThickness || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl neu-flat-sm text-center">
                    <span className="text-[10px] text-orange-400 block">พื้นที่</span>
                    <span className="font-semibold text-orange-400 text-[11px]">
                      {scanResult.extractedData.dimensionArea || '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl neu-flat-sm">
                  <span className="font-bold text-slate-400 block mb-1">รายละเอียดขอบเขตงานโดยย่อ:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {scanResult.extractedData.scopeSummary || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: คณะกรรมการและผู้ควบคุมงาน */}
            <div className="neu-flat p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  <span>คณะกรรมการตรวจรับ & ผู้ควบคุมงาน</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-2xl neu-flat-sm">
                  <span className="text-orange-400 font-bold block mb-0.5">
                    ๑.๕ ผู้ควบคุมงาน:
                  </span>
                  <div className="font-semibold text-slate-100">
                    {scanResult.extractedData.signatories?.supervisor?.name || '—'}{' '}
                    {scanResult.extractedData.signatories?.supervisor?.position && (
                      <span className="text-slate-400 font-normal">
                        ({scanResult.extractedData.signatories.supervisor.position})
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl neu-flat-sm">
                  <span className="text-orange-400 font-bold block mb-0.5">
                    ๑.๔ ประธานกรรมการตรวจรับพัสดุ:
                  </span>
                  <div className="font-semibold text-slate-100">
                    {scanResult.extractedData.signatories?.committeeChair?.name || '—'}{' '}
                    {scanResult.extractedData.signatories?.committeeChair?.position && (
                      <span className="text-slate-400 font-normal">
                        ({scanResult.extractedData.signatories.committeeChair.position})
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl neu-flat-sm">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    กรรมการตรวจรับพัสดุ:
                  </span>
                  <div className="text-slate-200">
                    1. {scanResult.extractedData.signatories?.committeeMember1?.name || '—'}{' '}
                    {scanResult.extractedData.signatories?.committeeMember1?.position && (
                      <span className="text-slate-400">
                        ({scanResult.extractedData.signatories.committeeMember1.position})
                      </span>
                    )}
                  </div>
                  <div className="text-slate-200 mt-1">
                    2. {scanResult.extractedData.signatories?.committeeMember2?.name || '—'}{' '}
                    {scanResult.extractedData.signatories?.committeeMember2?.position && (
                      <span className="text-slate-400">
                        ({scanResult.extractedData.signatories.committeeMember2.position})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
