/**
 * HomePage Component
 * 
 * Main home page content for the FlowKey interface
 * Features dynamic layout with centered logo and search bar when no conversation exists
 * Implements continuous chat conversation with fixed bottom search bar when conversation is active
 * Manages unique conversation sessions with proper history persistence
 * Implements responsive design, accessibility standards, and real-time API integration
 * Integrates with local storage for history management and controlled search input
 * Includes Mermaid workflow diagram generation functionality with retry logic
 * 
 * @component
 */

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FlowKeyLogo } from './PerplexityLogo';
import { SearchBar } from './SearchBar';
import { ChatContainer } from './ChatContainer';
import { validateApiKey, handleGeminiError, generateMermaidScriptFromConversation, generateGeminiCompletion } from '@/lib/gemini';
import { SearchError } from '@/types/search';
import { ChatMessageUnion, MermaidMessage } from '@/types/chat';
import { HistoryItem } from '@/types/history';
import { upsertHistoryItem } from '@/lib/historyStorage';
import { userMessages, triggerConfig } from '@/config/workflow';

/**
 * HomePage Props
 */
interface HomePageProps {
  className?: string;
  onNewChat?: () => void;
  onItemSelect?: (item: HistoryItem) => void;
}

/**
 * HomePage Ref interface for exposing reset functionality
 */
export interface HomePageRef {
  reset: () => void;
  startNewChat: () => void;
}

/**
 * Main HomePage Component
 * 
 * Renders the main chat interface with dynamic layout based on conversation state
 * When no conversation exists: centers logo and search bar
 * When conversation is active: displays chat container with fixed bottom search bar
 * Manages unique conversation sessions with proper history persistence
 * Handles continuous chat through OpenAI API and displays conversation with proper error handling
 * Exposes reset functionality for New Chat functionality
 * Integrates with local storage for history management
 * Orchestrates Mermaid workflow diagram generation
 */
