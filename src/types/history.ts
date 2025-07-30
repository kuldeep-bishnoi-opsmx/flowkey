/**
 * History Types
 * 
 * TypeScript type definitions for the history feature
 * Defines interfaces for history items, states, and related functionality
 * Supports both individual search results and full conversations with unique conversation tracking
 */

import { ChatMessageUnion } from './chat';

/**
 * Individual history item interface
 */
export interface HistoryItem {
  /** Unique identifier for the history item */
  id: string;
  /** The search query or interaction title */
  title: string;
  /** Optional description or summary */
  description?: string;
  /** Timestamp when the item was created */
  timestamp: Date;
  /** Type of history item */
  type: 'search' | 'chat' | 'interaction';
  /** Full conversation data for chat history */
  conversation: ChatMessageUnion[];
  /** Optional metadata associated with the item */
  metadata?: {
    /** Number of results or responses */
    resultCount?: number;
    /** Duration of the interaction */
    duration?: number;
    /** Number of messages in conversation */
    messageCount?: number;
    /** Conversation ID for linking */
    conversationId?: string;
    /** Any additional data */
    [key: string]: any;
  };
}

/**
 * History state interface
 */
export interface HistoryState {
  /** Array of history items */
  items: HistoryItem[];
  /** Whether history is currently loading */
  isLoading: boolean;
  /** Error message if any */
  error?: string;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Current page for pagination */
  currentPage: number;
}

/**
 * History action types for state management
 */
export type HistoryAction =
  | { type: 'LOAD_HISTORY_START' }
  | { type: 'LOAD_HISTORY_SUCCESS'; payload: HistoryItem[] }
  | { type: 'LOAD_HISTORY_ERROR'; payload: string }
  | { type: 'ADD_HISTORY_ITEM'; payload: HistoryItem }
  | { type: 'UPDATE_HISTORY_ITEM'; payload: HistoryItem }
  | { type: 'REMOVE_HISTORY_ITEM'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_PAGE'; payload: number };

/**
 * History component props interface
 */
export interface HistoryProps {
  /** Custom CSS class name */
  className?: string;
  /** Callback when a history item is selected - passes full HistoryItem */
  onItemSelect?: (item: HistoryItem) => void;
  /** Callback when a history item is deleted */
  onItemDelete?: (itemId: string) => void;
  /** Maximum number of items to display */
  maxItems?: number;
  /** Whether to show delete buttons */
  showDeleteButton?: boolean;
}

/**
 * History item props interface
 */
export interface HistoryItemProps {
  /** The history item to display */
  item: HistoryItem;
  /** Callback when the item is clicked - passes full HistoryItem */
  onClick?: (item: HistoryItem) => void;
  /** Callback when the delete button is clicked */
  onDelete?: (itemId: string) => void;
  /** Whether to show the delete button */
  showDeleteButton?: boolean;
  /** Custom CSS class name */
  className?: string;
}