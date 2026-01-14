from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.config import settings


# define a lifespan method for fastapi
@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_db_client(app)  # start the database connection
    yield

    await shutdown_db_client(app)  # close the database connection


# method for starting the mongodb connection
async def startup_db_client(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    app.mongodb = app.mongodb_client.get_database(settings.DB_NAME)
    await app.mongodb["users"].create_index("email", unique=True)
    print("MongoDB connected")


# method for closing the mongodb connection
async def shutdown_db_client(app: FastAPI):
    app.mongodb_client.close()
    print("MongoDB disconnected")
