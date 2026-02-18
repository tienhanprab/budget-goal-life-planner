import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { Goal } from '@/types';
import { getColor, formatCurrency, calcProgress } from './colorUtils';
import { useDeleteGoal } from './hooks';
import { useToast } from '@/shared/hooks/useToast';

interface Props {
  goal: Goal;
  index: number;
  onEdit: (goal: Goal) => void;
  onUpdateSaved: (goal: Goal) => void;
}

export default function GoalCard({ goal, index, onEdit, onUpdateSaved }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteGoal = useDeleteGoal();
  const { showToast } = useToast();

  const progress = calcProgress(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;
  const isComplete = progress >= 100;

  const handleDelete = async () => {
    try {
      await deleteGoal.mutateAsync(goal.id);
      showToast('Goal deleted', 'success');
    } catch {
      showToast('Failed to delete goal', 'error');
    }
    setConfirmDelete(false);
  };

  return (
    <article
      className="w-full bg-white rounded-2xl shadow-lg overflow-hidden card-enter"
      style={{
        animationDelay: `${index * 80}ms`,
        border: isComplete ? '2px solid rgb(34,197,94)' : '2px solid transparent',
      }}
    >
      {/* Card header */}
      <div className={`${getColor(goal.color, 'lightBg')} p-5 border-b ${getColor(goal.color, 'border')}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{goal.icon}</span>
            {isComplete && (
              <span className="bg-emerald-500 text-white rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`${getColor(goal.color, 'bg')} text-white px-2.5 py-0.5 rounded-full text-xs font-bold`}>
              {progress}%
            </span>
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
              title="Edit goal"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Delete goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <h4 className="font-bold text-base text-gray-800 leading-tight">{goal.title}</h4>
        {goal.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{goal.description}</p>
        )}
        <p className={`text-sm font-semibold mt-1 ${getColor(goal.color, 'text')}`}>
          Target: {formatCurrency(goal.target)}
        </p>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="mb-3">
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getColor(goal.color, 'gradient')} rounded-full progress-bar`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Saved</span>
          <span className="font-bold text-gray-900">{formatCurrency(goal.saved)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-500">Remaining</span>
          <span className="font-bold text-gray-900">{formatCurrency(Math.max(remaining, 0))}</span>
        </div>
        {goal.deadline && (
          <p className="text-xs text-gray-400 mb-3">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </p>
        )}
        <button
          onClick={() => onUpdateSaved(goal)}
          className={`w-full py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r ${getColor(goal.color, 'gradient')} hover:opacity-90 transition-opacity`}
        >
          Update Amount
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 rounded-2xl z-10">
          <Trash2 className="w-8 h-8 text-rose-500 mb-3" />
          <p className="font-semibold text-gray-800 text-center mb-1">Delete this goal?</p>
          <p className="text-sm text-gray-500 text-center mb-4">This cannot be undone.</p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteGoal.isPending}
              className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
            >
              {deleteGoal.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
