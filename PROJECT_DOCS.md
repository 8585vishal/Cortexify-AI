
# CORTEXIFY - Technical Documentation

## 1. Executive Overview
**CORTEXIFY** is a state-of-the-art, production-grade web application designed to replicate and enhance the experience of modern Large Language Model (LLM) interfaces. Built with a focus on performance, aesthetics, and user experience, it serves as a robust platform for intelligent, multimodal conversation.

Powered by Google's **Gemini 2.5 Flash** and **Gemini 3 Pro** models, CORTEXIFY offers features like real-time streaming, code execution simulation, document analysis, and a unique "Assumption Extractor" mode.

## 2. About the Creator

### **Vishal Raj Purohit**
*Lead Architect & Full-Stack Engineer*

CORTEXIFY was conceptualized, designed, and engineered by **Vishal Raj Purohit**. 
Vishal is a visionary developer passionate about bridging the gap between complex artificial intelligence systems and intuitive human-computer interaction. His work on CORTEXIFY demonstrates deep expertise in:
*   **Frontend Architecture:** crafting responsive, high-performance interfaces with React and TypeScript.
*   **AI Integration:** leveraging advanced SDKs to build context-aware, multimodal agents.
*   **UI/UX Design:** implementing modern design systems like Glassmorphism for engaging user experiences.

## 3. Technology Stack & Architecture

### Core Framework
*   **Runtime:** React 19 (Experimental/Latest)
*   **Language:** TypeScript 5.0+ (Strict Mode enabled)
*   **Build Tool:** Vite (ESBuild based) for instant HMR and optimized bundling.

### Artificial Intelligence Engine
*   **Provider:** Google GenAI SDK (`@google/genai` v1.27.0)
*   **Standard Model:** `gemini-2.5-flash` (Optimized for latency and throughput).
*   **Thinking Model:** `gemini-3-pro-preview` (Used for complex reasoning tasks).
*   **Capabilities:**
    *   **Text Generation:** Streaming responses with markdown formatting.
    *   **Vision:** Image analysis via Base64 encoding.
    *   **Speech:** Browser-native Web Speech API for speech-to-text.

### State Management & Persistence
*   **Authentication:** Custom Context-based auth system (`AuthContext`).
    *   Simulates a secure backend using `localStorage`.
    *   Handles Session Management, OTP verification, and Profile updates.
*   **Theme:** Context-based theming (`ThemeContext`) supporting system preference and manual toggles.
*   **Data Storage:** Client-side persistence for chat history and user settings.

### User Interface (UI)
*   **Styling:** Tailwind CSS (Utility-first framework).
*   **Animations:** Framer Motion (Declarative animations for complex UI transitions).
*   **Iconography:** Custom SVG icons designed for visual consistency.
*   **Design Language:** "Neo-Glass" - featuring backdrop filters, translucent layers, and vibrant gradients.

## 4. Key Features

### 1. Advanced Chat Interface
*   **Streaming Responses:** Real-time typewriter effect that mimics human typing.
*   **Smart Auto-Scroll:** Intelligent scrolling that locks to the bottom during generation but allows user review.
*   **Markdown Support:** Custom renderer for tables, lists, bold/italic text, and links.
*   **Code Blocks:** Syntax highlighting for 10+ languages with "Copy to Clipboard" functionality.

### 2. Assumption Extractor Mode
A unique behavioral mode where the AI identifies and lists underlying assumptions in its responses, providing transparency and logical depth often missing in standard LLM interactions.

### 3. Multimodal Input
*   **File Uploads:** Support for analyzing PDF documents and Images.
*   **Voice Input:** Integrated microphone support for hands-free prompting.

### 4. Custom Auth & Profile System
*   **Secure Simulation:** Realistic Login/Signup flows with validation.
*   **Profile Management:** Users can update usernames and view account details.
*   **Chat History:** Full history persistence across sessions.

## 5. Directory Structure
```
/
├── components/          # Reusable UI components
│   ├── chat/           # Chat-specific logic (Input, Message, Area)
│   ├── common/         # Generic UI (Buttons, Modals, Icons)
│   ├── landing/        # Marketing landing page sections
│   └── layout/         # Structural layout (Sidebar)
├── context/            # React Context providers (Auth, Theme)
├── pages/              # Route views (Home, Auth, Chat, Profile)
├── services/           # API integration (Gemini Service)
├── types/              # TypeScript definitions
└── App.tsx             # Main entry point & Routing
```

## 6. Future Roadmap
*   **Server-Side DB:** Migration from localStorage to a real database (PostgreSQL/Firebase).
*   **Function Calling:** Implementing Gemini Tools for real-world actions (Weather, Calendar).
*   **Voice Output:** Text-to-Speech integration for full voice conversations.
