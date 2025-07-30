/**
 * ChatContainer Component
 * 
 * Container component for displaying chat conversations
 * Handles scrolling, layout, and message rendering
 * Provides smooth scrolling to latest messages
 * 
 * @component
 */

import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatContainerProps } from '@/types/chat';

/**
 * Main ChatContainer Component
 * 
 * Renders a scrollable container for chat messages
 * Automatically scrolls to the latest message
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading = false,
  className = '',
  onMessageClick
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to the bottom of the chat
   */
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  /**
   * Scroll to bottom when messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle message click
   */
  const handleMessageClick = (message: any) => {
    onMessageClick?.(message);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Messages area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 px-4 py-4"
      >
        <div className="space-y-2">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              className="cursor-pointer"
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="
                max-w-[80%] px-4 py-3 rounded-2xl
                bg-perplexity-surface text-perplexity-text 
                border border-perplexity-border
                opacity-75
              ">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-perplexity-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-perplexity-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-perplexity-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible element for scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatContainer; 