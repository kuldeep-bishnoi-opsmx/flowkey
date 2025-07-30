/**
 * History Component
 * 
 * Displays a list of previous search queries and interactions
 * Features scrolling, keyboard navigation, and accessible ARIA markup
 * Handles empty states gracefully with user-friendly messaging
 * Integrates with local storage for persistent history management
 * 
 * @component
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Search, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HistoryItem, HistoryProps, HistoryItemProps } from '@/types/history';
import { loadHistoryItems, deleteHistoryItem, saveHistoryItems } from '@/lib/historyStorage';

/**
 * Individual History Item Component
 * 
 * Renders a single history item with accessibility and interaction support
 */
const HistoryItemComponent: React.FC<HistoryItemProps> = ({
  item,
  onClick,
  onDelete,
  showDeleteButton = false,
  className = ''
}) => {
  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  /**
   * Handle item click
   */
  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [item, onClick]);

  /**
   * Handle delete click
   */
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.id);
  }, [item.id, onDelete]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div
      className={`
        group flex items-start gap-3 p-3 rounded-lg
        hover:bg-perplexity-surface-hover cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perplexity-accent
        transition-all duration-200
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select history item: ${item.title}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {item.type === 'search' ? (
          <Search className="w-4 h-4 text-perplexity-text-muted" />
        ) : (
          <Clock className="w-4 h-4 text-perplexity-text-muted" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-perplexity-text truncate">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-perplexity-text-muted mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-perplexity-text-muted">
            {formatTimestamp(item.timestamp)}
          </span>
          {item.metadata?.resultCount && (
            <span className="text-xs text-perplexity-text-muted">
              • {item.metadata.resultCount} results
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      {showDeleteButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="
                w-6 h-6 opacity-0 group-hover:opacity-100
                hover:bg-destructive/10 hover:text-destructive
                transition-all duration-200
              "
              onClick={handleDelete}
              aria-label={`Delete history item: ${item.title}`}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Delete from history</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

/**
 * Empty State Component
 * 
 * Displays when there are no history items
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <Clock className="w-12 h-12 text-perplexity-text-muted mb-4" />
    <h3 className="text-lg font-medium text-perplexity-text mb-2">
      No history yet
    </h3>
    <p className="text-sm text-perplexity-text-muted max-w-sm">
      Your search queries and conversations will appear here for easy access.
    </p>
  </div>
);

/**
 * Error State Component
 * 
 * Displays when there's an error loading history
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <Alert className="m-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>{error}</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

/**
 * Main History Component
 * 
 * Container component that manages history state and renders the history list
 * Integrates with local storage for persistent history management
 */
export const History: React.FC<HistoryProps> = ({
  className = '',
  onItemSelect,
  onItemDelete,
  maxItems = 50,
  showDeleteButton = true
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load history items from local storage
   */
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load items from local storage
      const items = loadHistoryItems();
      
      // Limit items based on maxItems prop
      const limitedItems = items.slice(0, maxItems);
      setHistoryItems(limitedItems);
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [maxItems]);

  /**
   * Handle item deletion from local storage
   */
  const handleItemDelete = useCallback((itemId: string) => {
    try {
      // Delete from local storage
      deleteHistoryItem(itemId);
      
      // Update local state
      setHistoryItems(prev => prev.filter(item => item.id !== itemId));
      
      // Call parent callback if provided
      onItemDelete?.(itemId);
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Failed to delete item. Please try again.');
    }
  }, [onItemDelete]);

  /**
   * Handle item selection
   */
  const handleItemSelect = useCallback((item: HistoryItem) => {
    onItemSelect?.(item);
  }, [onItemSelect]);

  /**
   * Load history on component mount
   */
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * Handle keyboard navigation for the container
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Focus management would be implemented here
      // For now, we rely on natural tab navigation
    }
  }, []);

  return (
    <div 
      className={`
        h-full flex flex-col
        bg-perplexity-bg
        ${className}
      `}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Search history"
    >
      {/* Header */}
      <div className="p-4 border-b border-perplexity-border">
        <h2 className="text-lg font-semibold text-perplexity-text">
          History
        </h2>
        <p className="text-sm text-perplexity-text-muted mt-1">
          Recent searches and conversations
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <ErrorState error={error} onRetry={loadHistory} />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perplexity-accent"></div>
          </div>
        ) : historyItems.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {historyItems.map((item) => (
                <HistoryItemComponent
                  key={item.id}
                  item={item}
                  onClick={handleItemSelect}
                  onDelete={handleItemDelete}
                  showDeleteButton={showDeleteButton}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default History;