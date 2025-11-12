from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from passlib.context import CryptContext
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from openai import OpenAI
from fastapi.responses import StreamingResponse
import json
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URI', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'cortexify')]

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-for-development')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# OpenAI API key
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Create the main app without a prefix
app = FastAPI(title="CORTEXIFY API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
# User Authentication Models
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    username: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

class OTPVerification(BaseModel):
    email: EmailStr
    otp: str

class OTPRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Chat Models
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
    user_id: str
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

# Authentication helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

async def get_user(email: str):
    user = await db.users.find_one({"email": email})
    if user:
        return User(**parse_from_mongo(user))
    return None

async def authenticate_user(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return User(**parse_from_mongo(user))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(email=email, user_id=user_id)
    except jwt.PyJWTError:
        raise credentials_exception
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return User(**parse_from_mongo(user))

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def send_email(recipient_email: str, subject: str, html_content: str):
    try:
        sender_email = os.environ.get("EMAIL_USER")
        sender_password = os.environ.get("EMAIL_PASS")
        
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = sender_email
        message["To"] = recipient_email
        
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message.as_string())
        return True
    except Exception as e:
        logging.error(f"Email sending error: {str(e)}")
        return False

# Authentication routes
@api_router.post("/auth/register", response_model=User)
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create new user
    new_user = User(
        email=user.email,
        username=user.username,
        is_active=True,
        is_verified=False
    )
    
    # Prepare user document for MongoDB
    user_doc = new_user.model_dump()
    user_doc["password"] = hashed_password
    user_doc = prepare_for_mongo(user_doc)
    
    # Generate OTP
    otp = generate_otp()
    user_doc["otp"] = otp
    user_doc["otp_created_at"] = datetime.now(timezone.utc).isoformat()
    
    # Insert user into database
    await db.users.insert_one(user_doc)
    
    # Send verification email
    email_subject = "CORTEXIFY - Verify Your Email"
    email_content = f"""
    <html>
    <body>
        <h2>Welcome to CORTEXIFY!</h2>
        <p>Your verification code is: <strong>{otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
    </body>
    </html>
    """
    await send_email(user.email, email_subject, email_content)
    
    return new_user

@api_router.post("/auth/verify-otp")
async def verify_otp(verification: OTPVerification):
    user = await db.users.find_one({"email": verification.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stored_otp = user.get("otp")
    otp_created_at = datetime.fromisoformat(user.get("otp_created_at"))
    
    # Check if OTP is expired (10 minutes)
    if datetime.now(timezone.utc) - otp_created_at > timedelta(minutes=10):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if stored_otp != verification.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Mark user as verified
    await db.users.update_one(
        {"email": verification.email},
        {"$set": {"is_verified": True, "otp": None, "otp_created_at": None}}
    )
    
    return {"message": "Email verified successfully"}

@api_router.post("/auth/login", response_model=Token)
async def login_for_access_token(form_data: UserLogin):
    user = await authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }

@api_router.post("/auth/request-otp")
async def request_otp(request: OTPRequest):
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate new OTP
    otp = generate_otp()
    
    # Update user with new OTP
    await db.users.update_one(
        {"email": request.email},
        {"$set": {
            "otp": otp,
            "otp_created_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Send OTP email
    email_subject = "CORTEXIFY - Your OTP Code"
    email_content = f"""
    <html>
    <body>
        <h2>CORTEXIFY - One-Time Password</h2>
        <p>Your verification code is: <strong>{otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
    </body>
    </html>
    """
    await send_email(request.email, email_subject, email_content)
    
    return {"message": "OTP sent successfully"}

@api_router.post("/auth/reset-password")
async def reset_password(reset_data: PasswordReset):
    user = await db.users.find_one({"email": reset_data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stored_otp = user.get("otp")
    otp_created_at = datetime.fromisoformat(user.get("otp_created_at"))
    
    # Check if OTP is expired (10 minutes)
    if datetime.now(timezone.utc) - otp_created_at > timedelta(minutes=10):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if stored_otp != reset_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Update password
    hashed_password = get_password_hash(reset_data.new_password)
    await db.users.update_one(
        {"email": reset_data.email},
        {"$set": {"password": hashed_password, "otp": None, "otp_created_at": None}}
    )
    
    return {"message": "Password reset successfully"}

@api_router.get("/auth/me", response_model=User)
async def get_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user

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

class ChatStreamRequest(BaseModel):
    history: List[Dict[str, str]]

async def stream_chat_response(history: List[Dict[str, str]]):
    try:
        if not openai_client:
            # Fallback mock response when no API key
            mock_response = "Hello! I'm CORTEXIFY, your AI assistant. How can I help you today?"
            for char in mock_response:
                yield f"data: {json.dumps({'token': char})}\n\n"
                await asyncio.sleep(0.05)
            yield "data: [DONE]\n\n"
            return

        messages = [{"role": "system", "content": "You are CORTEXIFY, a helpful AI assistant."}]
        messages.extend(history)

        stream = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            stream=True,
            temperature=0.7
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                token = chunk.choices[0].delta.content
                yield f"data: {json.dumps({'token': token})}\n\n"
                await asyncio.sleep(0.01)

        yield "data: [DONE]\n\n"

    except Exception as e:
        logging.error(f"OpenAI streaming error: {str(e)}")
        # Fallback mock response for errors
        mock_response = "I'm sorry, I encountered an error processing your request. Please try again."
        for char in mock_response:
            yield f"data: {json.dumps({'token': char})}\n\n"
            await asyncio.sleep(0.05)
        yield "data: [DONE]\n\n"

@api_router.post("/chat")
async def stream_chat(request: ChatStreamRequest):
    return StreamingResponse(
        stream_chat_response(request.history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@api_router.post("/chat/authenticated", response_model=ChatResponse)
async def send_chat_message(input: ChatMessageCreate, current_user: User = Depends(get_current_active_user)):
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

        # Call OpenAI API
        try:
            if not openai_client:
                raise Exception("OpenAI API key not configured")

            # Get previous messages for context
            previous_messages = await db.chat_messages.find(
                {"session_id": input.session_id},
                {"_id": 0}
            ).sort("timestamp", 1).to_list(20)

            messages = [{"role": "system", "content": "You are CORTEXIFY, a helpful AI assistant."}]
            for msg in previous_messages:
                role = "user" if msg["sender"] == "user" else "assistant"
                messages.append({"role": role, "content": msg["message"]})

            messages.append({"role": "user", "content": input.message})

            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7
            )

            ai_response = response.choices[0].message.content
        except Exception as e:
            logging.error(f"OpenAI API error: {str(e)}")
            ai_response = "I'm sorry, I encountered an error processing your request."

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
        await update_or_create_session(input.session_id, input.message, current_user.id)

        return ChatResponse(
            session_id=input.session_id,
            ai_message=ai_response,
            user_message=input.message
        )

    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

@api_router.get("/chat/sessions", response_model=List[ChatSession])
async def get_chat_sessions(current_user: User = Depends(get_current_active_user)):
    try:
        sessions = await db.chat_sessions.find(
            {"user_id": current_user.id}, 
            {"_id": 0}
        ).sort("updated_at", -1).to_list(100)
        
        for session in sessions:
            session = parse_from_mongo(session)
        return sessions
    except Exception as e:
        logging.error(f"Get sessions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get chat sessions")

@api_router.get("/chat/session/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str, current_user: User = Depends(get_current_active_user)):
    try:
        # Verify session belongs to user
        session = await db.chat_sessions.find_one({"id": session_id, "user_id": current_user.id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        
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
async def delete_chat_session(session_id: str, current_user: User = Depends(get_current_active_user)):
    try:
        # Verify session belongs to user
        session = await db.chat_sessions.find_one({"id": session_id, "user_id": current_user.id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
            
        # Delete session and all related messages
        await db.chat_sessions.delete_one({"id": session_id})
        await db.chat_messages.delete_many({"session_id": session_id})
        return {"message": "Session deleted successfully"}
    except Exception as e:
        logging.error(f"Delete session error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

async def update_or_create_session(session_id: str, first_message: str, user_id: str):
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
                user_id=user_id,
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