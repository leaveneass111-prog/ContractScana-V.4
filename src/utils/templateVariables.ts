import { ContractProjectData, TaskRow, LaborMatrixRow, DailyLogEntry } from '../types';
import { calculateLaborMatrixTotals, calculateRemainingDays, formatCurrency } from './calculations';

/**
 * Converts Arabic numbers to Thai numerals (0-9 -> ๐-๙)
 */
export const toThaiDigits = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return val.toString().replace(/[0-9]/g, (d) => thaiDigits[parseInt(d, 10)]);
};

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

/**
 * Formats a Date or ISO date string to full Thai date (e.g., "14 สิงหาคม 2567")
 */
export const formatThaiDateFull = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    // If it's already a thai string or custom text
    return typeof dateInput === 'string' ? dateInput : '';
  }
  const day = d.getDate();
  const month = THAI_MONTHS_FULL[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

/**
 * Formats a Date or ISO date string to short Thai date with 2-digit Buddhist year (e.g., "14 ส.ค. 67")
 */
export const formatThaiDateShort = (dateInput?: string | Date): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return typeof dateInput === 'string' ? dateInput : '';
  }
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const yearShort = (d.getFullYear() + 543) % 100;
  const yearStr = yearShort.toString().padStart(2, '0');
  return `${day} ${month} ${yearStr}`;
};

/**
 * Calculates the next Monday after the given end date for R_DATE (REPORT_DATE)
 */
export const calculateReportDateNextMonday = (periodEndDateStr?: string): string => {
  if (!periodEndDateStr) return '';
  const end = new Date(periodEndDateStr);
  if (isNaN(end.getTime())) return '';
  
  // Calculate days until next Monday (1 = Monday, 0 = Sunday)
  const currentDayOfWeek = end.getDay();
  let daysToAdd = 1; // Default next day
  if (currentDayOfWeek === 0) { // Sunday -> Monday is +1
    daysToAdd = 1;
  } else if (currentDayOfWeek === 1) { // Monday -> next Monday is +7
    daysToAdd = 7;
  } else {
    // Tuesday (2) -> +6, Wednesday (3) -> +5, Thursday (4) -> +4, Friday (5) -> +3, Saturday (6) -> +2
    daysToAdd = (8 - currentDayOfWeek) % 7 || 7;
  }

  const nextMonday = new Date(end);
  nextMonday.setDate(end.getDate() + daysToAdd);
  return formatThaiDateFull(nextMonday);
};

export interface LaborRowTemplateItem {
  category: string;
  d1: number | string;
  d2: number | string;
  d3: number | string;
  d4: number | string;
  d5: number | string;
  d6: number | string;
  d7: number | string;
  total: number;
}

export interface ContractScanTemplateVariables {
  // Page 1 Variables & Aliases
  DOC_NO: string;
  R_DATE: string;
  REPORT_DATE: string;
  WEEK: number | string;
  WEEK_NO: number | string;
  START: string;
  START_DATE: string;
  END: string;
  END_DATE: string;
  PROJECT: string;
  PROJECT_NAME: string;
  LOCATION: string;
  QTY: string;
  QUANTITY: string;
  C_NO: string;
  CONTRACT_NO: string;
  C_DATE: string;
  CONTRACT_DATE: string;
  C_END: string;
  CONTRACT_END_DATE: string;
  DAYS: number | string;
  TOTAL_DAYS: number | string;
  COST: string;
  CONSTRUCTION_COST: string;
  COST_NUMBER: number;
  FINE: string;
  FINE_PER_DAY: string;
  FINE_NUMBER: number;
  CONTRACTOR: string;
  CONTRACTOR_NAME: string;
  REMAIN: number | string;
  REMAIN_DAYS: number | string;
  BUDGET: string;
  TOTAL_BUDGET: string;
  SUP_NAME: string;
  SUPERVISOR_NAME: string;
  SUP_POS: string;
  SUPERVISOR_POSITION: string;
  COM_P_NAME: string;
  COMMITTEE_PRESIDENT_NAME: string;
  COM_P_POS: string;
  COMMITTEE_PRESIDENT_POSITION: string;
  COM_1_NAME: string;
  COMMITTEE_1_NAME: string;
  COM_1_POS: string;
  COMMITTEE_1_POSITION: string;
  COM_2_NAME: string;
  COMMITTEE_2_NAME: string;
  COM_2_POS: string;
  COMMITTEE_2_POSITION: string;
  REP_1: string;
  REP_2: string;

  // Page 2 Variables (Single-row weekly work summary)
  WN: number | string;
  WD: string;
  WW: number | string;
  WP: number | string;
  WT: number | string;
  WC: number | string;
  WR: number | string;