export const HomePage = forwardRef<HomePageRef, HomePageProps>(({ 
  className = '',
  onNewChat,
  onItemSelect
}, ref) => {
  const [conversation, setConversation] = useState<ChatMessageUnion[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  /**
   * Reset the HomePage state (clear conversation and errors)
   */
  const reset = () => {
    setConversation([]);
    setConversationId(null);
    setError(null);
    setIsSearching(false);
    setIsGeneratingWorkflow(false);
  };

  /**
   * Start a new chat - clears all conversation-related state and saves current conversation
   */
  const startNewChat = () => {
    // Save current conversation to history if it's not empty
    if (conversation.length > 0 && conversationId) {
      try {
        const historyItem: HistoryItem = {
          id: conversationId,
          title: conversation[0]?.content || 'New Conversation',
          description: `Conversation with ${conversation.length} messages`,
          timestamp: new Date(),
          type: 'chat',
          conversation: [...conversation], // Create a copy of the conversation
          metadata: {
            messageCount: conversation.length,
            conversationId: conversationId
          }
        };
        upsertHistoryItem(historyItem);
      } catch (historyError) {
        console.error('Failed to save conversation to history:', historyError);
      }
    }

    // Reset conversation state for new chat
    setCurrentQuery('');
    setConversation([]);
    setConversationId(uuidv4()); // Generate new unique ID for the new chat
    setError(null);
    setIsSearching(false);
    setIsGeneratingWorkflow(false);
    
    // Call parent onNewChat if provided
    onNewChat?.();
  };

  // Expose reset and startNewChat functions to parent components
  useImperativeHandle(ref, () => ({
    reset,
    startNewChat
  }));

  /**
   * Handle history item selection - load conversation from history
   * @param item - The selected history item
   */
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setConversation([...item.conversation]); // Create a copy of the conversation
    setConversationId(item.id);
    setCurrentQuery('');
    setError(null);
    setIsSearching(false);
    setIsGeneratingWorkflow(false);
    
    // Call parent onItemSelect if provided
    onItemSelect?.(item);
  };

  /**
   * Save current conversation to history
   */
  const saveCurrentConversation = () => {
    if (conversation.length > 0 && conversationId) {
      try {
        const historyItem: HistoryItem = {
          id: conversationId,
          title: conversation[0]?.content || 'New Conversation',
          description: `Conversation with ${conversation.length} messages`,
          timestamp: new Date(),
          type: 'chat',
          conversation: [...conversation], // Create a copy of the conversation
          metadata: {
            messageCount: conversation.length,
            conversationId: conversationId
          }
        };
        upsertHistoryItem(historyItem);
      } catch (historyError) {
        console.error('Failed to save conversation to history:', historyError);
      }
    }
  };

  /**
   * Handle workflow generation with improved error handling and retry logic
   * Uses the new configuration-driven approach with proper validation
   */
  const handleGenerateWorkflow = async () => {
    // Validate conversation content availability
    if (conversation.length === 0) {
      setError({
        message: userMessages.noContentError,
        type: 'validation_error',
        timestamp: new Date()
      });
      return;
    }

    setIsGeneratingWorkflow(true);
    setError(null);

    try {
      // Create initial Mermaid message with updated configuration
      const mermaidMessageId = Date.now().toString();
      const initialMermaidMessage: MermaidMessage = {
        id: mermaidMessageId,
        role: 'mermaid',
        type: 'mermaid',
        content: userMessages.generationStarted,
        timestamp: new Date(),
        mermaidScript: '',
        isProcessing: true
      };

      // Add initial message to conversation
      setConversation(prev => [...prev, initialMermaidMessage]);

      // Generate Mermaid script with retry logic and validation
      const mermaidScript = await generateMermaidScriptFromConversation(conversation);

      // Handle the response based on generation result
      if (mermaidScript === 'NO_DIAGRAM') {
        // Update message when no diagram is possible
        setConversation(prev => prev.map(msg =>
          msg.id === mermaidMessageId
            ? {
                ...msg,
                content: userMessages.noDiagramPossible,
                mermaidScript: 'NO_DIAGRAM',
                isProcessing: false
              } as MermaidMessage
            : msg
        ));
      } else {
        // Update message with successful generation
        setConversation(prev => prev.map(msg =>
          msg.id === mermaidMessageId
            ? {
                ...msg,
                content: userMessages.generationSuccess,
                mermaidScript,
                isProcessing: false
              } as MermaidMessage
            : msg
        ));
      }

      // Save updated conversation to history
      setTimeout(() => {
        if (conversationId) {
          const updatedConversation = conversation.concat({
            ...initialMermaidMessage,
            content: mermaidScript === 'NO_DIAGRAM' 
              ? userMessages.noDiagramPossible 
              : userMessages.generationSuccess,
            mermaidScript,
            isProcessing: false
          });
          
          const historyItem: HistoryItem = {
            id: conversationId,
            title: updatedConversation[0]?.content || 'New Conversation',
            description: `Conversation with ${updatedConversation.length} messages`,
            timestamp: new Date(),
            type: 'chat',
            conversation: updatedConversation,
            metadata: {
              messageCount: updatedConversation.length,
              conversationId: conversationId
            }
          };
          upsertHistoryItem(historyItem);
        }
      }, 0);

    } catch (error) {
      console.error('Workflow generation error:', error);
      
      // Determine appropriate error message based on error type
      let errorMessage: string = userMessages.generationFailed;
      
      if (error instanceof Error) {
        // Use specific error messages from the new configuration
        const message = error.message;
        const validMessages = Object.values(userMessages) as string[];
        if (validMessages.includes(message)) {
          errorMessage = message;
        }
      }
      
      // Update the Mermaid message with error state
      setConversation(prev => prev.map(msg => 
        msg.role === 'mermaid' && msg.isProcessing
          ? {
              ...msg,
              content: errorMessage,
              error: errorMessage,
              isProcessing: false
            } as MermaidMessage
          : msg
      ));
      
      // Set error state for UI display
      setError({
        message: errorMessage,
        type: 'api_error',
        timestamp: new Date()
      });
    } finally {
      // Always reset generation state
      setIsGeneratingWorkflow(false);
    }
  };

  /**
   * Handle search query submission with OpenAI API integration for continuous chat
   * @param query - The user's search query
   */
  const handleSearch = async (query: string) => {
    // Validate API key before making request
    if (!validateApiKey()) {
      const apiError: SearchError = {
        message: 'OpenAI API key not configured. Please add your API key to the .env file.',
        type: 'validation_error',
        timestamp: new Date()
      };
      setError(apiError);
      return;
    }

    // Generate conversation ID if this is the first message
    if (!conversationId) {
      setConversationId(uuidv4());
    }

    // Create user message
    const userMessage: ChatMessageUnion = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    // Add user message to conversation
    setConversation(prev => [...prev, userMessage]);
    
    // Clear current query
    setCurrentQuery('');
    
    setIsSearching(true);
    setError(null);
    
    try {
    console.log('Searching for:', query);
    
      // Prepare messages for Gemini API (include conversation history)
      const messages = [
        ...conversation,
        {
          id: Date.now().toString(),
          role: 'user' as const,
          content: query,
          timestamp: new Date()
        }
      ];

      // Make API call to Gemini
      const responseContent = await generateGeminiCompletion(messages);
      
      if (!responseContent) {
        throw new Error('No response content received from OpenAI API');
      }

      // Create assistant message
      const assistantMessage: ChatMessageUnion = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      // Add assistant message to conversation
      setConversation(prev => [...prev, assistantMessage]);
      
      // Save conversation to history
      setTimeout(() => {
        if (conversationId) {
          const updatedConversation = [...conversation, userMessage, assistantMessage];
          const historyItem: HistoryItem = {
            id: conversationId,
            title: updatedConversation[0]?.content || 'New Conversation',
            description: `Conversation with ${updatedConversation.length} messages`,
            timestamp: new Date(),
            type: 'chat',
            conversation: updatedConversation,
            metadata: {
              messageCount: updatedConversation.length,
              conversationId: conversationId
            }
          };
          upsertHistoryItem(historyItem);
        }
      }, 0);
      
    } catch (err) {
      console.error('Search error:', err);
      
      // Handle Gemini API errors
      const geminiError = handleGeminiError(err);
      const searchError: SearchError = {
        message: geminiError.message,
        type: geminiError.type === 'unknown' ? 'unknown' : 'api_error',
        timestamp: new Date()
      };
      
      setError(searchError);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle file upload
   * @param file - The uploaded file
   */
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // TODO: Implement file processing with OpenAI API
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Handle query change
   * @param query - The new query value
   */
  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  /**
   * Determine if workflow generation button should be shown
   */
  const canGenerateWorkflow = !isGeneratingWorkflow && conversation.length > 0;

  return (
    <div className={`
      flex flex-col h-screen w-full
      ${className}
    `}>
      {/* Dynamic Layout based on conversation state */}
      {conversation.length === 0 ? (
        /* Centered Layout - No conversation */
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      {/* Logo Section */}
      <div className="mb-12 animate-fade-in">
        <FlowKeyLogo size="lg" />
      </div>

          {/* Search Bar Section */}
          <div className="w-full max-w-2xl animate-fade-in">
        <SearchBar
              value={currentQuery}
              onQueryChange={handleQueryChange}
          onSearch={handleSearch}
          onFileUpload={handleFileUpload}
              onGenerateWorkflow={handleGenerateWorkflow}
              canGenerateWorkflow={false}
          placeholder="Ask anything..."
        />
      </div>
        </div>
      ) : (
        /* Chat Layout - Conversation active */
        <>
          {/* Chat Container */}
          <div className="flex-1 overflow-hidden">
            <ChatContainer
              messages={conversation}
              isLoading={isSearching || isGeneratingWorkflow}
              className="h-full"
            />
            </div>

          {/* Fixed Bottom Search Bar */}
          <div className="px-6 py-4 border-t border-perplexity-border bg-perplexity-bg">
            <SearchBar
              value={currentQuery}
              onQueryChange={handleQueryChange}
              onSearch={handleSearch}
              onFileUpload={handleFileUpload}
              onGenerateWorkflow={handleGenerateWorkflow}
              canGenerateWorkflow={canGenerateWorkflow}
              placeholder="Ask anything..."
            />
          </div>
        </>
        )}

      {/* Error Display - Always visible when error exists */}
      {error && (
        <div className="px-6 py-4 animate-fade-in">
          <div className="
            p-4 rounded-lg 
            bg-red-900/20 border border-red-500/30
            text-red-200
          ">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Chat Error</h3>
                <p className="text-sm">{error.message}</p>
              </div>
              <button
                onClick={clearError}
                className="
                  ml-4 p-1 rounded
                  hover:bg-red-500/20
                  transition-colors duration-200
                "
                aria-label="Dismiss error"
              >
                ×
              </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;