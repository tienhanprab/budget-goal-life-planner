export type GoalCategory = 'financial' | 'career' | 'personal_health';

export type GoalColor =
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'indigo'
  | 'pink'
  | 'teal';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target: number;
  saved: number;
  icon: string;
  color: GoalColor;
  category: GoalCategory;
  description?: string | null;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface CategorySummary {
  category: GoalCategory;
  total_saved: number;
  total_target: number;
  progress: number;
  count: number;
  achieved: number;
}

export interface GoalSummary {
  total_saved: number;
  total_target: number;
  overall_progress: number;
  goals_achieved: number;
  total_goals: number;
  by_category: CategorySummary[];
}

export interface GoalCreate {
  title: string;
  target: number;
  saved?: number;
  icon?: string;
  color?: GoalColor;
  category?: GoalCategory;
  description?: string;
  deadline?: string;
}

export interface GoalUpdate {
  title?: string;
  target?: number;
  saved?: number;
  icon?: string;
  color?: GoalColor;
  category?: GoalCategory;
  description?: string;
  deadline?: string;
}

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  financial: 'Financial',
  career: 'Career',
  personal_health: 'Personal & Health',
};

export const CATEGORY_ICONS: Record<GoalCategory, string> = {
  financial: '💰',
  career: '📈',
  personal_health: '🌿',
};

export const COLOR_OPTIONS: GoalColor[] = [
  'emerald', 'blue', 'amber', 'violet', 'rose', 'indigo', 'pink', 'teal',
];

export const ICON_OPTIONS = [
  '🎯', '💰', '🏍️', '💳', '🛡️', '🚗', '🏡', '📈', '💼',
  '🏋️', '📚', '✈️', '🎓', '🏥', '🌿', '🎸', '💻', '🎨',
];