  // Page 3 Variables: Daily Dates D1..D7, Short Dates SD1..SD7, Descriptions, Weather
  D1: string;
  D2: string;
  D3: string;
  D4: string;
  D5: string;
  D6: string;
  D7: string;
  Date_1: string;
  Date_2: string;
  Date_3: string;
  Date_4: string;
  Date_5: string;
  Date_6: string;
  Date_7: string;

  SD1: string;
  SD2: string;
  SD3: string;
  SD4: string;
  SD5: string;
  SD6: string;
  SD7: string;
  ShortDate_1: string;
  ShortDate_2: string;
  ShortDate_3: string;
  ShortDate_4: string;
  ShortDate_5: string;
  ShortDate_6: string;
  ShortDate_7: string;

  DAY_DESC_1: string;
  DAY_DESC_2: string;
  DAY_DESC_3: string;
  DAY_DESC_4: string;
  DAY_DESC_5: string;
  DAY_DESC_6: string;
  DAY_DESC_7: string;

  W_A1: string;
  W_A2: string;
  W_A3: string;
  W_A4: string;
  W_A5: string;
  W_A6: string;
  W_A7: string;
  W_P1: string;
  W_P2: string;
  W_P3: string;
  W_P4: string;
  W_P5: string;
  W_P6: string;
  W_P7: string;

  // Labor table loop & totals
  laborRows: LaborRowTemplateItem[];
  LABOR_TOTAL_1: number;
  LABOR_TOTAL_2: number;
  LABOR_TOTAL_3: number;
  LABOR_TOTAL_4: number;
  LABOR_TOTAL_5: number;
  LABOR_TOTAL_6: number;
  LABOR_TOTAL_7: number;
  LABOR_GRAND_TOTAL: number;

  // UI-only and helper fields
  CURRENT_PCT: number | string;
  [key: string]: any;
}

const translateWeatherToThai = (val?: string): string => {
  if (!val) return 'แจ่มใส';
  const lower = val.toLowerCase();
  if (lower === 'sunny' || lower === 'clear') return 'แจ่มใส';
  if (lower === 'rain' || lower === 'rainy') return 'ฝนตก';
  if (lower === 'heavy_rain') return 'ฝนตกหนัก';
  if (lower === 'cloudy' || lower === 'overcast') return 'ครึ้มฟ้าครึ้มฝน';
  if (lower === 'storm') return 'พายุฝน';
  return val;
};

/**
 * Builds the complete ContractScan template variable map from project data
 */
