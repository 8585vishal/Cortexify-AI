import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timezone
import logging
import asyncio

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
            session = {
                "id": session_id,
                "title": title,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.chat_sessions.insert_one(session)
            
    except Exception as e:
        logging.error(f"Update/create session error: {str(e)}")

def handler(request):
    if request['method'] != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(request['body'])
        message = body.get('message')
        session_id = body.get('session_id') or str(uuid.uuid4())
        
        # Create user message record
        user_message = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "message": message,
            "sender": "user",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Save user message to database
        user_doc = prepare_for_mongo(user_message)
        asyncio.run(db.chat_messages.insert_one(user_doc))

        # Simulate AI response (since LLM integration is commented out)
        ai_response = f"Echo: {message}"

        # Create AI message record
        ai_message = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "message": ai_response,
            "sender": "ai",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        # Save AI message to database
        ai_doc = prepare_for_mongo(ai_message)
        asyncio.run(db.chat_messages.insert_one(ai_doc))

        # Update or create session
        asyncio.run(update_or_create_session(session_id, message))
        
        response = {
            "session_id": session_id,
            "ai_message": ai_response,
            "user_message": message
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(response)
        }
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Chat service error: {str(e)}'})
        }
