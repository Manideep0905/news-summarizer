from fastapi import APIRouter, HTTPException, status, Depends, Request, Response
from bson import ObjectId, decode
from datetime import timedelta
from typing import Optional

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


def _user_dict_to_response(user_doc) -> UserResponse:
    return UserResponse(id=str(user_doc["_id"]), email=user_doc["email"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    request: Request,
    body: UserRegisterRequest
):
    db = request.app.state.mongodb
    
    # check if user already exists
    existing = await db["users"].find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    hashed = hash_password(body.password)
    user_doc = {"email": body.email, "hashed_password": hashed, "refresh_token": None}
    result = await db["users"].insert_one(user_doc)
    user_id = str(result.inserted_id)

    return UserResponse(id=user_id, email=body.email)


@router.post("/login")
async def login_user(
    request: Request,
    body: UserLoginRequest,
    response: Response
):
    db = request.app.state.mongodb
    user_doc = await db["users"].find_one({"email": body.email})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(body.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_id = str(user_doc["_id"])
    access_token = create_access_token(subject=user_id)
    refresh_token = create_refresh_token(subject=user_id)

    # save the refresh token in the db, and give both access and refresh tokens to the user, usually in cookies
    await db["users"].update_one({"_id": user_doc["_id"]}, {"$set": {"refresh_token": refresh_token}})

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

    return {
        "message": "User logged in successfully",
        "user": {
            "id": user_id,
            "email": user_doc["email"]
        }
    }


@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response
):
    user = await get_current_user(request)

    db = request.app.state.mongodb
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"refresh_token": None}}
    )

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {
        "message": "User logged out successfully"
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    body: TokenRefreshRequest
):
    db = request.app.state.mongodb
    token = body.refresh_token

    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a refresh token")


    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")


    user_doc = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


    # verify whether the user's provided refresh token matches with the refresh token stored in the database
    stored_refresh = user_doc.get("refresh_token")
    if stored_refresh != token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalid")


    # issue new access and refresh tokens
    new_access = create_access_token(subject=user_id)
    new_refresh = create_refresh_token(subject=user_id)

    await db["users"].update_one({"_id": user_id}, {"$set": {"refresh_token": new_refresh}})

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


async def get_current_user(
    request: Request
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


    db = request.app.state.mongodb
    user_doc = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user_doc


@router.get("/me", response_model=UserResponse)
async def read_me(
    user_doc = Depends(get_current_user)
):
    return _user_dict_to_response(user_doc)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    request: Request,
    user_id: str
):
    db = request.app.state.mongodb
    res = await db["users"].delete_one({"_id": ObjectId(user_id)})
    
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {"message": "User deleted"}
