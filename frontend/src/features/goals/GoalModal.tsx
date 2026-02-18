import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Goal, GoalCategory, GoalColor, GoalCreate, GoalUpdate, CATEGORY_LABELS, COLOR_OPTIONS, ICON_OPTIONS } from '@/types';
import { getColor, formatCurrency } from './colorUtils';
import { useCreateGoal, useUpdateGoal, useUpdateGoalSaved } from './hooks';
import { useToast } from '@/shared/hooks/useToast';

type ModalMode = 'create' | 'edit' | 'update-saved';

interface Props {
  mode: ModalMode;
  goal?: Goal;
  defaultCategory?: GoalCategory;
  onClose: () => void;
}

export default function GoalModal({ mode, goal, defaultCategory = 'financial', onClose }: Props) {
  const [title, setTitle] = useState(goal?.title ?? '');
  const [target, setTarget] = useState(goal?.target?.toString() ?? '');
  const [savedAmount, setSavedAmount] = useState(goal?.saved?.toString() ?? '');
  const [icon, setIcon] = useState(goal?.icon ?? '🎯');
  const [color, setColor] = useState<GoalColor>(goal?.color ?? 'blue');
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? defaultCategory);
  const [description, setDescription] = useState(goal?.description ?? '');
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');

  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const updateSaved = useUpdateGoalSaved();
  const { showToast } = useToast();

  const isSubmitting = createGoal.isPending || updateGoal.isPending || updateSaved.isPending;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'update-saved') {
        await updateSaved.mutateAsync({ id: goal!.id, amount: parseFloat(savedAmount) });
        showToast('Amount updated', 'success');
      } else if (mode === 'edit') {
        const data: GoalUpdate = {
          title, icon, color, category,
          target: parseFloat(target),
          description: description || undefined,
          deadline: deadline || undefined,
        };
        await updateGoal.mutateAsync({ id: goal!.id, data });
        showToast('Goal updated', 'success');
      } else {
        const data: GoalCreate = {
          title, icon, color, category,
          target: parseFloat(target),
          saved: parseFloat(savedAmount) || 0,
          description: description || undefined,
          deadline: deadline || undefined,
        };
        await createGoal.mutateAsync(data);
        showToast('Goal created', 'success');
      }
      onClose();
    } catch {
      showToast('Something went wrong', 'error');
    }
  };

  const isUpdateSaved = mode === 'update-saved';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="heading-font text-xl font-bold text-gray-800">
            {mode === 'create' ? 'New Goal' : mode === 'edit' ? 'Edit Goal' : 'Update Amount'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isUpdateSaved && goal && (
          <div className="px-6 pt-4 text-center">
            <span className="text-4xl">{goal.icon}</span>
            <p className="font-semibold text-gray-800 mt-2">{goal.title}</p>
            <p className="text-sm text-gray-500">
              Current: {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isUpdateSaved && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="Goal title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target (฿)</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    required
                    min="0.01"
                    step="any"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Saved (฿)</label>
                  <input
                    type="number"
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                    min="0"
                    step="any"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors bg-white"
                >
                  {(Object.keys(CATEGORY_LABELS) as GoalCategory[]).map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${
                        icon === i ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full ${getColor(c, 'bg')} ring-offset-2 transition-all ${
                        color === c ? 'ring-2 ring-purple-500' : 'hover:scale-110'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors resize-none"
                  placeholder="Why this goal matters…"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Deadline <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
            </>
          )}

          {isUpdateSaved && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Amount (฿)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">฿</span>
                <input
                  type="number"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                  required
                  min="0"
                  max={goal?.target}
                  step="any"
                  className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-lg"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-60 ${
                isUpdateSaved && goal
                  ? `bg-gradient-to-r ${getColor(goal.color, 'gradient')}`
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}
            >
              {isSubmitting
                ? 'Saving…'
                : mode === 'create'
                ? 'Create Goal'
                : mode === 'edit'
                ? 'Save Changes'
                : 'Update Amount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
