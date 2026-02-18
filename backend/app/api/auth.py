from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, get_redis, rate_limit_auth
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, UserOut
from app.schemas.common import MessageResponse
from app.services.auth_service import (
    blacklist_token,
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    is_blacklisted,
    set_auth_cookies,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_auth),
):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=body.email,
        display_name=body.display_name,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    access_token, _ = create_access_token(str(user.id))
    refresh_token, _ = create_refresh_token(str(user.id))
    set_auth_cookies(response, access_token, refresh_token)

    return user


@router.post("/login", response_model=UserOut)
async def login(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_auth),
):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    access_token, _ = create_access_token(str(user.id))
    refresh_token, _ = create_refresh_token(str(user.id))
    set_auth_cookies(response, access_token, refresh_token)

    return user


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: Request,
    response: Response,
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    token = request.cookies.get("access_token")
    if token:
        try:
            payload = decode_token(token)
            jti = payload.get("jti")
            exp = payload.get("exp", 0)
            remaining = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
            if jti and remaining > 0:
                await blacklist_token(jti, remaining, redis)
        except ValueError:
            pass

    clear_auth_cookies(response)
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=MessageResponse)
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    redis=Depends(get_redis),
):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    jti = payload.get("jti")
    if jti and await is_blacklisted(jti, redis):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")

    user = await db.get(User, payload["sub"])
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    access_token, _ = create_access_token(str(user.id))
    refresh_token, _ = create_refresh_token(str(user.id))
    set_auth_cookies(response, access_token, refresh_token)

    return {"message": "Token refreshed"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
