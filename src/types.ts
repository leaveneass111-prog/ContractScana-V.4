export type WeatherCondition = 'sunny' | 'overcast' | 'rain' | 'heavy_rain';

export interface WeatherDay {
  dayNumber: number; // 1 to 7
  dateStr: string;
  morning: WeatherCondition;
  afternoon: WeatherCondition;
  workDescription: string;
}

export type DailyLogEntry = WeatherDay;

export interface TaskRow {
  id: string;
  wn: number; // ลำดับที่
  weekTitle?: string; // เช่น สัปดาห์ที่ ๑ (๑ - ๗ มิ.ย. ๒๕๖๗)
  wd: string; // รายการงานที่ดำเนินการ
  ww: number; // สัดส่วนของงาน %
  wp: number; // ผลงาน % ถึงสัปดาห์ก่อน
  wt: number; // ผลงาน % ในสัปดาห์นี้
  wc: number; // สะสม % (wp + wt)
  wr: number; // คงเหลือ/รวม % (ww - wc หรือ 100%)
  remarks?: string;
}

export interface WeeklyProgressEntry {
  id: string;
  weekName?: string;
  activitiesText?: string;
  weightPct?: number;
  prevWeekPct?: number;
  inWeekPct?: number;
  accumulatedPct?: number;
  totalWorkPct?: number;
  plannedPct?: number;
  actualPct?: number;
  cumulativePct?: number;
  keyActivities?: string;
  approvalStatus?: string;
}

export interface LaborMatrixRow {
  id: string;
  category: 'labor' | 'machine' | 'supervision';
  name: string;
  unit: string;
  counts: [number, number, number, number, number, number, number]; // SD1 - SD7
}

export interface Signatory {
  roleTitle: string; // เช่น ผู้ควบคุมงาน, ประธานกรรมการตรวจรับพัสดุ
  name: string;
  position: string;
  agency?: string;
  signedDate?: string;
}

export interface MonthlyProgressEntry {
  id: string;
  monthName: string;
  yearTh?: string;
  activitiesText?: string; // งานที่ดำเนินการ เช่น - ไม่ปฏิบัติงาน
  weightPct?: number; // สัดส่วนของงาน %
  prevMonthPct?: number; // ผลงาน: ถึงเดือนก่อน
  inMonthPct?: number; // ผลงาน: ในเดือน
  accumulatedPct?: number; // ผลงาน: สะสม
  totalWorkPct?: number; // ผลงานรวม %

  // Backward compatibility fields
  plannedPct?: number;
  actualPct?: number;
  diffPct?: number;
  cumulativePct?: number;
  keyActivities?: string;
  materialTests?: string;
  approvalStatus?: string;
}

export interface MilestoneItem {
  id: string;
  installmentNo: number;
  description: string;
  amount: number;
  contractDueDate: string;
  actualFinishDate: string;
  inspectionDate: string;
  paymentStatus: 'pending' | 'inspected' | 'disbursed';
  finishDateText?: string;
  inspectionDateText?: string;
  remarks?: string;
}

export interface MaterialTestItem {
  id: string;
  item: string; // เช่น รายงานผลการทดสอบวัสดุการทดสอบเหล็กเสริมคอนกรีต (สป. ๐๐๒๒.๓/๒๔๗๗)
  sampleCount?: string; // เช่น RB19, Wire Mesh CDR, ๓ แท่ง
  testDate: string;
  testDateText?: string; // เช่น ๑ ก.ค. ๖๗
  testingAuthority: string; // เช่น โยธาธิการและผังเมือง, มหาวิทยาลัย
  location?: string; // เช่น พื้นถนน, กม. 0+100
  result: 'passed' | 'failed' | 'pending';
  resultText?: string; // เช่น ตามผลการทดสอบ, ผ่านเกณฑ์
  testCertNo: string;
  notes?: string;
}

export interface MaterialApprovalItem {
  id: string;
  item: string; // เช่น ขออนุมัติใช้เหล็กเสริมคอนกรีต (สป. ๓๘๐๑/๑๒๔)
  requestDate: string;
  requestDateText?: string; // เช่น ๑๖ ก.ค. ๖๔
  reviewer: string; // เช่น นายกฯ, ช่างควบคุมงาน
  status: 'approved' | 'rejected' | 'pending' | 'revised';
  decisionText?: string; // เช่น อนุมัติ, ไม่อนุมัติ
  approvalDate?: string;
  remarks?: string;
}

