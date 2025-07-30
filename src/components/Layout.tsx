/**
 * Layout Component
 * 
 * Main application layout for the FlowKey interface
 * Provides the overall structure with sidebar and main content area
 * Handles responsive behavior, accessibility, and New Chat functionality
 * 
 * @component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Layout Props
 */
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  onNewChat?: () => void;
}

/**
 * Main Layout Component
 * 
 * Wraps the entire application with consistent layout structure
 * Includes sidebar navigation and main content area
 * Handles responsive design, accessibility features, and New Chat functionality
 */
export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  onNewChat
}) => {
  const navigate = useNavigate();

  /**
   * Handle New Chat action
   * Clears the current state and navigates to home
   */
  const handleNewChat = () => {
    // Call the parent's onNewChat if provided
    if (onNewChat) {
      onNewChat();
    }
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <TooltipProvider>
      <div className={`
        min-h-screen w-full
        bg-perplexity-bg text-perplexity-text
        flex
        ${className}
      `}>
        {/* Left Sidebar */}
        <Sidebar onNewChat={handleNewChat} />
        
        {/* Main Content Area */}
        <main 
          className="
            flex-1 ml-16
            flex flex-col
            overflow-hidden
          "
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Layout;