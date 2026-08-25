import React, { useState, useRef } from 'react';
import { ContractProjectData, StoredProjectItem } from '../types';
import { formatCurrency } from '../utils/calculations';
import { formatThaiDateTime } from '../utils/projectStorage';
import {
  X,
  Plus,
  Trash2,
  Copy,
  FolderOpen,
  Download,
  Upload,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Save,
  Clock,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ContractProjectData;
  projectsList: StoredProjectItem[];
  onSwitchProject: (project: ContractProjectData) => void;
  onCreateProject: (newProject: ContractProjectData) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onImportProjects: (importedList: StoredProjectItem[] | ContractProjectData) => void;
  onResetAllData: () => void;
  onSaveCurrentProject: () => void;
  activePage?: number;
  onSelectPage?: (pageNumber: number) => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  isOpen,
  onClose,
  project,
  projectsList,
  onSwitchProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onImportProjects,
  onResetAllData,
  onSaveCurrentProject,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newProjectMode, setNewProjectMode] = useState<'blank' | 'sample'>('blank');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newContractNo, setNewContractNo] = useState<string>('');
  const [newOrgName, setNewOrgName] = useState<string>('');
  const [projectToDelete, setProjectToDelete] = useState<StoredProjectItem | null>(null);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter projects by search query
  const filteredProjects = projectsList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.projectName && item.projectName.toLowerCase().includes(q)) ||
      (item.contractNumber && item.contractNumber.toLowerCase().includes(q)) ||
      (item.organization && item.organization.toLowerCase().includes(q))
    );
  });

  const handleManualSave = () => {
    onSaveCurrentProject();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleStartCreateProject = () => {
    setIsCreatingNew(true);
    setNewProjectName('');
    setNewContractNo('');
    setNewOrgName(project.organization || '');
  };

  const handleConfirmCreate = () => {
    if (newProjectMode === 'blank') {
      const now = new Date().toISOString();
      const freshProject: ContractProjectData = {
        ...project,
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        updatedAt: now,
        projectName: newProjectName.trim() || 'โครงการก่อสร้างใหม่',
        contractNumber: newContractNo.trim() || '',
        organization: newOrgName.trim() || project.organization || '',
        docNumber: '',
        docDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        totalDurationDays: 90,
        contractAmount: 0,
        totalBudget: 0,
        disbursedAmount: 0,
        weeklyTasks: [
          {
            id: 'wt-1',
            wn: 1,
            wd: 'งานเตรียมการและปรับพื้นที่',
            ww: 100,
            wp: 0,
            wt: 0,
            wc: 0,
            wr: 100,
            remarks: '',
          },
        ],
        dailyLogs: Array.from({ length: 7 }, (_, i) => ({
          dayNumber: i + 1,
          dateStr: '',
          morning: 'sunny' as const,
          afternoon: 'sunny' as const,
          workDescription: '',
        })),
        monthlyProgressLogs: [],
        milestones: [],
        materialTests: [],
        materialApprovals: [],
        obstacles: [],
        laborMatrix: [
          {
            id: 'lm-1',
            category: 'supervision',
            name: 'หัวหน้าคนงาน / โฟร์แมน',
            unit: 'คน',
            counts: [0, 0, 0, 0, 0, 0, 0],
          },
          {
            id: 'lm-2',
            category: 'labor',
            name: 'คนงานทั่วไป',
            unit: 'คน',
            counts: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      };
      onCreateProject(freshProject);
    } else {
      // Clone from current
      const now = new Date().toISOString();
      const clonedProject: ContractProjectData = {
        ...project,
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projectName: newProjectName.trim() || `${project.projectName} (สำเนา)`,
        contractNumber: newContractNo.trim() || project.contractNumber,
        organization: newOrgName.trim() || project.organization,
        updatedAt: now,
      };
      onCreateProject(clonedProject);
    }
    setIsCreatingNew(false);
  };

  const handleExportSingleProject = (targetProject: ContractProjectData) => {
    const dataStr = JSON.stringify(targetProject, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contract_${targetProject.contractNumber || 'project'}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAllProjects = () => {
    const backupData = {
      exportVersion: '1.0',
      exportDate: new Date().toISOString(),
      activeProjectId: project.id,
      projects: projectsList,
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contractscan_backup_all_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.projects && Array.isArray(parsed.projects)) {
            onImportProjects(parsed.projects);
          } else if (Array.isArray(parsed)) {
            onImportProjects(parsed);
          } else if (parsed.projectName !== undefined || parsed.contractNumber !== undefined) {
            onImportProjects(parsed);
          } else {
            alert('ไม่พบข้อมูลโครงการที่ถูกต้องในไฟล์ JSON');
          }
        } catch {
          alert('ไม่สามารถอ่านไฟล์ JSON ได้ กรุณาตรวจสอบรูปแบบไฟล์');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" id="project-drawer-backdrop">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Content Panel */}
      <div
        id="project-drawer-panel"
        className="relative w-full max-w-lg bg-[#0c0e14] text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-hidden border-r border-white/[0.08]"
      >
        {/* Drawer Top Header with Inset Pill Capsule */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-[#12151f]/50">
          <div className="neu-section-capsule">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <Briefcase className="w-4 h-4 text-orange-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                คลังโครงการ
              </h2>
            </div>
          </div>

          <button
            id="btn-close-drawer"
            type="button"
            onClick={onClose}
            className="neu-button p-2 rounded-full text-slate-400 hover:text-slate-100 active:scale-95"
            title="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top Action Toolbar: New Project & Save Current */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-drawer-add-new-project"
              onClick={handleStartCreateProject}
              className="flex-1 neu-button py-2.5 px-3.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center gap-1.5 active:scale-95 hover:bg-orange-500/20"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              + เพิ่มโครงการใหม่
            </button>

            <button
              type="button"
              id="btn-drawer-save-current"
              onClick={handleManualSave}
              className={`neu-button py-2.5 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 active:scale-95 ${
                justSaved
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                  : 'text-slate-300'
              }`}
              title="บันทึกข้อมูลโครงการปัจจุบันลงคลัง"
            >
              {justSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  บันทึกแล้ว
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-orange-400" />
                  บันทึก
                </>
              )}
            </button>
          </div>

          {/* Create New Project Inline Form Panel */}
          {isCreatingNew && (
            <div className="neu-flat p-4 rounded-3xl space-y-3.5 border border-orange-500/30 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="neu-pill-inset px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>สร้างโครงการใหม่</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="neu-button p-1 rounded-full text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setNewProjectMode('blank')}
                  className={`p-2.5 rounded-full border flex items-center justify-center gap-1.5 ${
                    newProjectMode === 'blank'
                      ? 'neu-pill-inset text-orange-400 border-orange-500/40 font-bold'
                      : 'neu-button text-slate-400 border-transparent'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  สร้างแบบฟอร์มเปล่า
                </button>
                <button
                  type="button"
                  onClick={() => setNewProjectMode('sample')}
                  className={`p-2.5 rounded-full border flex items-center justify-center gap-1.5 ${
                    newProjectMode === 'sample'
                      ? 'neu-pill-inset text-orange-400 border-orange-500/40 font-bold'
                      : 'neu-button text-slate-400 border-transparent'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  คัดลอกจากปัจจุบัน
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    ชื่อโครงการ *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="เช่น โครงการก่อสร้างอาคารสำนักงาน 4 ชั้น"
                    className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      สัญญาเลขที่
                    </label>
                    <input
                      type="text"
                      value={newContractNo}
                      onChange={(e) => setNewContractNo(e.target.value)}
                      placeholder="เช่น 12/2569"
                      className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      ส่วนราชการ/หน่วยงาน
                    </label>
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="เช่น กรมทางหลวง"
                      className="w-full neu-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="neu-button px-3.5 py-1.5 rounded-full text-xs text-slate-400"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCreate}
                  className="neu-button px-4 py-1.5 rounded-full text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md"
                >
                  สร้างโครงการ
                </button>
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-projects"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อโครงการ, เลขที่สัญญา, หน่วยงาน..."
              className="w-full neu-input pl-9 pr-3 py-2 rounded-2xl text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project List Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <span>รายการโครงการทั้งหมด ({filteredProjects.length})</span>
            <span>ความก้าวหน้า</span>
          </div>

          {/* Project Cards Stack */}
          <div className="space-y-3">
            {filteredProjects.length === 0 ? (
              <div className="neu-flat p-6 rounded-3xl text-center space-y-2 text-slate-400">
                <Briefcase className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">ไม่พบโครงการที่ตรงกับคำค้นหา</p>
                <button
                  type="button"
                  onClick={handleStartCreateProject}
                  className="neu-button px-3.5 py-1 rounded-full text-xs text-orange-400 font-bold"
                >
                  + เพิ่มโครงการใหม่
                </button>
              </div>
            ) : (
              filteredProjects.map((item) => {
                const isActive = project.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`neu-flat p-3.5 rounded-2xl space-y-2.5 border transition-colors ${
                      isActive
                        ? 'border-orange-500/50 bg-orange-500/5 ring-1 ring-orange-500/30'
                        : 'border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                  >
                    {/* Card Top: Title & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                              กำลังเปิดใช้งาน
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400">
                            {item.contractNumber || 'ไม่มีเลขที่สัญญา'}
                          </span>
                        </div>

                        <h4
                          onClick={() => {
                            if (!isActive) onSwitchProject(item.data);
                          }}
                          className={`text-xs font-bold leading-snug mt-1 cursor-pointer transition-colors ${
                            isActive
                              ? 'text-orange-400'
                              : 'text-slate-100 hover:text-orange-400'
                          }`}
                          title="คลิกเพื่อสลับมาทำต่อในโครงการนี้"
                        >
                          {item.projectName || 'โครงการยังไม่ได้ระบุชื่อ'}
                        </h4>

                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.organization || 'ไม่ระบุหน่วยงาน'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="neu-pill-inset inline-block px-2.5 py-0.5 text-xs font-black text-orange-400 border border-orange-500/30">
                          {item.progressPct.toFixed(1)}%
                        </span>
                        {item.contractAmount > 0 && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            ฿{formatCurrency(item.contractAmount)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Timestamp & Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" />
                        {formatThaiDateTime(item.updatedAt)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchProject(item.data);
                              onClose();
                            }}
                            className="neu-button px-2.5 py-1 rounded-full text-xs font-bold text-orange-400 flex items-center gap-1 hover:border-orange-500/30"
                            title="สลับมาทำต่อในโครงการนี้"
                          >
                            <FolderOpen className="w-3 h-3 text-orange-400" />
                            เปิดทำงานต่อ
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDuplicateProject(item.id)}
                          className="neu-button p-1.5 rounded-full text-slate-400 hover:text-slate-100"
                          title="ทำสำเนาโครงการนี้"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExportSingleProject(item.data)}
                          className="neu-button p-1.5 rounded-full text-slate-400 hover:text-slate-100"
                          title="ส่งออกเฉพาะโครงการนี้เป็นไฟล์ JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setProjectToDelete(item)}
                          className="neu-button p-1.5 rounded-full text-rose-400 hover:bg-rose-500/10"
                          title="ลบโครงการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Storage & Backup Tools Section */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              สำรอง & ถ่ายโอนคลังข้อมูล (Data Backup)
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-export-all-backup"
                type="button"
                onClick={handleExportAllProjects}
                className="neu-button p-2.5 rounded-full text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 hover:border-orange-500/30"
                title="สำรองคลังข้อมูลโครงการทั้งหมดเป็นไฟล์ JSON"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                สำรองทุกโครงการ
              </button>

              <button
                id="btn-import-json-trigger"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="neu-button p-2.5 rounded-full text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 hover:border-orange-500/30"
                title="นำเข้าโครงการจากไฟล์ JSON"
              >
                <Upload className="w-3.5 h-3.5 text-orange-400" />
                นำเข้า JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              id="btn-reset-all-data-trigger"
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'คำเตือน: คุณต้องการล้างข้อมูลคลังโครงการทั้งหมด และกลับสู่โครงการตัวอย่างเริ่มต้นใช่หรือไม่?'
                  )
                ) {
                  onResetAllData();
                }
              }}
              className="w-full neu-button p-2 rounded-full text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ล้างข้อมูลคลังทั้งหมด / ค่าเริ่มต้น
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal / Dialog */}
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="neu-flat p-5 rounded-3xl max-w-sm w-full space-y-4 border border-rose-500/30">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">
                    ยืนยันการลบโครงการ?
                  </h4>
                  <p className="text-xs text-slate-400">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl neu-pill-inset text-xs space-y-1">
                <div className="font-bold text-slate-200">
                  {projectToDelete.projectName}
                </div>
                <div className="text-slate-400">สัญญาเลขที่: {projectToDelete.contractNumber}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="neu-button px-3.5 py-2 rounded-full text-xs text-slate-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProject(projectToDelete.id);
                    setProjectToDelete(null);
                  }}
                  className="neu-button px-4 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md"
                >
                  ลบโครงการ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Bottom Footer */}
        <div className="p-3 bg-[#12151f]/60 border-t border-white/[0.06] text-center text-[11px] text-slate-400">
          ContractScan Multi-Project Manager
        </div>
      </div>
    </div>
  );
};
