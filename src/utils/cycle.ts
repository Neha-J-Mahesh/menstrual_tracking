import type { CyclePhase } from '../data/types';

export interface CycleInfo {
  phases: CyclePhase[];
  ovulationStart: string;
  ovulationEnd: string;
  fertileStart: string;
  fertileEnd: string;
  nextPeriodStart: string;
  cycleLength: number;
  periodLength: number;
  currentDay: number;
  currentPhase: CyclePhase | null;
}

const FALLBACK_DATE = () => new Date().toISOString().split('T')[0];

function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') return null;
  const d = new Date(dateStr.length === 10 ? dateStr + 'T00:00:00' : dateStr);
  if (isNaN(d.getTime())) return null;
  return d;
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  if (!d) return FALLBACK_DATE();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function daysBetween(start: string, end: string): number {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return 0;
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateCyclePhases(
  periodStart: string,
  periodEnd: string | null,
  cycleLength: number,
  periodLength: number,
  today: string = FALLBACK_DATE()
): CycleInfo {
  const safePeriodStart = parseDate(periodStart) ? periodStart : FALLBACK_DATE();
  const startDate = parseDate(safePeriodStart)!;
  const periodEndStr = periodEnd && parseDate(periodEnd) ? periodEnd : addDays(safePeriodStart, periodLength - 1);
  const nextPeriodStart = addDays(safePeriodStart, cycleLength);
  const ovulationDay = cycleLength - 14;
  const ovulationStart = addDays(safePeriodStart, ovulationDay - 2);
  const ovulationEnd = addDays(safePeriodStart, ovulationDay + 2);
  const fertileStart = addDays(safePeriodStart, ovulationDay - 5);
  const fertileEnd = addDays(safePeriodStart, ovulationDay + 2);

  const phases: CyclePhase[] = [
    {
      name: 'Menstrual',
      startDate: safePeriodStart,
      endDate: periodEndStr,
      dayCount: daysBetween(safePeriodStart, periodEndStr) + 1,
    },
    {
      name: 'Follicular',
      startDate: addDays(periodEndStr, 1),
      endDate: addDays(ovulationStart, -1),
      dayCount: daysBetween(addDays(periodEndStr, 1), addDays(ovulationStart, -1)) + 1,
    },
    {
      name: 'Ovulation',
      startDate: ovulationStart,
      endDate: ovulationEnd,
      dayCount: 5,
    },
    {
      name: 'Luteal',
      startDate: addDays(ovulationEnd, 1),
      endDate: addDays(nextPeriodStart, -1),
      dayCount: daysBetween(addDays(ovulationEnd, 1), addDays(nextPeriodStart, -1)) + 1,
    },
  ];

  const todayDate = parseDate(today) ?? new Date();
  const currentDay = daysBetween(safePeriodStart, today) + 1;

  let currentPhase: CyclePhase | null = null;
  for (const phase of phases) {
    const ps = parseDate(phase.startDate);
    const pe = parseDate(phase.endDate);
    if (ps && pe && todayDate >= ps && todayDate <= pe) {
      currentPhase = phase;
      break;
    }
  }

  if (currentDay > cycleLength) {
    currentPhase = phases[3];
  }

  void startDate;

  return {
    phases,
    ovulationStart,
    ovulationEnd,
    fertileStart,
    fertileEnd,
    nextPeriodStart,
    cycleLength,
    periodLength,
    currentDay: Math.max(1, currentDay),
    currentPhase,
  };
}

export function formatDate(dateStr: string | null | undefined): string {
  const d = parseDate(dateStr);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTodayStr(): string {
  return FALLBACK_DATE();
}