export function buildTemplateVariables(project: ContractProjectData): ContractScanTemplateVariables {
  const timeMetrics = calculateRemainingDays(project.startDate, project.endDate);
  const laborTotals = calculateLaborMatrixTotals(project.laborMatrix);

  // 1. Compute Page 2 Values (Weekly Tasks)
  // Derive week summary: First check weeklyProgressLogs or weeklyTasks
  const weeklyLog = (project.weeklyProgressLogs && project.weeklyProgressLogs.length > 0)
    ? project.weeklyProgressLogs[project.weeklyProgressLogs.length - 1]
    : undefined;
  
  const weeklyTask = (project.weeklyTasks && project.weeklyTasks.length > 0)
    ? project.weeklyTasks[project.weeklyTasks.length - 1]
    : undefined;

  const weekNo = project.reportWeekNo || weeklyTask?.wn || 1;

  // 2. Build Daily Dates D1..D7 & Short Dates SD1..SD7 & Daily Descriptions
  const dailyDates: string[] = ['', '', '', '', '', '', ''];
  const shortDates: string[] = ['', '', '', '', '', '', ''];
  const dayDescriptions: string[] = ['', '', '', '', '', '', ''];
  const weatherMorning: string[] = ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];
  const weatherAfternoon: string[] = ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];

  const startDateObj = project.periodStart ? new Date(project.periodStart) : null;

  for (let i = 0; i < 7; i++) {
    const logItem = project.dailyLogs?.[i];
    let dateObj: Date | null = null;

    if (logItem?.dateStr && !isNaN(new Date(logItem.dateStr).getTime())) {
      dateObj = new Date(logItem.dateStr);
    } else if (startDateObj && !isNaN(startDateObj.getTime())) {
      dateObj = new Date(startDateObj);
      dateObj.setDate(startDateObj.getDate() + i);
    }

    if (dateObj && !isNaN(dateObj.getTime())) {
      dailyDates[i] = formatThaiDateFull(dateObj);
      shortDates[i] = formatThaiDateShort(dateObj);
    } else if (logItem?.dateStr) {
      dailyDates[i] = logItem.dateStr;
      shortDates[i] = logItem.dateStr;
    }

    // Daily work descriptions: default to "ไม่ปฏิบัติงาน" if blank
    const rawDesc = logItem?.workDescription?.trim();
    dayDescriptions[i] = rawDesc || 'ไม่ปฏิบัติงาน';

    // Weather morning and afternoon
    weatherMorning[i] = translateWeatherToThai(logItem?.morning);
    weatherAfternoon[i] = translateWeatherToThai(logItem?.afternoon);
  }

  // 3. Build WD: Combine DAY_DESC_1..DAY_DESC_7 into bulleted lines separated by \n
  const validDailyBullets: string[] = [];
  dayDescriptions.forEach((desc, idx) => {
    if (desc && desc !== 'ไม่ปฏิบัติงาน') {
      const datePrefix = shortDates[idx] || `วันที่ ${idx + 1}`;
      validDailyBullets.push(`- ${datePrefix}: ${desc}`);
    }
  });

  const combinedWD = validDailyBullets.length > 0
    ? validDailyBullets.join('\n')
    : (weeklyLog?.activitiesText || weeklyTask?.wd || 'ดำเนินงานตามแผนงานประจำสัปดาห์');

  // Work progress values
  const ww = Number(weeklyLog?.weightPct ?? weeklyTask?.ww ?? 0);
  const wp = Number(weeklyLog?.prevWeekPct ?? weeklyTask?.wp ?? 0);
  const wt = Number(weeklyLog?.inWeekPct ?? weeklyTask?.wt ?? ww);
  const wc = Number(weeklyLog?.accumulatedPct ?? weeklyTask?.wc ?? (wp + wt));
  const wr = Number(weeklyLog?.totalWorkPct ?? weeklyTask?.wr ?? wc);

  // 4. Labor Rows Loop Preparation
  const laborRows: LaborRowTemplateItem[] = project.laborMatrix.map((row) => ({
    category: row.name || (row.category === 'supervision' ? 'หัวหน้าคนงาน / โฟร์แมน' : 'กรรมกร'),
    d1: row.counts[0] ?? 0,
    d2: row.counts[1] ?? 0,
    d3: row.counts[2] ?? 0,
    d4: row.counts[3] ?? 0,
    d5: row.counts[4] ?? 0,
    d6: row.counts[5] ?? 0,
    d7: row.counts[6] ?? 0,
    total: row.counts.reduce((a, b) => a + (Number(b) || 0), 0),
  }));

  // Quantity / QTY
  const quantity = project.scopeSummary || 
    (project.dimensionArea ? `พื้นที่ ${project.dimensionArea} ตร.ม.` : '') ||
    (project.dimensionLength ? `ยาว ${project.dimensionLength} ม.` : '');

  // Report Date (Next Monday)
  const reportDateNextMonday = calculateReportDateNextMonday(project.periodEnd || project.endDate);
  const reportDate = reportDateNextMonday || formatThaiDateFull(project.docDate) || '';

  // Formatted numeric strings
  const costFormatted = formatCurrency(project.contractAmount);
  const fineFormatted = formatCurrency(project.dailyPenaltyRate);
  const budgetFormatted = formatCurrency(project.totalBudget || project.contractAmount);

  // Remaining days: DAYS - elapsedDays
  const totalDays = project.totalDurationDays || timeMetrics.totalDays || 0;
  const remainingDays = timeMetrics.remainingDays;

  return {
    // Page 1 Variables & Aliases
    DOC_NO: project.docNumber || '',
    R_DATE: reportDate,
    REPORT_DATE: reportDate,
    WEEK: weekNo,
    WEEK_NO: weekNo,
    START: formatThaiDateFull(project.periodStart || project.startDate),
    START_DATE: formatThaiDateFull(project.periodStart || project.startDate),
    END: formatThaiDateFull(project.periodEnd || project.endDate),
    END_DATE: formatThaiDateFull(project.periodEnd || project.endDate),
    PROJECT: project.projectName || '',
    PROJECT_NAME: project.projectName || '',
    LOCATION: project.location || '',
    QTY: quantity,
    QUANTITY: quantity,
    C_NO: project.contractNumber || '',
    CONTRACT_NO: project.contractNumber || '',
    C_DATE: formatThaiDateFull(project.contractDate) || project.contractDate || '',
    CONTRACT_DATE: formatThaiDateFull(project.contractDate) || project.contractDate || '',
    C_END: formatThaiDateFull(project.endDate) || project.endDate || '',
    CONTRACT_END_DATE: formatThaiDateFull(project.endDate) || project.endDate || '',
    DAYS: totalDays,
    TOTAL_DAYS: totalDays,
    COST: costFormatted,
    CONSTRUCTION_COST: costFormatted,
    COST_NUMBER: project.contractAmount,
    FINE: fineFormatted,
    FINE_PER_DAY: fineFormatted,
    FINE_NUMBER: project.dailyPenaltyRate,
    CONTRACTOR: project.contractorName || '',
    CONTRACTOR_NAME: project.contractorName || '',
    REMAIN: remainingDays,
    REMAIN_DAYS: remainingDays,
    BUDGET: budgetFormatted,
    TOTAL_BUDGET: budgetFormatted,

    // Signatories
    SUP_NAME: project.signatories?.supervisor?.name || '',
    SUPERVISOR_NAME: project.signatories?.supervisor?.name || '',
    SUP_POS: project.signatories?.supervisor?.position || '',
    SUPERVISOR_POSITION: project.signatories?.supervisor?.position || '',
    COM_P_NAME: project.signatories?.committeeChair?.name || '',
    COMMITTEE_PRESIDENT_NAME: project.signatories?.committeeChair?.name || '',
    COM_P_POS: project.signatories?.committeeChair?.position || '',
    COMMITTEE_PRESIDENT_POSITION: project.signatories?.committeeChair?.position || '',
    COM_1_NAME: project.signatories?.committeeMember1?.name || '',
    COMMITTEE_1_NAME: project.signatories?.committeeMember1?.name || '',
    COM_1_POS: project.signatories?.committeeMember1?.position || '',
    COMMITTEE_1_POSITION: project.signatories?.committeeMember1?.position || '',
    COM_2_NAME: project.signatories?.committeeMember2?.name || '',
    COMMITTEE_2_NAME: project.signatories?.committeeMember2?.name || '',
    COM_2_POS: project.signatories?.committeeMember2?.position || '',
    COMMITTEE_2_POSITION: project.signatories?.committeeMember2?.position || '',
    REP_1: project.contractorRep1 || '',
    REP_2: project.contractorRep2 || '',

    // Page 2: Single-row table variables
    WN: weekNo,
    WD: combinedWD,
    WW: ww,
    WP: wp,
    WT: wt,
    WC: wc,
    WR: wr,

    // Page 3: Daily dates D1..D7
    D1: dailyDates[0],
    D2: dailyDates[1],
    D3: dailyDates[2],
    D4: dailyDates[3],
    D5: dailyDates[4],
    D6: dailyDates[5],
    D7: dailyDates[6],
    Date_1: dailyDates[0],
    Date_2: dailyDates[1],
    Date_3: dailyDates[2],
    Date_4: dailyDates[3],
    Date_5: dailyDates[4],
    Date_6: dailyDates[5],
    Date_7: dailyDates[6],

    // Short dates SD1..SD7
    SD1: shortDates[0],
    SD2: shortDates[1],
    SD3: shortDates[2],
    SD4: shortDates[3],
    SD5: shortDates[4],
    SD6: shortDates[5],
    SD7: shortDates[6],
    ShortDate_1: shortDates[0],
    ShortDate_2: shortDates[1],
    ShortDate_3: shortDates[2],
    ShortDate_4: shortDates[3],
    ShortDate_5: shortDates[4],
    ShortDate_6: shortDates[5],
    ShortDate_7: shortDates[6],

    // Daily work descriptions
    DAY_DESC_1: dayDescriptions[0],
    DAY_DESC_2: dayDescriptions[1],
    DAY_DESC_3: dayDescriptions[2],
    DAY_DESC_4: dayDescriptions[3],
    DAY_DESC_5: dayDescriptions[4],
    DAY_DESC_6: dayDescriptions[5],
    DAY_DESC_7: dayDescriptions[6],

    // Weather morning & afternoon
    W_A1: weatherMorning[0],
    W_A2: weatherMorning[1],
    W_A3: weatherMorning[2],
    W_A4: weatherMorning[3],
    W_A5: weatherMorning[4],
    W_A6: weatherMorning[5],
    W_A7: weatherMorning[6],
    W_P1: weatherAfternoon[0],
    W_P2: weatherAfternoon[1],
    W_P3: weatherAfternoon[2],
    W_P4: weatherAfternoon[3],
    W_P5: weatherAfternoon[4],
    W_P6: weatherAfternoon[5],
    W_P7: weatherAfternoon[6],

    // Labor rows loop & totals
    laborRows,
    LABOR_TOTAL_1: laborTotals.dailyLaborTotals[0],
    LABOR_TOTAL_2: laborTotals.dailyLaborTotals[1],
    LABOR_TOTAL_3: laborTotals.dailyLaborTotals[2],
    LABOR_TOTAL_4: laborTotals.dailyLaborTotals[3],
    LABOR_TOTAL_5: laborTotals.dailyLaborTotals[4],
    LABOR_TOTAL_6: laborTotals.dailyLaborTotals[5],
    LABOR_TOTAL_7: laborTotals.dailyLaborTotals[6],
    LABOR_GRAND_TOTAL: laborTotals.grandLaborTotal,

    // UI-only
    CURRENT_PCT: wc,
  };
}
