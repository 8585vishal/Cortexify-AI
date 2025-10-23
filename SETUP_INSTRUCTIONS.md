# CORTEXIFY Chat Setup Instructions

## Quick Setup Guide

### 1. Configure Your OpenAI API Key

The chat functionality requires an OpenAI API key to work. Follow these steps:

#### Get Your API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-`)

#### Add API Key to Backend
1. Open `/backend/.env`
2. Replace `your_api_key_here` with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Backend Server

```bash
cd backend
python server.py
# or
uvicorn server:app --reload --port 5000
```

The backend will run on `http://localhost:5000`

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 5. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### 6. Test the Chat

1. Open your browser to `http://localhost:3000`
2. Navigate to the Chat page
3. Type a message and press Enter or click Send
4. You should see the AI response streaming in real-time

## Troubleshooting

### "Error: OpenAI API key not configured"
- Make sure you added your API key to `/backend/.env`
- Restart the backend server after adding the key

### Backend not starting
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is available
- Check the terminal for error messages

### Frontend not connecting to backend
- Make sure the backend is running on port 5000
- Check CORS settings in backend/.env
- Open browser console (F12) to see error messages

### Chat messages not appearing
- Check browser console for errors
- Make sure the backend is responding (visit http://localhost:5000/api/)
- Verify your OpenAI API key is valid and has credits

## API Key Security

⚠️ **IMPORTANT**: Never commit your `.env` file with real API keys to version control!

The `.env` file is already in `.gitignore` to prevent accidental commits.

## Features

- **Real-time Streaming**: Responses stream word-by-word for a natural conversation feel
- **Session Management**: Create multiple chat sessions and switch between them
- **Message History**: All conversations are saved locally in your browser
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Code Highlighting**: Automatic syntax highlighting for code blocks in responses

## Architecture

- **Frontend**: React with TailwindCSS and shadcn/ui components
- **Backend**: FastAPI with OpenAI GPT-3.5-turbo
- **Storage**: LocalStorage for frontend, MongoDB for backend (optional)
- **Streaming**: Server-Sent Events (SSE) for real-time responses
