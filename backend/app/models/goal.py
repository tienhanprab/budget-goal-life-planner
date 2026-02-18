import uuid
import enum
from sqlalchemy import String, Numeric, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base, TimestampMixin


class GoalCategory(str, enum.Enum):
    financial = "financial"
    career = "career"
    personal_health = "personal_health"


class Goal(Base, TimestampMixin):
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    saved: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    icon: Mapped[str] = mapped_column(String(10), nullable=False, default="🎯")
    color: Mapped[str] = mapped_column(String(30), nullable=False, default="blue")
    category: Mapped[GoalCategory] = mapped_column(
        SAEnum(GoalCategory, name="goalcategory"),
        nullable=False,
        default=GoalCategory.financial,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    deadline: Mapped[str | None] = mapped_column(String(20), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="goals")
