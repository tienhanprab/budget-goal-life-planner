from pydantic import BaseModel, Field, UUID4
from datetime import datetime
from typing import Optional
from app.models.goal import GoalCategory


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    target: float = Field(..., gt=0)
    saved: float = Field(0, ge=0)
    icon: str = Field("🎯", max_length=10)
    color: str = Field("blue", max_length=30)
    category: GoalCategory = GoalCategory.financial
    description: Optional[str] = None
    deadline: Optional[str] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    target: Optional[float] = Field(None, gt=0)
    saved: Optional[float] = Field(None, ge=0)
    icon: Optional[str] = Field(None, max_length=10)
    color: Optional[str] = Field(None, max_length=30)
    category: Optional[GoalCategory] = None
    description: Optional[str] = None
    deadline: Optional[str] = None


class SavedAmountUpdate(BaseModel):
    amount: float = Field(..., ge=0)


class GoalOut(BaseModel):
    id: UUID4
    user_id: UUID4
    title: str
    target: float
    saved: float
    icon: str
    color: str
    category: GoalCategory
    description: Optional[str]
    deadline: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GoalSummary(BaseModel):
    total_saved: float
    total_target: float
    overall_progress: float
    goals_achieved: int
    total_goals: int
    by_category: list[dict]
