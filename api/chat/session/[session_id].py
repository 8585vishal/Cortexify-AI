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
    if request['method'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    session_id = request['query']['session_id']  # For dynamic, it's in query or path
    
    # For Vercel, the path parameters are in request['pathParameters'] or something.
    # Assuming it's in request['query']['session_id'] for simplicity, but actually for [session_id], it's in path.
    
    # From Vercel docs, for api/post/[id].py, the id is in request['query']['id']
    
    session_id = request['query'].get('session_id')
    if not session_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Session ID required'})
        }
    
    if request['method'] == 'GET':
        try:
            messages = asyncio.run(
                db.chat_messages.find(
                    {"session_id": session_id},
                    {"_id": 0}
                ).sort("timestamp", 1).to_list(1000)
            )
            
            for message in messages:
                message = parse_from_mongo(message)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps(messages, default=str)
            }
            
        except Exception as e:
            logging.error(f"Get chat history error: {str(e)}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to get chat history'})
            }
    
    elif request['method'] == 'DELETE':
        try:
            # Delete session and all related messages
            asyncio.run(db.chat_sessions.delete_one({"id": session_id}))
            asyncio.run(db.chat_messages.delete_many({"session_id": session_id}))
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({'message': 'Session deleted successfully'})
            }
        except Exception as e:
            logging.error(f"Delete session error: {str(e)}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to delete session'})
            }
    
    else:
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
