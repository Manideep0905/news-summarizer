from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegisterRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str


class UserLoginRequest(BaseModel):
    emailOrUsername: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    message: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(BaseModel):
    refresh_token: str
