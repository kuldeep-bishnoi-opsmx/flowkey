/**
 * Search Types
 * 
 * TypeScript interfaces for search functionality and API responses
 * Ensures type safety for search results and error handling
 * 
 * @module search
 */

/**
 * Search result item structure
 */
export interface SearchResult {
  id: string;
  content: string;
  timestamp: Date;
  query: string;
}

/**
 * Search error structure
 */
export interface SearchError {
  message: string;
  type: 'api_error' | 'network_error' | 'validation_error' | 'unknown';
  timestamp: Date;
}

/**
 * Search state interface
 */
export interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: SearchError | null;
  lastQuery: string | null;
}

/**
 * OpenAI chat completion message structure
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Search request parameters
 */
export interface SearchRequest {
  query: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
} 