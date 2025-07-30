/**
 * Chat Types
 * 
 * TypeScript type definitions for chat functionality
 * Defines interfaces for chat messages, conversations, and related data structures
 * Supports user, assistant, system, and Mermaid diagram messages
 * 
 * @module chat
 */

/**
 * Chat message role types
 */
export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'mermaid';

/**
 * Base chat message interface
 */
export interface BaseChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: ChatMessageRole;
  /** Text content of the message */
  content: string;
  /** Timestamp when the message was created */
  timestamp: Date;
  /** Optional metadata for additional message properties */
  metadata?: {
    /** Whether the message is currently being processed */
    isProcessing?: boolean;
    /** Error message if the message failed to process */
    error?: string;
    /** Any additional metadata */
    [key: string]: any;
  };
}

/**
 * Standard chat message interface
 */
export interface ChatMessage extends BaseChatMessage {
  role: 'user' | 'assistant' | 'system';
  /** Optional raw Mermaid script for assistant messages */
  mermaidScript?: string;
}

/**
 * Mermaid diagram message interface
 * Extends base chat message with Mermaid-specific properties
 */
export interface MermaidMessage extends BaseChatMessage {
  /** Role is always 'mermaid' for Mermaid messages */
  role: 'mermaid';
  /** Type identifier for Mermaid messages */
  type: 'mermaid';
  /** The raw Mermaid script received from OpenAI */
  mermaidScript: string;
  /** Whether the Mermaid diagram is still being processed/rendered */
  isProcessing?: boolean;
  /** Error message for Mermaid-specific failures */
  error?: string;
}

/**
 * Union type for all possible chat message types
 */
export type ChatMessageUnion = ChatMessage | MermaidMessage;

/**
 * Conversation interface representing a complete chat session
 */
export interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** Array of messages in the conversation */
  messages: ChatMessageUnion[];
  /** Title of the conversation */
  title: string;
  /** Optional description of the conversation */
  description?: string;
  /** Timestamp when the conversation was created */
  createdAt: Date;
  /** Timestamp when the conversation was last updated */
  updatedAt: Date;
}

/**
 * Props interface for ChatMessage component
 */
export interface ChatMessageProps {
  /** The chat message to display */
  message: ChatMessageUnion;
  /** Whether this is the last message in the conversation */
  isLast?: boolean;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Props interface for ChatContainer component
 */
export interface ChatContainerProps {
  /** Array of messages to display */
  messages: ChatMessageUnion[];
  /** Whether messages are currently loading */
  isLoading?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Callback when a message is clicked */
  onMessageClick?: (message: ChatMessageUnion) => void;
} 