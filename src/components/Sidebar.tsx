/**
 * Sidebar Component
 * 
 * Left navigation sidebar for the FlowKey interface
 * Features vertical navigation with icons for different sections
 * Includes animated hover states, focus management, and React Router integration
 * 
 * @component
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mainNavigationItems, bottomNavigationItems, NavigationItem } from '@/config/navigation';

/**
 * Sidebar Props
 */
interface SidebarProps {
  className?: string;
  onNewChat?: () => void;
}

/**
 * Individual navigation button component using NavLink
 */
const NavButton: React.FC<{ 
  item: NavigationItem; 
  onNewChat?: () => void;
}> = ({ 
  item, 
  onNewChat 
}) => {
  const Icon = item.icon;
  
  // Special handling for New Chat button
  const handleClick = (e: React.MouseEvent) => {
    if (item.id === 'new-chat' && onNewChat) {
      e.preventDefault();
      onNewChat();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={item.path}
          onClick={handleClick}
          className={({ isActive }) => `
            w-10 h-10 rounded-lg
            flex items-center justify-center
            hover:bg-perplexity-surface-hover
            focus:ring-2 focus:ring-perplexity-accent focus:ring-offset-2 focus:ring-offset-perplexity-bg
            transition-all duration-200
            ${isActive ? 'bg-perplexity-surface text-perplexity-accent' : 'text-perplexity-text-muted hover:text-perplexity-text'}
            ${item.variant === 'accent' ? 'text-perplexity-accent hover:text-perplexity-accent' : ''}
          `}
          aria-label={item.ariaLabel || item.label}
        >
          <Icon className="w-5 h-5" />
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-perplexity-surface border-perplexity-border">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * Main Sidebar Component
 * 
 * Renders the left navigation sidebar with all navigation items
 * Handles keyboard navigation, accessibility, and React Router integration
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  className = '',
  onNewChat 
}) => {

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Allow natural tab navigation
      return;
    }
    
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      // TODO: Implement arrow key navigation between sidebar items
    }
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 z-50
        h-screen w-16
        bg-perplexity-bg border-r border-perplexity-border
        flex flex-col items-center
        py-6
        animate-slide-in
        ${className}
      `}
      role="navigation"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      {/* Top navigation items */}
      <nav className="flex flex-col gap-3 mb-auto">
        {mainNavigationItems.map((item) => (
          <NavButton 
            key={item.id} 
            item={item}
            onNewChat={onNewChat}
          />
        ))}
      </nav>

      {/* Bottom navigation items */}
      {bottomNavigationItems.length > 0 && (
        <nav className="flex flex-col gap-3">
          {bottomNavigationItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item}
              onNewChat={onNewChat}
            />
          ))}
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;