# CORTEXIFY - Enterprise AI Chat Platform

A professional, production-ready AI chat application built with modern web technologies, featuring enterprise-grade authentication, real-time communication, and advanced chat management.

## Overview

CORTEXIFY is a sophisticated AI-powered chat platform designed for businesses and professionals. It combines cutting-edge AI capabilities with a polished, intuitive interface to deliver exceptional conversational experiences.

### Key Features

- **Advanced Authentication System** - Secure email/password authentication powered by Supabase
- **Real-Time Chat Interface** - Instant messaging with typing indicators and smooth animations
- **Session Management** - Organize conversations with folders, pinning, and archiving
- **Enterprise Database** - PostgreSQL with Row Level Security (RLS) for data protection
- **Usage Analytics** - Track token usage, costs, and conversation metrics
- **Responsive Design** - Beautiful UI that works seamlessly across all devices
- **Dark Mode Support** - Easy on the eyes with automatic theme switching
- **Export Functionality** - Download conversation history in JSON format
- **Search & Filter** - Quickly find past conversations
- **User Profiles** - Customizable profiles with avatars and preferences

## Technology Stack

### Frontend
- **React 19** - Latest React with improved performance
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide Icons** - Beautiful, consistent iconography
- **React Router** - Client-side routing

### Backend & Database
- **Supabase** - PostgreSQL database with built-in authentication
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live updates across clients

### AI Integration
- Ready for integration with OpenAI, Anthropic Claude, or other LLM providers
- Token tracking and usage analytics
- Configurable model selection

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account (already configured)

### Installation

1. **Backend setup**
   - Create `backend/.env` with:
     ```bash
     AI_API_KEY=your_openai_api_key_here
     OPENAI_MODEL=gpt-4o-mini
     PORT=5000
     CORS_ORIGIN=http://localhost:3000
     ```
   - Install and run backend:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
   - Health check: open `http://localhost:5000/api/health`

2. **Frontend setup**
   - Create `frontend/.env` with:
     ```bash
     REACT_APP_BACKEND_URL=http://localhost:5000
     ```
   - Install and run frontend:
     ```bash
     cd frontend
     npm install --legacy-peer-deps
     npm start
     ```
   - Open `http://localhost:3000`

3. **Build for Production (frontend)**
   ```bash
   npm run build
   ```

## Features Guide

### Authentication

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Access your existing account
3. **Password Reset**: Recover account via email
4. **Profile Management**: Update personal information

### Chat Interface

1. **Create New Chat**: Start a new conversation session
2. **Send Messages**: Type and send messages with Enter key
3. **View Responses**: See AI responses with typing indicators
4. **Session Management**: Switch between different conversations

### Organization

1. **Pin Sessions**: Keep important chats at the top
2. **Archive Sessions**: Hide completed conversations
3. **Search**: Find specific conversations quickly
4. **Folders**: Organize chats into custom folders

### Analytics

- Track usage and token consumption (optional modules)

## Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **profiles** - User information and preferences
- **chat_sessions** - Conversation sessions with metadata
- **chat_messages** - Individual messages with token tracking
- **folders** - Organization structure for sessions
- **shared_sessions** - Share conversations with others
- **usage_analytics** - Usage tracking and cost calculation
- **api_keys** - Programmatic API access
- **prompts_library** - Reusable prompt templates

All tables include Row Level Security policies to ensure data privacy.

## Security Features

- Secure authentication with Supabase Auth
- Row Level Security on all database tables
- Environment variable configuration
- Input sanitization and validation
- Encrypted data transmission

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with modern web technologies for professional use.

## Troubleshooting

- **No AI responses after setting the API key**
  - Ensure `backend/.env` exists and contains `AI_API_KEY`.
  - Restart both servers after changing env files.
  - Verify backend health at `http://localhost:5000/api/health`.
  - Test streaming manually:
    ```bash
    curl -N -H "Content-Type: application/json" \
      -d '{"history":[{"role":"user","content":"Hello"}]}' \
      http://localhost:5000/api/chat
    ```
  - Check console logs for `Missing AI_API_KEY` or upstream errors.

- **CORS errors**
  - Confirm `CORS_ORIGIN=http://localhost:3000` in `backend/.env`.
  - Confirm `REACT_APP_BACKEND_URL` in `frontend/.env` points to the backend.

- **Environment changes not applied**
  - Stop and re-run `npm start` (frontend) and `npm run dev` (backend).
  - For Create React App, env variables are loaded at start time.
