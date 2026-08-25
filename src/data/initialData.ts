import { ContractProjectData } from '../types';

export const initialProjectData: ContractProjectData = {
  organization: '',
  docNumber: '',
  docDate: '',
  subjectWeekly: '',
  subjectMonthly: '',
  
  reportWeekNo: 1,
  periodStart: '',
  periodEnd: '',
  
  projectName: '',
  location: '',
  contractNumber: '',
  contractDate: '',
  startDate: '',
  endDate: '',
  extendedEndDate: '',
  totalDurationDays: 0,
  dailyPenaltyRate: 0,
  
  budgetYear: '',
  totalBudget: 0,
  contractAmount: 0,
  disbursedAmount: 0,
  totalInstallments: 1,
  inspectedInstallments: 0,
  
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
  
  // Dynamic Task Rows for Page 2
  weeklyTasks: [
    {
      id: 'task-1',
      wn: 1,
      wd: '',
      ww: 0,
      wp: 0,
      wt: 0,
      wc: 0,
      wr: 0,
      remarks: '',
    },
  ],
  weeklyProgressLogs: [
    {
      id: 'wpl-1',
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
    },
  ],
  hasObstacleWeekly: false,
  obstacleWeeklyDetail: '',
  
  // Daily weather & work description for 7 days (D1 to D7)
  dailyLogs: [
    {
      dayNumber: 1,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 2,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 3,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 4,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 5,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 6,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
    {
      dayNumber: 7,
      dateStr: '',
      morning: 'sunny',
      afternoon: 'sunny',
      workDescription: '',
    },
  ],
  
  // Matrix Table for Labor
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
      name: 'กรรมกร',
      unit: 'คน',
      counts: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
  
  selectedMonth: '',
  monthlySummaryNarrative: '',
  monthlyDisbursementStatus: '',
  
  monthlyProgressLogs: [],
  
  milestones: [],
  milestoneNotes: '',

  materialTests: [],

  materialApprovals: [],
  materialNotes: '',

  obstacles: [],
};