export interface ObstacleItem {
  id: string;
  issue: string;
  impact: string;
  mitigation: string;
  notified: boolean;
  notifiedDate?: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export interface ContractProjectData {
  id?: string; // รหัสเฉพาะประจำโครงการ
  updatedAt?: string; // วันที่แก้ไขล่าสุด
  // General & Memo Info
  organization: string; // ส่วนราชการ เช่น องค์การบริหารส่วนตำบลใหม่พัฒนา
  docNumber: string; // เลขที่หนังสือ เช่น นศ 78201/2567
  docDate: string; // วันที่
  subjectWeekly: string; // เรื่องรายงานประจำสัปดาห์
  subjectMonthly: string; // เรื่องรายงานประจำเดือน
  
  // Weekly details
  reportWeekNo: number; // รายงานครั้งที่
  periodStart: string; // ระหว่างวันที่
  periodEnd: string; // ถึงวันที่
  
  // Project details
  projectName: string;
  location: string;
  contractNumber: string;
  contractDate: string;
  startDate: string;
  endDate: string;
  extendedEndDate?: string;
  totalDurationDays: number;
  dailyPenaltyRate: number; // ค่าปรับรายวัน (บาท/วัน)
  
  // Budget & Financials
  budgetYear: string;
  totalBudget: number; // วงเงินงบประมาณ
  contractAmount: number; // วงเงินค่าก่อสร้างตามสัญญา
  disbursedAmount: number; // วงเงินเบิกจ่ายแล้ว
  totalInstallments: number; // ค่างวดงานทั้งหมด
  inspectedInstallments: number; // ค่างวดที่ตรวจรับแล้ว
  
  // Dimensions & Scope
  dimensionWidth: string;
  dimensionLength: string;
  dimensionThickness: string;
  dimensionArea: string; // พื้นที่ไม่น้อยกว่า ตร.ม.
  scopeSummary: string; // รายละเอียดขอบเขตงานโดยย่อ
  
  // Contractors & Designers
  employerName: string; // ผู้ว่าจ้าง
  designerName: string; // ผู้ออกแบบ
  contractorName: string; // ผู้รับจ้าง
  contractorAddress: string;
  contractorPhone: string;
  contractorSupervisor: string;
  contractorRep1?: string; // ผู้แทนผู้รับจ้าง 1 {{REP_1}}
  contractorRep2?: string; // ผู้แทนผู้รับจ้าง 2 {{REP_2}}
  
  // Signatories
  signatories: {
    supervisor: Signatory; // ผู้ควบคุมงาน
    committeeChair: Signatory; // ประธานกรรมการตรวจรับพัสดุ
    committeeMember1: Signatory; // กรรมการตรวจรับคนที่ 1
    committeeMember2: Signatory; // กรรมการตรวจรับคนที่ 2
  };
  
  // Page 2: Weekly tasks & obstacle
  weeklyTasks: TaskRow[];
  weeklyProgressLogs?: WeeklyProgressEntry[];
  hasObstacleWeekly: boolean;
  obstacleWeeklyDetail: string;
  
  // Page 3: 7 days daily logs & labor matrix
  dailyLogs: WeatherDay[];
  laborMatrix: LaborMatrixRow[];
  
  // Page 4: Monthly report memo
  selectedMonth: string; // RPT_MONTH เช่น 'สิงหาคม 2567'
  monthlySummaryNarrative: string;
  monthlyDisbursementStatus: string;
  
  // Page 6: Cumulative Monthly Progress table
  monthlyProgressLogs: MonthlyProgressEntry[];
  monthlyNotes?: string;
  
  // Page 7: Milestones, Material Tests & Approvals
  milestones: MilestoneItem[];
  milestoneNotes?: string;
  materialTests: MaterialTestItem[];
  materialApprovals: MaterialApprovalItem[];
  materialNotes?: string;
  
  // Page 8: Obstacles & Executive Dashboard
  obstacles: ObstacleItem[];
}

export interface StoredProjectItem {
  id: string;
  projectName: string;
  contractNumber: string;
  organization: string;
  contractAmount: number;
  progressPct: number;
  updatedAt: string;
  createdAt: string;
  data: ContractProjectData;
}
