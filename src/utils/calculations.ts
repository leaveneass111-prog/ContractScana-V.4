import { ContractProjectData, TaskRow, LaborMatrixRow } from '../types';

/**
 * Calculates remaining days from today or end date vs start date
 */
export function calculateRemainingDays(startDate: string, endDate: string): {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  timeProgressPct: number;
} {
  if (!startDate || !endDate) {
    return { totalDays: 0, elapsedDays: 0, remainingDays: 0, timeProgressPct: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { totalDays: 0, elapsedDays: 0, remainingDays: 0, timeProgressPct: 0 };
  }

  const oneDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / oneDay));
  
  // Calculate elapsed up to today or cap at total
  const elapsedDaysRaw = Math.round((now.getTime() - start.getTime()) / oneDay);
  const elapsedDays = Math.min(totalDays, Math.max(0, elapsedDaysRaw));
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  const timeProgressPct = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

  return {
    totalDays,
    elapsedDays,
    remainingDays,
    timeProgressPct: parseFloat(timeProgressPct.toFixed(2)),
  };
}

/**
 * Calculates task percentages and totals
 */
export function calculateTaskTotals(tasks: TaskRow[]) {
  const totalWeight = tasks.reduce((sum, t) => sum + (Number(t.ww) || 0), 0);
  const previousSum = tasks.reduce((sum, t) => sum + (Number(t.wp) || 0), 0);
  const currentSum = tasks.reduce((sum, t) => sum + (Number(t.wt) || 0), 0);
  const cumulativeSum = tasks.reduce((sum, t) => sum + ((Number(t.wp) || 0) + (Number(t.wt) || 0)), 0);

  return {
    totalWeight: parseFloat(totalWeight.toFixed(2)),
    previousSum: parseFloat(previousSum.toFixed(2)),
    currentSum: parseFloat(currentSum.toFixed(2)),
    cumulativeSum: parseFloat(cumulativeSum.toFixed(2)),
  };
}

/**
 * Calculates Labor Matrix daily totals across 7 days (SD1 to SD7)
 */
export function calculateLaborMatrixTotals(laborMatrix: LaborMatrixRow[]) {
  const dailyLaborTotals: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
  const dailyMachineTotals: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
  const dailyAllTotals: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];

  laborMatrix.forEach((row) => {
    row.counts.forEach((val, dayIdx) => {
      const num = Number(val) || 0;
      if (row.category === 'machine') {
        dailyMachineTotals[dayIdx] += num;
      } else {
        dailyLaborTotals[dayIdx] += num;
      }
      dailyAllTotals[dayIdx] += num;
    });
  });

  const grandLaborTotal = dailyLaborTotals.reduce((a, b) => a + b, 0);
  const grandMachineTotal = dailyMachineTotals.reduce((a, b) => a + b, 0);
  const grandAllTotal = dailyAllTotals.reduce((a, b) => a + b, 0);

  return {
    dailyLaborTotals,
    dailyMachineTotals,
    dailyAllTotals,
    grandLaborTotal,
    grandMachineTotal,
    grandAllTotal,
  };
}

/**
 * Calculates Page 1 auto-calculated summary grid
 */
export function calculateProjectSummary(project: ContractProjectData) {
  const taskTotals = calculateTaskTotals(project.weeklyTasks);
  const currentActualProgress = taskTotals.cumulativeSum;
  
  // Planned progress benchmark (can be dynamic or derived from time elapsed)
  const timeMetrics = calculateRemainingDays(project.startDate, project.endDate);
  const plannedProgress = Math.min(100, Math.round(timeMetrics.timeProgressPct * 0.95 * 10) / 10);
  const variance = parseFloat((currentActualProgress - plannedProgress).toFixed(2));
  
  const completedValue = (currentActualProgress / 100) * project.contractAmount;
  const remainingValue = project.contractAmount - completedValue;
  
  return {
    currentActualProgress,
    plannedProgress,
    variance,
    isAhead: variance >= 0,
    remainingDays: timeMetrics.remainingDays,
    totalDays: timeMetrics.totalDays,
    elapsedDays: timeMetrics.elapsedDays,
    timeProgressPct: timeMetrics.timeProgressPct,
    completedValue,
    remainingValue,
    disbursedPct: project.contractAmount > 0 
      ? parseFloat(((project.disbursedAmount / project.contractAmount) * 100).toFixed(1)) 
      : 0,
  };
}

/**
 * Format currency to Thai Baht
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
