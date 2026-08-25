import { ContractProjectData, LaborMatrixRow, TaskRow, WeeklyProgressEntry } from '../types';

export const PAGE_NAMES_TH: Record<number, string> = {
  1: 'หน้า 1: บันทึกข้อความ (รายงานประจำสัปดาห์)',
  2: 'หน้า 2: ผลการดำเนินงานในสัปดาห์',
  3: 'หน้า 3: บันทึกรายวัน สภาพอากาศ & บัญชีแรงงาน',
  4: 'หน้า 4: บันทึกข้อความ (รายงานประจำเดือน)',
  5: 'หน้า 5: ข้อมูลโครงการและสัญญาจ้างฉบับเต็ม',
  6: 'หน้า 6: ตารางผลการดำเนินงานสะสมรายเดือน',
  7: 'หน้า 7: งวดงาน การตรวจรับ & ผลทดสอบวัสดุ',
  8: 'หน้า 8: สรุปผลโครงการ (Executive Dashboard)',
};

export const resetPage1Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    organization: '',
    docNumber: '',
    docDate: '',
    subjectWeekly: '',
    reportWeekNo: 1,
    periodStart: '',
    periodEnd: '',
    projectName: '',
    location: '',
    contractNumber: '',
    contractDate: '',
    startDate: '',
    endDate: '',
    totalDurationDays: 0,
    budgetYear: '',
    totalBudget: 0,
    contractAmount: 0,
    disbursedAmount: 0,
    totalInstallments: 1,
    inspectedInstallments: 0,
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage2Data = (current: ContractProjectData): ContractProjectData => {
  const defaultTask: TaskRow = {
    id: `task-${Date.now()}`,
    wn: 1,
    wd: '',
    ww: 0,
    wp: 0,
    wt: 0,
    wc: 0,
    wr: 0,
    remarks: '',
  };
  const defaultWeeklyLog: WeeklyProgressEntry = {
    id: `wpl-${Date.now()}`,
    weekName: 'สัปดาห์ที่ ๑',
    activitiesText: '',
    weightPct: 0,
    prevWeekPct: 0,
    inWeekPct: 0,
    accumulatedPct: 0,
    totalWorkPct: 0,
    plannedPct: 0,
    actualPct: 0,
    cumulativePct: 0,
    keyActivities: '',
    approvalStatus: 'รอดำเนินการ',
  };
  return {
    ...current,
    weeklyTasks: [defaultTask],
    weeklyProgressLogs: [defaultWeeklyLog],
    hasObstacleWeekly: false,
    obstacleWeeklyDetail: '',
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage3Data = (current: ContractProjectData): ContractProjectData => {
  const defaultLogs = Array.from({ length: 7 }, (_, i) => ({
    dayNumber: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    dateStr: '',
    morning: 'sunny' as const,
    afternoon: 'sunny' as const,
    workDescription: '',
  }));

  const defaultLabor: LaborMatrixRow[] = [
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
      name: 'กรรมกร',
      unit: 'คน',
      counts: [0, 0, 0, 0, 0, 0, 0],
    },
  ];

  return {
    ...current,
    dailyLogs: defaultLogs,
    laborMatrix: defaultLabor,
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage4Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    selectedMonth: '',
    subjectMonthly: '',
    monthlySummaryNarrative: '',
    monthlyDisbursementStatus: '',
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage5Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    extendedEndDate: '',
    dailyPenaltyRate: 0,
    dimensionWidth: '',
    dimensionLength: '',
    dimensionThickness: '',
    dimensionArea: '',
    scopeSummary: '',
    employerName: '',
    designerName: '',
    contractorName: '',
    contractorAddress: '',
    contractorPhone: '',
    contractorSupervisor: '',
    contractorRep1: '',
    contractorRep2: '',
    signatories: {
      supervisor: {
        roleTitle: 'ผู้ควบคุมงาน',
        name: '',
        position: '',
        agency: '',
        signedDate: '',
      },
      committeeChair: {
        roleTitle: 'ประธานกรรมการตรวจรับพัสดุ',
        name: '',
        position: '',
        agency: '',
        signedDate: '',
      },
      committeeMember1: {
        roleTitle: 'กรรมการตรวจรับพัสดุ',
        name: '',
        position: '',
        agency: '',
        signedDate: '',
      },
      committeeMember2: {
        roleTitle: 'กรรมการตรวจรับพัสดุ',
        name: '',
        position: '',
        agency: '',
        signedDate: '',
      },
    },
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage6Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    monthlyProgressLogs: [],
    monthlyNotes: '',
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage7Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    milestones: [],
    milestoneNotes: '',
    materialTests: [],
    materialApprovals: [],
    materialNotes: '',
    updatedAt: new Date().toISOString(),
  };
};

export const resetPage8Data = (current: ContractProjectData): ContractProjectData => {
  return {
    ...current,
    obstacles: [],
    updatedAt: new Date().toISOString(),
  };
};

export const resetPageDataByIndex = (
  pageIndex: number,
  current: ContractProjectData
): ContractProjectData => {
  switch (pageIndex) {
    case 1:
      return resetPage1Data(current);
    case 2:
      return resetPage2Data(current);
    case 3:
      return resetPage3Data(current);
    case 4:
      return resetPage4Data(current);
    case 5:
      return resetPage5Data(current);
    case 6:
      return resetPage6Data(current);
    case 7:
      return resetPage7Data(current);
    case 8:
      return resetPage8Data(current);
    default:
      return current;
  }
};
