from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
# from emergentintegrations.llm.chat import LlmChat

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize LLM Chat with Emergent LLM Key
# EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    sender: str  # 'user' or 'ai'
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatResponse(BaseModel):
    session_id: str
    ai_message: str
    user_message: str

# Helper function to prepare data for MongoDB
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

# Helper function to parse data from MongoDB
def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if key in ['timestamp', 'created_at', 'updated_at'] and isinstance(value, str):
                item[key] = datetime.fromisoformat(value)
    return item

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "CORTEXIFY API is running!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc = prepare_for_mongo(doc)
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        check = parse_from_mongo(check)
    
    return status_checks

from fastapi import Request

@api_router.post("/chat", response_model=ChatResponse)
async def send_chat_message(request: Request, input: ChatMessageCreate):
    try:
        # Create user message record
        user_message = ChatMessage(
            session_id=input.session_id,
            message=input.message,
            sender="user"
        )

        # Save user message to database
        user_doc = user_message.model_dump()
        user_doc = prepare_for_mongo(user_doc)
        await db.chat_messages.insert_one(user_doc)

        # Simulate AI response (since LLM integration is commented out)
        ai_response = f"Echo: {input.message}"

        # Create AI message record
        ai_message = ChatMessage(
            session_id=input.session_id,
            message=ai_response,
            sender="ai"
        )

        # Save AI message to database
        ai_doc = ai_message.model_dump()
        ai_doc = prepare_for_mongo(ai_doc)
        await db.chat_messages.insert_one(ai_doc)

        # Update or create session
        await update_or_create_session(input.session_id, input.message)

        return ChatResponse(
            session_id=input.session_id,
            ai_message=ai_response,
            user_message=input.message
        )

    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

@api_router.get("/chat/sessions", response_model=List[ChatSession])
async def get_chat_sessions():
    try:
        sessions = await db.chat_sessions.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
        for session in sessions:
            session = parse_from_mongo(session)
        return sessions
    except Exception as e:
        logging.error(f"Get sessions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get chat sessions")

@api_router.get("/chat/session/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str):
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id}, 
            {"_id": 0}
        ).sort("timestamp", 1).to_list(1000)
        
        for message in messages:
            message = parse_from_mongo(message)
        
        return messages
    except Exception as e:
        logging.error(f"Get chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get chat history")

@api_router.delete("/chat/session/{session_id}")
async def delete_chat_session(session_id: str):
    try:
        # Delete session and all related messages
        await db.chat_sessions.delete_one({"id": session_id})
        await db.chat_messages.delete_many({"session_id": session_id})
        return {"message": "Session deleted successfully"}
    except Exception as e:
        logging.error(f"Delete session error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

async def update_or_create_session(session_id: str, first_message: str):
    """Update existing session or create new one with auto-generated title"""
    try:
        existing_session = await db.chat_sessions.find_one({"id": session_id})
        
        if existing_session:
            # Update existing session
            update_doc = {
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.chat_sessions.update_one(
                {"id": session_id}, 
                {"$set": update_doc}
            )
        else:
            # Create new session with title based on first message
            title = first_message[:50] + "..." if len(first_message) > 50 else first_message
            session = ChatSession(
                id=session_id,
                title=title
            )
            
            session_doc = session.model_dump()
            session_doc = prepare_for_mongo(session_doc)
            await db.chat_sessions.insert_one(session_doc)
            
    except Exception as e:
        logging.error(f"Update/create session error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()