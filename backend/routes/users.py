from fastapi import APIRouter, HTTPException, status, Depends, Request, Response
from bson import ObjectId, decode
from datetime import timedelta
from typing import Optional
from models.user import User
from beanie import PydanticObjectId
from beanie.odm.operators.find.logical import Or

from schemas.users import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    TokenRefreshRequest
)

from core.config import settings
from utils.auth import create_access_token, create_refresh_token, decode_token, verify_password, hash_password

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


def _user_dict_to_response(user_doc: User) -> UserResponse:
    return UserResponse(
        id=str(user_doc.id),
        email=user_doc.email,
        username=user_doc.username,
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    body: UserRegisterRequest
):
    
    # check if user already exists
    existing_user = await User.find_one(
        Or(User.email == body.email, User.username == body.username)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists"
        )

    user = User(
        first_name=body.first_name,
        last_name=body.last_name,
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
        refresh_token=None
    )

    await user.insert()

    return UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        message="User registered successfully"
    )


@router.post("/login")
async def login_user(
    body: UserLoginRequest,
    response: Response
):
    user = await User.find_one(
        Or(User.email == body.emailOrUsername, User.username == body.emailOrUsername)
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    # save the refresh token in the db, and give both access and refresh tokens to the user, usually in cookies
    user.refresh_token = refresh_token
    await user.save()

    cookie_options = {
        "httponly": True,
        "secure": False,
        "samesite": "lax",
        "path": "/"
    }

    response.set_cookie(
        key="access_token",
        value=access_token,
        **cookie_options
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        **cookie_options
    )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        message="User logged in successfully"
    )


@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response
):
    user = await get_current_user(request)

    # clear the refresh_token from the database.
    user.refresh_token = None
    await user.save()

    # clear the access and refresh tokens from the cookies.
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {
        "message": "User logged out successfully"
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    body: TokenRefreshRequest
):
    token = body.refresh_token

    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not a refresh token"
        )


    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    try:
        uid = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user id"
        )

    user_doc = await User.get(uid)
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


    # verify whether the user's provided refresh token matches with the refresh token stored in the database
    stored_refresh = user_doc.refresh_token
    if stored_refresh != token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalid"
        )


    # issue new access and refresh tokens
    new_access = create_access_token(subject=user_id)
    new_refresh = create_refresh_token(subject=user_id)

    user_doc.refresh_token = new_refresh
    await user_doc.save()

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


async def get_current_user(
    request: Request
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = decode_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


    try:
        uid = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user id"
        )

    user_doc = await User.get(uid)

    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user_doc


@router.get("/me", response_model=UserResponse)
async def read_me(
    user_doc = Depends(get_current_user)
):
    return _user_dict_to_response(user_doc)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: str
):
    try:
        uid = PydanticObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user id"
        )

    user_doc = await User.get(uid)
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    await user_doc.delete()
    
    return {"message": "User deleted"}
