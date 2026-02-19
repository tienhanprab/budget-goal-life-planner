import { GoalColor } from '@/types';

const colorMap: Record<GoalColor, Record<string, string>> = {
  emerald: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  blue: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-blue-600',
  },
  amber: {
    bg: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    gradient: 'from-amber-400 to-amber-600',
  },
  violet: {
    bg: 'bg-violet-500',
    lightBg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-200',
    gradient: 'from-violet-400 to-violet-600',
  },
  rose: {
    bg: 'bg-rose-500',
    lightBg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    gradient: 'from-rose-400 to-rose-600',
  },
  indigo: {
    bg: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  pink: {
    bg: 'bg-pink-500',
    lightBg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
    gradient: 'from-pink-400 to-pink-600',
  },
  teal: {
    bg: 'bg-teal-500',
    lightBg: 'bg-teal-50',
    text: 'text-teal-600',
    border: 'border-teal-200',
    gradient: 'from-teal-400 to-teal-600',
  },
};

export function getColor(color: GoalColor, type: string): string {
  return colorMap[color]?.[type] ?? colorMap.blue[type];
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `฿${formatted}`;
}

export function calcProgress(saved: number, target: number): number {
  return Math.min(Math.round((saved / target) * 100), 100);
}
