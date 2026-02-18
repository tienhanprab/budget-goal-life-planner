from pydantic import BaseModel, EmailStr, Field, UUID4
from datetime import datetime


class RegisterRequest(BaseModel):
    email: EmailStr
    display_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID4
    email: str
    display_name: str
    created_at: datetime

    model_config = {"from_attributes": True}
