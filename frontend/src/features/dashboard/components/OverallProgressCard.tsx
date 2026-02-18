import { TrendingUp, Check } from 'lucide-react';
import { GoalSummary } from '@/types';
import { formatCurrency } from '@/features/goals/colorUtils';

interface Props {
  summary: GoalSummary;
}

export default function OverallProgressCard({ summary }: Props) {
  const { total_saved, total_target, overall_progress, goals_achieved, total_goals } = summary;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 card-enter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="heading-font text-2xl font-bold text-gray-800 mb-1">Overall Progress</h2>
          <p className="text-gray-500 text-sm">Across all your goals</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
          <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(total_saved)}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
          <p className="text-blue-700 text-xs font-semibold uppercase tracking-wide mb-1">Total Target</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(total_target)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Progress</span>
          <span className="text-2xl font-bold heading-font bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {overall_progress}%
          </span>
        </div>
        <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full progress-bar relative"
            style={{ width: `${overall_progress}%` }}
          >
            <div className="absolute inset-0 shimmer-bg" />
          </div>
        </div>
        <div className="flex justify-center pt-1">
          <div className="bg-purple-100 rounded-full px-5 py-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-purple-600" />
            <span className="text-purple-900 font-semibold text-sm">
              {goals_achieved} / {total_goals} Goals Achieved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
