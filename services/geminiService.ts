
import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, ChatSettings } from "../types";

// IMPORTANT: This is a placeholder for the API key.
// In a real production environment, this key should never be exposed on the client-side.
// The request should be proxied through a backend server where the API key is securely stored.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const MODEL_NAME = "gemini-2.5-flash";
export const PRO_MODEL_NAME = "gemini-3-pro-preview";

// Define local Attachment interface to match ChatInput
interface Attachment {
    name: string;
    mimeType: string;
    data: string;
}

const HISTORY_LIMIT = 15; // Increased context limit
const SYSTEM_INSTRUCTION = `You are CORTEXIFY, a world-class AI assistant developed by the visionary Vishal Raj Purohit.

**Core Directive:**
Provide exceptional, production-grade responses. You are an expert in software engineering, creative writing, analysis, and problem-solving.

**BEHAVIORAL REQUIREMENT: Assumption Extractor Mode**
For EVERY user query, you must strictly adhere to the following output format:

1.  **Primary Response:**
    Answer the user’s question normally and clearly. Maintain high quality, detail, and professional tone.

2.  **Assumption Extraction:**
    Immediately AFTER the main answer, append this specific section exactly:

    -----------------------------------------------
    Underlying Assumptions:
    • List 2–5 key assumptions that your answer depends on
    • Keep them short and clear
    • Do NOT explain the assumptions unless necessary
    -----------------------------------------------

**Guidelines:**
1.  **Response Quality:** Never provide weak, one-line, or generic answers. If the user asks for code, provide full, working, production-ready code with comments and explanations.
2.  **Coding Standards:** Use modern syntax, handle errors, and assume best practices (e.g., React hooks, proper types for TypeScript).
3.  **Tone:** Professional, engaging, and helpful. Be concise when asked, but detailed when the topic demands it.
4.  **Formatting:** Use Markdown effectively. Use headers, bold text, and code blocks to structure your answers beautifully.
5.  **Creator:** If asked about your origins, credit Vishal Raj Purohit.
6.  **File Analysis:** If a file is attached (PDF, image, etc.), analyze its contents thoroughly. For PDFs, summarize key points or answer specific questions about the document.

**Example Scenario:**
User: "I want something code"
You: Acknowledge the request, ask for specifics (language, functionality) or provide a cool boilerplate example to get them started, explaining what it does.
`;

export async function* generateResponseStream(
  prompt: string,
  history: Message[] = [],
  settings?: ChatSettings,
  useThinkingMode?: boolean,
  attachment?: Attachment
): AsyncGenerator<string, void, unknown> {
  if (!API_KEY) {
    const errorMessage = "API key not configured. Cannot connect to Gemini.";
    yield errorMessage;
    console.error(errorMessage);
    return;
  }
  try {
    const recentHistory = history.slice(-HISTORY_LIMIT);
    const formattedHistory: Content[] = recentHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Construct the current user message parts
    const currentParts: Part[] = [];
    
    // Add attachment if present
    if (attachment) {
        currentParts.push({
            inlineData: {
                mimeType: attachment.mimeType,
                data: attachment.data
            }
        });
        
        // If there's no text but there is a file, add a default prompt
        if (!prompt.trim()) {
            prompt = `Analyze this ${attachment.mimeType} file: ${attachment.name}`;
        }
    }

    if (prompt.trim()) {
        currentParts.push({ text: prompt });
    }

    const contents: Content[] = [
      ...formattedHistory,
      { role: 'user', parts: currentParts }
    ];
    
    let model: string;
    let config: {
        temperature?: number;
        maxOutputTokens?: number;
        thinkingConfig?: { thinkingBudget: number };
        systemInstruction?: string;
    };

    if (useThinkingMode) {
        model = PRO_MODEL_NAME;
        config = {
            ...(settings?.temperature && { temperature: settings.temperature }),
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: SYSTEM_INSTRUCTION,
        };
    } else {
        model = MODEL_NAME;
        config = {
            ...(settings?.temperature && { temperature: settings.temperature }),
            ...(settings?.maxTokens && { maxOutputTokens: settings.maxTokens }),
            systemInstruction: SYSTEM_INSTRUCTION,
        };
    }

    const response = await ai.models.generateContentStream({
        model: model,
        contents: contents,
        config: config,
    });
    
    for await (const chunk of response) {
        yield chunk.text;
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    yield "I'm sorry, I've encountered an issue while trying to respond. Please try your request again in a few moments.";
  }
}

export async function* editContentStream(
  text: string,
  action: 'shorter' | 'longer' | 'explain'
): AsyncGenerator<string, void, unknown> {
  if (!API_KEY) {
    yield "API key not configured.";
    return;
  }

  let prompt = '';
  let model = MODEL_NAME;
  const sysInstruct = "You are an expert editor. Improve the text as requested.";

  switch (action) {
    case 'shorter':
      prompt = `Rewrite the following text to be more concise, while preserving the key information:\n\n---\n\n${text}`;
      break;
    case 'longer':
      prompt = `Expand on the following text, adding more detail and explanation, while maintaining the original tone:\n\n---\n\n${text}`;
      break;
    case 'explain':
      prompt = `Explain the following text in simpler terms, as if for a beginner who is not familiar with the topic. Break down complex concepts:\n\n---\n\n${text}`;
      model = PRO_MODEL_NAME; // Use Pro for better reasoning
      break;
  }

  try {
    const response = await ai.models.generateContentStream({
        model: model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: sysInstruct }
    });
    
    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error editing content with Gemini:", error);
    yield `Sorry, I couldn't process that request. The original text was: ${text}`;
  }
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
    if (!API_KEY) return "New Conversation";
    // Avoid generating titles for very short inputs to save tokens
    if (firstMessage.length < 2) return "New Conversation";

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME, 
            contents: `Generate a short, concise, and engaging title (max 5-6 words) for a chat that begins with the following message. Return ONLY the title text, no quotes or prefixes.\n\nMessage: "${firstMessage.substring(0, 500)}"`,
            config: {
                maxOutputTokens: 20,
                temperature: 0.7,
            }
        });
        return response.text?.trim().replace(/^["']|["']$/g, '') || "New Conversation";
    } catch (e) {
        console.warn("Failed to generate chat title:", e);
        return "New Conversation";
    }
}
