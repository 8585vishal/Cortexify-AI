export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ChatSettings {
  temperature: number; // 0.0 to 1.0
  maxTokens: number;   // e.g., 1024, 2048
}
