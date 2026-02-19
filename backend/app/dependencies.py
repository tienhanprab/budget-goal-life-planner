import time
import uuid

from fastapi import Depends, HTTPException, Request, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.services.auth_service import decode_token, is_blacklisted


async def get_redis(request: Request) -> Redis:
    return request.app.state.redis


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> User:
    token = request.cookies.get("__session")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    jti = payload.get("jti")
    # Gracefully skip blacklist check if Redis is unavailable
    try:
        if jti and await is_blacklisted(jti, redis):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")
    except HTTPException:
        raise
    except Exception:
        pass  # Redis unavailable — treat token as not blacklisted

    # payload["sub"] is a string UUID; db.get() with UUID(as_uuid=True) requires uuid.UUID
    try:
        user_id = uuid.UUID(payload["sub"])
    except (ValueError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return user


async def rate_limit_auth(request: Request, redis: Redis = Depends(get_redis)) -> None:
    try:
        ip = request.client.host if request.client else "unknown"
        window = int(time.time() // 60)
        key = f"rate:auth:{ip}:{window}"
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, 60)
        if count > 10:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )
    except HTTPException:
        raise  # Always propagate 429
    except Exception:
        pass  # Redis unavailable — skip rate limiting, don't block the request
