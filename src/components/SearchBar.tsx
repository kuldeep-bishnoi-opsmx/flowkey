/**
 * SearchBar Component
 * 
 * Provides the main search input interface with multi-modal support
 * Features controlled input state, keyboard shortcuts, and file upload functionality
 * Includes workflow generation trigger button and command detection
 * Implements accessibility standards and responsive design
 * 
 * @component
 */

import React, { useCallback, useRef, forwardRef } from 'react';
import { Search, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerConfig } from '@/config/workflow';

/**
 * SearchBar component props interface
 */
interface SearchBarProps {
  /** Current input value (controlled component) */
  value: string;
  /** Callback when input value changes */
  onQueryChange: (query: string) => void;
  /** Callback when search is triggered */
  onSearch?: (query: string) => void;
  /** Callback when file is uploaded */
  onFileUpload?: (file: File) => void;
  /** Callback when workflow generation is triggered */
  onGenerateWorkflow?: () => void;
  /** Whether workflow generation button should be shown */
  canGenerateWorkflow?: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Action button interface for search bar actions
 */
interface ActionButton {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Label for the button */
  label: string;
  /** Action to perform when clicked */
  action: () => void;
  /** Position of the button (left or right) */
  position: 'left' | 'right';
}

/**
 * Main SearchBar Component
 * 
 * Renders a search input with action buttons and workflow generation capability
 * Supports controlled input state, keyboard shortcuts, and file upload
 * Includes configuration-driven workflow generation trigger
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onQueryChange,
  onSearch,
  onFileUpload,
  onGenerateWorkflow,
  canGenerateWorkflow = false,
  placeholder = "Ask anything...",
  className = ''
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle input value changes
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  }, [onQueryChange]);

  /**
   * Handle key press events (Enter to search, Escape to clear)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onQueryChange('');
    }
  }, [onQueryChange]);

  /**
   * Handle search submission
   */
  const handleSearch = useCallback(() => {
    const trimmedQuery = value.trim();
    
    if (!trimmedQuery) return;

    // Check if the query matches the workflow trigger command
    if (trimmedQuery.toLowerCase() === triggerConfig.textCommand.toLowerCase()) {
      onGenerateWorkflow?.();
      onQueryChange(''); // Clear the input
      return;
    }

    // Regular search
    onSearch?.(trimmedQuery);
  }, [value, onSearch, onGenerateWorkflow, onQueryChange]);

  /**
   * Handle file upload button click
   */
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, [onFileUpload]);

  /**
   * Handle workflow generation button click
   */
  const handleWorkflowGeneration = useCallback(() => {
    onGenerateWorkflow?.();
  }, [onGenerateWorkflow]);

  // Define left action buttons
  const leftActions: ActionButton[] = [
    {
      icon: Search,
      label: 'Search',
      action: handleSearch,
      position: 'left'
    },
    {
      icon: Paperclip,
      label: 'Attach file',
      action: handleFileUpload,
      position: 'left'
    }
  ];

  // Define right action buttons (workflow generation button)
  const rightActions: ActionButton[] = canGenerateWorkflow
    ? [{
      icon: Search, // Using Search icon as placeholder - could be replaced with a workflow icon
      label: triggerConfig.buttonText,
      action: handleWorkflowGeneration,
      position: 'right'
    }]
    : [];

  return (
    <div className={`
      relative flex items-center gap-2 p-4 rounded-xl
      bg-perplexity-surface border border-perplexity-border
      focus-within:ring-2 focus-within:ring-perplexity-accent
      transition-all duration-200
      ${className}
    `}>
      {/* Left action buttons */}
      <div className="flex items-center gap-1">
        {leftActions.map((action, index) => (
          <Button
            key={`left-${index}`}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-perplexity-text-muted hover:text-perplexity-text"
            onClick={action.action}
            aria-label={action.label}
          >
            <action.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Main input field */}
      <input
        ref={(node) => {
          // Handle both forwardRef and local ref
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          inputRef.current = node;
        }}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          flex-1 bg-transparent border-none outline-none
          text-perplexity-text placeholder-perplexity-text-muted
          text-sm leading-relaxed
        "
        aria-label="Search input"
      />

      {/* Right action buttons */}
      <div className="flex items-center gap-1">
        {rightActions.map((action, index) => (
          <Button
            key={`right-${index}`}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={action.action}
            aria-label={action.label}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        aria-label="File upload input"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';