import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from datetime import datetime
import asyncio

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Helper function to parse data from MongoDB
def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if key in ['timestamp', 'created_at', 'updated_at'] and isinstance(value, str):
                item[key] = datetime.fromisoformat(value)
    return item

def handler(request):
    if request['method'] != 'GET':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Get sessions
        sessions = asyncio.run(
            db.chat_sessions.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
        )
        for session in sessions:
            session = parse_from_mongo(session)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(sessions, default=str)
        }
        
    except Exception as e:
        logging.error(f"Get sessions error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to get chat sessions'})
        }
