import uuid
from datetime import datetime, timedelta, timezone
from typing import Tuple

import bcrypt
from fastapi import Response
from jose import JWTError, jwt
from redis.asyncio import Redis

from app.config import settings

BLACKLIST_PREFIX = "blacklist:jti:"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def _create_token(user_id: str, token_type: str, expires_delta: timedelta) -> Tuple[str, str]:
    jti = str(uuid.uuid4())
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "sub": user_id,
        "type": token_type,
        "jti": jti,
        "exp": expire,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti


def create_access_token(user_id: str) -> Tuple[str, str]:
    return _create_token(
        user_id,
        "access",
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: str) -> Tuple[str, str]:
    return _create_token(
        user_id,
        "refresh",
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")


async def blacklist_token(jti: str, ttl_seconds: int, redis: Redis) -> None:
    await redis.setex(f"{BLACKLIST_PREFIX}{jti}", ttl_seconds, "1")


async def is_blacklisted(jti: str, redis: Redis) -> bool:
    result = await redis.get(f"{BLACKLIST_PREFIX}{jti}")
    return result is not None


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    is_prod = settings.is_production
    # Firebase Hosting only forwards the "__session" cookie to Cloud Run.
    # All other cookies are stripped from GET requests by the CDN.
    response.set_cookie(
        key="__session",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/v1/auth/refresh",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key="__session", path="/")
    response.delete_cookie(key="refresh_token", path="/api/v1/auth/refresh")
