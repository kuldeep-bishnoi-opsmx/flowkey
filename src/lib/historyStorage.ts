/**
 * History Storage Utility
 * 
 * Manages conversation history in local storage with unique conversation tracking
 * Provides functions for loading, saving, adding, updating, and deleting history items
 * Implements upsert functionality to prevent duplicate entries
 * 
 * @module historyStorage
 */

import { HistoryItem } from '@/types/history';

/** Local storage key for history items */
const HISTORY_STORAGE_KEY = 'flowkey_history';

/** Maximum number of history items to store */
const MAX_HISTORY_ITEMS = 100;

/**
 * Load history items from local storage
 * @returns Array of history items, or empty array if none found
 */
export const loadHistoryItems = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid history data format, resetting to empty array');
      return [];
    }

    // Convert timestamp strings back to Date objects and validate conversation data
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      conversation: Array.isArray(item.conversation) ? item.conversation : []
    }));
  } catch (error) {
    console.error('Failed to load history items:', error);
    return [];
  }
};

/**
 * Save history items to local storage
 * @param items - Array of history items to save
 */
export const saveHistoryItems = (items: HistoryItem[]): void => {
  try {
    // Limit the number of items to prevent storage issues
    const limitedItems = items.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedItems));
  } catch (error) {
    console.error('Failed to save history items:', error);
  }
};

/**
 * Upsert (update or insert) a history item
 * If an item with the same ID exists, it will be updated; otherwise, a new item will be added
 * @param item - The history item to upsert
 */
export const upsertHistoryItem = (item: HistoryItem): void => {
  try {
    const currentItems = loadHistoryItems();
    
    // Check if item with same ID already exists
    const existingIndex = currentItems.findIndex(existing => existing.id === item.id);
    
    if (existingIndex !== -1) {
      // Update existing item
      currentItems[existingIndex] = {
        ...item,
        timestamp: new Date() // Update timestamp when item is modified
      };
    } else {
      // Add new item to the beginning of the array
      currentItems.unshift({
        ...item,
        timestamp: new Date()
      });
    }
    
    saveHistoryItems(currentItems);
  } catch (error) {
    console.error('Failed to upsert history item:', error);
  }
};

/**
 * Add a new history item to the beginning of the history array
 * @param item - The history item to add
 * @deprecated Use upsertHistoryItem instead to prevent duplicates
 */
export const addHistoryItem = (item: HistoryItem): void => {
  console.warn('addHistoryItem is deprecated, use upsertHistoryItem instead');
  upsertHistoryItem(item);
};

/**
 * Delete a specific history item by ID
 * @param id - The ID of the history item to delete
 */
export const deleteHistoryItem = (id: string): void => {
  try {
    const currentItems = loadHistoryItems();
    const filteredItems = currentItems.filter(item => item.id !== id);
    saveHistoryItems(filteredItems);
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
};

/**
 * Clear all history items
 */
export const clearHistoryItems = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history items:', error);
  }
};

/**
 * Get the count of history items
 * @returns Number of history items currently stored
 */
export const getHistoryItemCount = (): number => {
  try {
    return loadHistoryItems().length;
  } catch (error) {
    console.error('Failed to get history item count:', error);
    return 0;
  }
};

/**
 * Find a history item by ID
 * @param id - The ID of the history item to find
 * @returns The history item if found, null otherwise
 */
export const findHistoryItemById = (id: string): HistoryItem | null => {
  try {
    const items = loadHistoryItems();
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Failed to find history item by ID:', error);
    return null;
  }
};

/**
 * Get history items by type
 * @param type - The type of history items to retrieve
 * @returns Array of history items of the specified type
 */
export const getHistoryItemsByType = (type: 'search' | 'chat' | 'interaction'): HistoryItem[] => {
  try {
    const items = loadHistoryItems();
    return items.filter(item => item.type === type);
  } catch (error) {
    console.error('Failed to get history items by type:', error);
    return [];
  }
}; 