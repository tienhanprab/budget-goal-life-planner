import api from '@/lib/axios';
import { Goal, GoalCategory, GoalCreate, GoalSummary, GoalUpdate } from '@/types';

export const goalsApi = {
  list: (category?: GoalCategory) =>
    api
      .get<Goal[]>('/goals/', { params: category ? { category } : {} })
      .then((r) => r.data),

  summary: () => api.get<GoalSummary>('/goals/summary').then((r) => r.data),

  create: (data: GoalCreate) =>
    api.post<Goal>('/goals/', data).then((r) => r.data),

  update: (id: string, data: GoalUpdate) =>
    api.patch<Goal>(`/goals/${id}`, data).then((r) => r.data),

  updateSaved: (id: string, amount: number) =>
    api.patch<Goal>(`/goals/${id}/saved`, { amount }).then((r) => r.data),

  delete: (id: string) => api.delete(`/goals/${id}`),
};
