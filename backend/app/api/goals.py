import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.goal import GoalCategory
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalOut, GoalSummary, GoalUpdate, SavedAmountUpdate
from app.services import goal_service

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("/summary", response_model=GoalSummary)
async def get_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await goal_service.get_summary(db, current_user.id)


@router.get("/", response_model=list[GoalOut])
async def list_goals(
    category: Optional[GoalCategory] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await goal_service.get_goals(db, current_user.id, category, skip, limit)


@router.post("/", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
async def create_goal(
    body: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await goal_service.create_goal(db, current_user.id, body)


@router.get("/{goal_id}", response_model=GoalOut)
async def get_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = await goal_service.get_goal(db, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


@router.patch("/{goal_id}", response_model=GoalOut)
async def update_goal(
    goal_id: uuid.UUID,
    body: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = await goal_service.get_goal(db, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return await goal_service.update_goal(db, goal, body)


@router.patch("/{goal_id}/saved", response_model=GoalOut)
async def update_goal_saved(
    goal_id: uuid.UUID,
    body: SavedAmountUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = await goal_service.get_goal(db, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return await goal_service.update_goal_saved(db, goal, body.amount)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = await goal_service.get_goal(db, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    await goal_service.delete_goal(db, goal)
