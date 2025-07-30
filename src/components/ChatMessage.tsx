/**
 * ChatMessage Component
 * 
 * Renders individual chat messages with proper styling and interaction features
 * Differentiates between user, assistant, and Mermaid messages with visual styling using HSL-based colors
 * Includes message actions and accessibility features
 * Supports inline rendering of Mermaid diagrams with SVG export functionality using client-side Mermaid.js
 * Displays raw Mermaid scripts for assistant messages when available
 * 
 * @component
 */

import React, { useEffect, useRef } from 'react';
import { ChatMessageUnion, ChatMessageProps, MermaidMessage } from '@/types/chat';
import { accessibilityConfig, exportConfig } from '@/config/workflow';
import { Button } from '@/components/ui/button';
import mermaid from 'mermaid';

// Initialize Mermaid.js with configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});

/**
 * Main ChatMessage Component
 * 
 * Renders a single chat message with appropriate styling
 * Uses HSL-based color system for consistent theming and visual differentiation
 * Supports Mermaid diagram rendering with loading states, error handling, and SVG export functionality using client-side rendering
 * Displays raw Mermaid scripts for assistant messages when available
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLast = false,
  className = ''
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isMermaid = message.role === 'mermaid';
  
  // Ref for the diagram container
  const diagramRef = useRef<HTMLDivElement>(null);

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  /**
   * Export Mermaid diagram as SVG file
   * Gets the SVG content directly from the rendered diagram and triggers a download
   */
  const handleExportSvg = () => {
    if (diagramRef.current) {
      // Safely get SVG content using outerHTML of the SVG element
      const svgElement = diagramRef.current.querySelector('svg');
      if (!svgElement) {
        console.error("No SVG content to export.");
        return;
      }
      const svgText = svgElement.outerHTML;
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportConfig.defaultFilename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  /**
   * Client-side Mermaid rendering effect with enhanced validation
   */
  useEffect(() => {
    if (isMermaid && 'mermaidScript' in message && message.mermaidScript && diagramRef.current) {
      const mermaidMessage = message as MermaidMessage;
      
      // Don't render if it's NO_DIAGRAM
      if (mermaidMessage.mermaidScript === 'NO_DIAGRAM') {
        return;
      }
      
      // Clear previous content safely
      while (diagramRef.current.firstChild) {
        diagramRef.current.removeChild(diagramRef.current.firstChild);
      }
      
      // Validate Mermaid script before rendering
      const script = mermaidMessage.mermaidScript.trim();
      

      
      // Unique ID for mermaid.render
      const diagramId = `mermaid-diagram-${message.id}`; 

      mermaid.render(diagramId, script)
        .then(({ svg }) => {
          if (diagramRef.current) {
            // Clear previous content safely
            while (diagramRef.current.firstChild) {
              diagramRef.current.removeChild(diagramRef.current.firstChild);
            }
            // Parse SVG string safely using DOMParser
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            if (svgElement && !svgDoc.querySelector('parsererror')) {
              diagramRef.current.appendChild(svgElement);
            }
          }
        })
        .catch(error => {
          console.error("Mermaid client-side rendering error:", error);
          
          // Extract error details for potential retry
          const errorMessage = error.message || 'Unknown rendering error';
          const errorSnippet = extractErrorSnippet(error, script);
          
          // Log error details for debugging
          console.log("Rendering error details:", {
            message: errorMessage,
            snippet: errorSnippet,
            script: script.substring(0, 200)
          });
          
          if (diagramRef.current) {
            // Clear previous content safely
            while (diagramRef.current.firstChild) {
              diagramRef.current.removeChild(diagramRef.current.firstChild);
            }
            
            // Create error message element safely using DOM methods
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-400 p-3 rounded border border-red-500/30 bg-red-900/20';
            
            const errorTitle = document.createElement('div');
            errorTitle.className = 'font-medium mb-2';
            errorTitle.textContent = '❌ Rendering Error';
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'text-sm';
            errorMessage.textContent = mermaidMessage.error || 'Unable to render diagram due to syntax or rendering issues.';
            
            const rawScript = document.createElement('div');
            rawScript.className = 'text-xs mt-2 text-gray-400';
            rawScript.textContent = `Raw script: ${script.substring(0, 200)}${script.length > 200 ? '...' : ''}`;
            
            errorDiv.appendChild(errorTitle);
            errorDiv.appendChild(errorMessage);
            errorDiv.appendChild(rawScript);
            diagramRef.current.appendChild(errorDiv);
          }
        });
    }
  }, [isMermaid, message, message.id]);

  /**
   * Extract error snippet from Mermaid rendering error
   * @param error - The rendering error object
   * @param script - The original script that caused the error
   * @returns The problematic code snippet
   */
  const extractErrorSnippet = (error: any, script: string): string => {
    try {
      // Try to extract line number from error message
      const lineMatch = error.message?.match(/line (\d+)/);
      if (lineMatch) {
        const lineNumber = parseInt(lineMatch[1]) - 1; // Convert to 0-based index
        const lines = script.split('\n');
        if (lineNumber >= 0 && lineNumber < lines.length) {
          return lines[lineNumber];
        }
      }
      
      // Fallback: return first 100 characters of script
      return script.substring(0, 100);
    } catch (e) {
      return script.substring(0, 100);
    }
  };



  /**
   * Render Mermaid diagram content with enhanced styling and client-side rendering
   */
  const renderMermaidContent = () => {
    if (isMermaid && 'isProcessing' in message) {
      const mermaidMessage = message as MermaidMessage;
      
      if (mermaidMessage.isProcessing) {
        return (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-perplexity-accent"></div>
            <span>{mermaidMessage.content}</span>
          </div>
        );
      }
      
      if (mermaidMessage.error) {
        return (
          <div className="text-red-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500">⚠</span>
              <span className="font-medium">Error</span>
            </div>
            <p>{mermaidMessage.error}</p>
          </div>
        );
      }
      
      if (mermaidMessage.mermaidScript) {
        // Handle NO_DIAGRAM case
        if (mermaidMessage.mermaidScript === 'NO_DIAGRAM') {
          return (
            <div className="space-y-2">
              {/* Error message for NO_DIAGRAM */}
              <div className="text-amber-400">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500">ℹ</span>
                  <span className="font-medium">No Diagram Generated</span>
                </div>
                <p>{mermaidMessage.content}</p>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {/* Success message */}
            <p className="text-sm text-perplexity-text-muted">
              {mermaidMessage.content}
            </p>
            
            {/* Raw Mermaid Script Display */}
            <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Raw Mermaid Script</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(mermaidMessage.mermaidScript)}
                  aria-label="Copy Mermaid script"
                  className="text-xs px-2 py-1 h-6"
                >
                  Copy
                </Button>
              </div>
              <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap break-words">
                <code className="language-mermaid">{mermaidMessage.mermaidScript}</code>
              </pre>
            </div>
            
            {/* Enhanced diagram container with client-side rendering */}
            <div className="max-w-full h-auto p-4 mt-2 mb-4 rounded-lg bg-chat-assistant-bg border border-perplexity-border shadow-md">
              <div ref={diagramRef} className="max-w-full h-auto">
                {/* Mermaid diagram will be injected here */}
              </div>
            </div>
            
            {/* Export buttons */}
            <div className="flex gap-2 mt-2 justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSvg}
                aria-label="Export diagram as SVG"
                className="text-xs px-3 py-1"
              >
                {exportConfig.exportButtonText}
              </Button>
            </div>
          </div>
        );
      }
    }
    
    return message.content;
  };

  /**
   * Render assistant message content with optional Mermaid script display
   */
  const renderAssistantContent = () => {
    const assistantMessage = message as ChatMessageUnion & { mermaidScript?: string };
    
    return (
      <div className="space-y-3">
        {/* Main content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        {/* Raw Mermaid script display */}
        {assistantMessage.mermaidScript && assistantMessage.mermaidScript.trim() !== '' && (
          <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-300">Mermaid Script</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(assistantMessage.mermaidScript)}
                aria-label="Copy Mermaid script"
                className="text-xs px-2 py-1 h-6"
              >
                Copy
              </Button>
            </div>
            <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap break-words">
              <code>{assistantMessage.mermaidScript}</code>
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        group flex w-full mb-4
        ${isUser ? 'justify-end' : 'justify-start'}
        ${className}
      `}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${isUser 
            ? 'bg-chat-user-bg text-chat-user-text' 
            : isMermaid
            ? 'bg-chat-assistant-bg text-chat-assistant-text border border-perplexity-border'
            : 'bg-chat-assistant-bg text-chat-assistant-text border border-perplexity-border'
          }
          ${message.metadata?.isProcessing ? 'opacity-75' : ''}
          ${message.metadata?.error ? 'border-red-500 bg-red-900/20' : ''}
          transition-all duration-200
        `}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {isAssistant ? renderAssistantContent() : renderMermaidContent()}
        </div>

        {/* Timestamp */}
        <div className={`
          text-xs mt-1
          ${isUser ? 'text-chat-user-timestamp' : 'text-chat-assistant-timestamp'}
        `}>
          {formatTimestamp(message.timestamp)}
        </div>

        {/* Error message if any */}
        {message.metadata?.error && (
          <div className="text-xs text-red-400 mt-1">
            Error: {message.metadata.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 