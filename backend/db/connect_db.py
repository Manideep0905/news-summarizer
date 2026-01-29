from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.config import settings
from models.user import User
from models.article import Article


# define a lifespan method for fastapi
@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_db_client(app)  # start the database connection
    yield

    await shutdown_db_client(app)  # close the database connection


# method for starting the mongodb connection
async def startup_db_client(app: FastAPI):
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    app.state.mongodb_client = client

    await init_beanie(
        database=client[settings.DB_NAME],
        document_models=[User, Article]
    )

    print("MongoDB connected")


# method for closing the mongodb connection
async def shutdown_db_client(app: FastAPI):
    app.state.mongodb_client.close()
    print("MongoDB disconnected")
