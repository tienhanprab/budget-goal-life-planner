import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from './api';
import { Goal, GoalCategory, GoalCreate, GoalUpdate } from '@/types';

const GOALS_KEY = (category?: GoalCategory) =>
  category ? ['goals', category] : ['goals'];

export function useGoals(category?: GoalCategory) {
  return useQuery({
    queryKey: GOALS_KEY(category),
    queryFn: () => goalsApi.list(category),
  });
}

export function useGoalSummary() {
  return useQuery({
    queryKey: ['goals', 'summary'],
    queryFn: () => goalsApi.summary(),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GoalCreate) => goalsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GoalUpdate }) =>
      goalsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['goals'] });
      const snapshots = qc.getQueriesData<Goal[]>({ queryKey: ['goals'] });
      qc.setQueriesData<Goal[]>({ queryKey: ['goals'] }, (old) =>
        old?.map((g) => (g.id === id ? { ...g, ...data } : g))
      );
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoalSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsApi.updateSaved(id, amount),
    onMutate: async ({ id, amount }) => {
      await qc.cancelQueries({ queryKey: ['goals'] });
      const snapshots = qc.getQueriesData<Goal[]>({ queryKey: ['goals'] });
      qc.setQueriesData<Goal[]>({ queryKey: ['goals'] }, (old) =>
        old?.map((g) => (g.id === id ? { ...g, saved: amount } : g))
      );
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['goals'] });
      const snapshots = qc.getQueriesData<Goal[]>({ queryKey: ['goals'] });
      qc.setQueriesData<Goal[]>({ queryKey: ['goals'] }, (old) =>
        old?.filter((g) => g.id !== id)
      );
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
