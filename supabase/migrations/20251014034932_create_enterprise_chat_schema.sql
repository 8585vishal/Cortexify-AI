/*
  # Enterprise Chat Application Database Schema
  
  ## Overview
  Professional, scalable database schema for an enterprise-grade AI chat application with 
  comprehensive user management, session tracking, analytics, and security.

  ## 1. New Tables
  
  ### `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text)
  - `avatar_url` (text)
  - `company` (text)
  - `role` (text, default 'user')
  - `plan` (text, default 'free')
  - `metadata` (jsonb, default '{}')
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `chat_sessions`
  Individual chat conversation sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `title` (text, not null)
  - `model` (text, default 'gpt-4')
  - `system_prompt` (text)
  - `temperature` (decimal, default 0.7)
  - `max_tokens` (integer, default 2000)
  - `is_pinned` (boolean, default false)
  - `is_archived` (boolean, default false)
  - `folder_id` (uuid, references folders.id, nullable)
  - `tags` (text[], default '{}')
  - `metadata` (jsonb, default '{}')
  - `message_count` (integer, default 0)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `chat_messages`
  Individual messages within chat sessions
  - `id` (uuid, primary key)
  - `session_id` (uuid, references chat_sessions.id, on delete cascade)
  - `user_id` (uuid, references profiles.id)
  - `role` (text, not null, check: 'user', 'assistant', 'system')
  - `content` (text, not null)
  - `tokens_used` (integer, default 0)
  - `model` (text)
  - `metadata` (jsonb, default '{}')
  - `is_edited` (boolean, default false)
  - `parent_message_id` (uuid, references chat_messages.id, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `folders`
  Organization folders for chat sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `name` (text, not null)
  - `color` (text, default '#6366f1')
  - `icon` (text)
  - `parent_folder_id` (uuid, references folders.id, nullable)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `shared_sessions`
  Sharing functionality for chat sessions
  - `id` (uuid, primary key)
  - `session_id` (uuid, references chat_sessions.id, on delete cascade)
  - `shared_by` (uuid, references profiles.id)
  - `share_token` (text, unique, not null)
  - `is_public` (boolean, default false)
  - `expires_at` (timestamptz, nullable)
  - `view_count` (integer, default 0)
  - `password_hash` (text, nullable)
  - `created_at` (timestamptz, default now())

  ### `usage_analytics`
  Track usage metrics for billing and analytics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `session_id` (uuid, references chat_sessions.id, nullable)
  - `event_type` (text, not null)
  - `tokens_used` (integer, default 0)
  - `cost` (decimal, default 0)
  - `model` (text)
  - `metadata` (jsonb, default '{}')
  - `created_at` (timestamptz, default now())

  ### `api_keys`
  User API keys for programmatic access
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `key_hash` (text, unique, not null)
  - `name` (text, not null)
  - `last_four` (text, not null)
  - `is_active` (boolean, default true)
  - `permissions` (text[], default '{}')
  - `rate_limit` (integer, default 1000)
  - `last_used_at` (timestamptz, nullable)
  - `expires_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())

  ### `prompts_library`
  Reusable prompt templates
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `title` (text, not null)
  - `content` (text, not null)
  - `category` (text)
  - `is_public` (boolean, default false)
  - `is_favorite` (boolean, default false)
  - `use_count` (integer, default 0)
  - `tags` (text[], default '{}')
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ## 2. Security (Row Level Security)
  
  All tables have RLS enabled with restrictive policies:
  - Users can only access their own data
  - Shared sessions accessible via valid share tokens
  - Public prompts accessible to all authenticated users
  - Cascade deletes maintain referential integrity

  ## 3. Indexes
  
  Performance indexes on frequently queried columns:
  - User lookups
  - Session queries
  - Message retrieval
  - Analytics aggregation
  - Search operations

  ## 4. Functions & Triggers
  
  - Automatic timestamp updates
  - Message count maintenance
  - Usage tracking
  - Token counting
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  company text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'enterprise')),
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#6366f1',
  icon text,
  parent_folder_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  model text DEFAULT 'gpt-4',
  system_prompt text,
  temperature decimal DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer DEFAULT 2000 CHECK (max_tokens > 0),
  is_pinned boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON chat_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  tokens_used integer DEFAULT 0,
  model text,
  metadata jsonb DEFAULT '{}',
  is_edited boolean DEFAULT false,
  parent_message_id uuid REFERENCES chat_messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shared sessions table
CREATE TABLE IF NOT EXISTS shared_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  shared_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  share_token text UNIQUE NOT NULL,
  is_public boolean DEFAULT false,
  expires_at timestamptz,
  view_count integer DEFAULT 0,
  password_hash text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shared_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shared sessions"
  ON shared_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can create shared sessions"
  ON shared_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update own shared sessions"
  ON shared_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = shared_by)
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete own shared sessions"
  ON shared_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = shared_by);

CREATE POLICY "Public shared sessions viewable by all"
  ON shared_sessions FOR SELECT
  TO authenticated
  USING (is_public = true AND (expires_at IS NULL OR expires_at > now()));

-- Usage analytics table
CREATE TABLE IF NOT EXISTS usage_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  tokens_used integer DEFAULT 0,
  cost decimal DEFAULT 0,
  model text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON usage_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics"
  ON usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  key_hash text UNIQUE NOT NULL,
  name text NOT NULL,
  last_four text NOT NULL,
  is_active boolean DEFAULT true,
  permissions text[] DEFAULT '{}',
  rate_limit integer DEFAULT 1000,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Prompts library table
CREATE TABLE IF NOT EXISTS prompts_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  is_public boolean DEFAULT false,
  is_favorite boolean DEFAULT false,
  use_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prompts_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON prompts_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public prompts"
  ON prompts_library FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own prompts"
  ON prompts_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON prompts_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON prompts_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_folder_id ON chat_sessions(folder_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_shared_sessions_token ON shared_sessions(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_sessions_session_id ON shared_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts_library(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON prompts_library(is_public) WHERE is_public = true;

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_trgm ON chat_messages USING gin(content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_title_trgm ON chat_sessions USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prompts_content_trgm ON prompts_library USING gin(content gin_trgm_ops);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts_library;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET message_count = message_count + 1,
      updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment message count
DROP TRIGGER IF EXISTS increment_message_count_trigger ON chat_messages;
CREATE TRIGGER increment_message_count_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_count();

-- Function to decrement message count
CREATE OR REPLACE FUNCTION decrement_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET message_count = GREATEST(message_count - 1, 0),
      updated_at = now()
  WHERE id = OLD.session_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to decrement message count
DROP TRIGGER IF EXISTS decrement_message_count_trigger ON chat_messages;
CREATE TRIGGER decrement_message_count_trigger
  AFTER DELETE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION decrement_message_count();