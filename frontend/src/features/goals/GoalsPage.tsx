import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Goal, GoalCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { useGoals } from './hooks';
import GoalCard from './GoalCard';
import GoalModal from './GoalModal';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

type ModalState =
  | { mode: 'create'; goal?: undefined }
  | { mode: 'edit'; goal: Goal }
  | { mode: 'update-saved'; goal: Goal }
  | null;

const CATEGORIES: GoalCategory[] = ['financial', 'career', 'personal_health'];

export default function GoalsPage() {
  const [activeCategory, setActiveCategory] = useState<GoalCategory>('financial');
  const [modal, setModal] = useState<ModalState>(null);

  const { data: goals, isPending, isError } = useGoals(activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span className="hidden sm:inline">{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="heading-font text-2xl font-bold text-gray-800">
            {CATEGORY_ICONS[activeCategory]} {CATEGORY_LABELS[activeCategory]} Goals
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {goals?.length ?? 0} goal{goals?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goal grid */}
      {isPending ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-gray-500">Failed to load goals. Please refresh.</div>
      ) : goals && goals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, i) => (
            <div key={goal.id} className="relative">
              <GoalCard
                goal={goal}
                index={i}
                onEdit={(g) => setModal({ mode: 'edit', goal: g })}
                onUpdateSaved={(g) => setModal({ mode: 'update-saved', goal: g })}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">{CATEGORY_ICONS[activeCategory]}</div>
          <h3 className="heading-font text-xl font-bold text-gray-700 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-6">Add your first {CATEGORY_LABELS[activeCategory].toLowerCase()} goal to get started.</p>
          <button
            onClick={() => setModal({ mode: 'create' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <GoalModal
          mode={modal.mode}
          goal={modal.goal}
          defaultCategory={activeCategory}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
