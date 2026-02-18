import uuid
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.goal import Goal, GoalCategory
from app.schemas.goal import GoalCreate, GoalUpdate, GoalSummary


async def get_goals(
    db: AsyncSession,
    user_id: uuid.UUID,
    category: Optional[GoalCategory] = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Goal]:
    stmt = select(Goal).where(Goal.user_id == user_id)
    if category:
        stmt = stmt.where(Goal.category == category)
    stmt = stmt.order_by(Goal.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_goal(db: AsyncSession, goal_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Goal]:
    stmt = select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_goal(db: AsyncSession, user_id: uuid.UUID, data: GoalCreate) -> Goal:
    goal = Goal(user_id=user_id, **data.model_dump())
    db.add(goal)
    await db.flush()
    await db.refresh(goal)
    return goal


async def update_goal(db: AsyncSession, goal: Goal, data: GoalUpdate) -> Goal:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    await db.flush()
    await db.refresh(goal)
    return goal


async def update_goal_saved(db: AsyncSession, goal: Goal, amount: float) -> Goal:
    goal.saved = min(amount, float(goal.target))
    await db.flush()
    await db.refresh(goal)
    return goal


async def delete_goal(db: AsyncSession, goal: Goal) -> None:
    await db.delete(goal)
    await db.flush()


async def get_summary(db: AsyncSession, user_id: uuid.UUID) -> GoalSummary:
    all_goals = await get_goals(db, user_id, limit=1000)

    total_saved = sum(float(g.saved) for g in all_goals)
    total_target = sum(float(g.target) for g in all_goals)
    goals_achieved = sum(1 for g in all_goals if float(g.saved) >= float(g.target))
    overall_progress = round((total_saved / total_target * 100) if total_target > 0 else 0, 1)

    by_category = []
    for cat in GoalCategory:
        cat_goals = [g for g in all_goals if g.category == cat]
        cat_saved = sum(float(g.saved) for g in cat_goals)
        cat_target = sum(float(g.target) for g in cat_goals)
        by_category.append({
            "category": cat.value,
            "total_saved": cat_saved,
            "total_target": cat_target,
            "progress": round((cat_saved / cat_target * 100) if cat_target > 0 else 0, 1),
            "count": len(cat_goals),
            "achieved": sum(1 for g in cat_goals if float(g.saved) >= float(g.target)),
        })

    return GoalSummary(
        total_saved=total_saved,
        total_target=total_target,
        overall_progress=overall_progress,
        goals_achieved=goals_achieved,
        total_goals=len(all_goals),
        by_category=by_category,
    )
