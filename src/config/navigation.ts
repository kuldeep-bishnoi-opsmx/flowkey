/**
 * Navigation Configuration
 * 
 * Centralized configuration for all navigation items in the application
 * This file defines the structure, icons, and behavior of sidebar navigation
 * 
 * Features:
 * - Type-safe navigation items
 * - Configurable icons and labels
 * - React Router integration with path-based routing
 * - i18n ready string externalization
 */

import { 
  Plus, 
  Home, 
  History,
  LucideIcon
} from 'lucide-react';

/**
 * Navigation item interface
 * Defines the structure of each navigation item
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Display label for the navigation item */
  label: string;
  /** Path for routing */
  path: string;
  /** Visual variant for special styling */
  variant?: 'default' | 'accent' | 'user';
  /** Whether this item is currently active */
  isActive?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Main navigation configuration
 * Defines the primary navigation items in the sidebar
 */
export const mainNavigationItems: NavigationItem[] = [
  {
    id: 'new-chat',
    icon: Plus,
    label: 'New Chat',
    path: '/',
    variant: 'accent',
    ariaLabel: 'Start a new chat conversation'
  },
  {
    id: 'home',
    icon: Home,
    label: 'Home',
    path: '/',
    isActive: true,
    ariaLabel: 'Go to home page'
  },
  {
    id: 'history',
    icon: History,
    label: 'History',
    path: '/history',
    ariaLabel: 'View chat history'
  }
];

/**
 * Bottom navigation configuration
 * Currently empty as per requirements (no Account, Upgrade, Install buttons)
 */
export const bottomNavigationItems: NavigationItem[] = [];

/**
 * All navigation items combined
 * Useful for operations that need to work with all navigation items
 */
export const allNavigationItems: NavigationItem[] = [
  ...mainNavigationItems,
  ...bottomNavigationItems
];

/**
 * Helper function to find navigation item by ID
 * @param id - The unique identifier of the navigation item
 * @returns The navigation item if found, undefined otherwise
 */
export const findNavigationItemById = (id: string): NavigationItem | undefined => {
  return allNavigationItems.find(item => item.id === id);
};

/**
 * Helper function to update navigation item active state
 * @param activeId - The ID of the item that should be active
 * @returns Updated navigation items with correct active states
 */
export const updateActiveNavigationItem = (activeId: string): NavigationItem[] => {
  return allNavigationItems.map(item => ({
    ...item,
    isActive: item.id === activeId
  }));
};