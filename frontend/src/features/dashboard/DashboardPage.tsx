import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import { useGoalSummary } from '@/features/goals/hooks';
import OverallProgressCard from './components/OverallProgressCard';
import StatsRow from './components/StatsRow';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { CategorySummary, GoalCategory } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary, isPending, isError } = useGoalSummary();

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="text-center py-16 text-gray-500">
        Failed to load dashboard. Please refresh.
      </div>
    );
  }

  const typedByCategory = summary.by_category.map((c) => ({
    ...c,
    category: c.category as GoalCategory,
  })) as CategorySummary[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-font text-3xl font-bold text-gray-800">
          Welcome back, {user?.display_name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's how you're doing across all your goals.</p>
      </div>

      {summary.total_goals === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <p className="text-6xl mb-4">🚀</p>
          <h2 className="heading-font text-2xl font-bold text-gray-800 mb-2">Ready to start?</h2>
          <p className="text-gray-500 mb-6">Create your first goal and begin tracking your progress.</p>
          <Link
            to="/goals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Create your first goal →
          </Link>
        </div>
      ) : (
        <>
          <OverallProgressCard summary={{ ...summary, by_category: typedByCategory }} />
          <div>
            <h2 className="heading-font text-xl font-bold text-gray-700 mb-4">By Category</h2>
            <StatsRow byCategory={typedByCategory} />
          </div>
          <div className="text-center py-6">
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-lg border border-purple-200">
              <p className="heading-font text-xl md:text-2xl font-bold text-gray-800 mb-2">
                "Small steps every day lead to big results."
              </p>
              <p className="text-4xl">🚀</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
