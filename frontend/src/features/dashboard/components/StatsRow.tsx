import { Link } from 'react-router-dom';
import { CategorySummary, GoalCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { formatCurrency } from '@/features/goals/colorUtils';

interface Props {
  byCategory: CategorySummary[];
}

const categoryColors: Record<GoalCategory, string> = {
  financial: 'from-emerald-400 to-emerald-600',
  career: 'from-blue-400 to-blue-600',
  personal_health: 'from-violet-400 to-violet-600',
};

export default function StatsRow({ byCategory }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {byCategory.map((cat) => {
        const key = cat.category as GoalCategory;
        return (
          <Link
            key={key}
            to="/goals"
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow card-enter block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`bg-gradient-to-br ${categoryColors[key]} p-2.5 rounded-xl text-xl leading-none`}>
                {CATEGORY_ICONS[key]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{CATEGORY_LABELS[key]}</p>
                <p className="text-xs text-gray-400">{cat.count} goals</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Saved</span>
                <span className="font-bold text-gray-800">{formatCurrency(cat.total_saved)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${categoryColors[key]} rounded-full progress-bar`}
                  style={{ width: `${cat.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{cat.progress}% complete</span>
                <span>{cat.achieved}/{cat.count} done</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
