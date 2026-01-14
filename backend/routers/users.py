from fastapi import APIRouter, HTTPException
from schemas.users import UserRegisterRequest, UserLoginRequest, UserResponse
from main import app
from passlib.context import CryptContext

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


@router.post("/register", response_model=UserResponse)
async def register_user(
       request: UserRegisterRequest
):
    result = await app.mongodb["users"].insert_one(request.dict())