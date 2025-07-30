/**
 * Index Page - Home Page for FlowKey Application
 * 
 * Main entry point for the application
 * Renders the FlowKey interface with sidebar navigation and search functionality
 * 
 * Features:
 * - Dark theme matching FlowKey design
 * - Sidebar navigation with icons
 * - Centered logo
 * - Advanced search bar with OpenAI integration
 * - Responsive design and accessibility support
 * - New Chat functionality for clearing search state
 * - Local storage integration for history management
 * - History item selection for loading previous conversations
 */

import React, { useRef } from 'react';
import { Layout } from '@/components/Layout';
import { HomePage, HomePageRef } from '@/components/HomePage';
import { HistoryItem } from '@/types/history';

/**
 * Main Index Component
 * 
 * Entry point for the FlowKey interface
 * Combines layout and home page components for a complete experience
 * Handles New Chat functionality for clearing search state
 * Manages history integration with local storage
 * Handles history item selection for loading previous conversations
 */
const Index: React.FC = () => {
  const homePageRef = useRef<HomePageRef>(null);

  /**
   * Handle New Chat action
   * Resets the HomePage state and clears search results
   */
  const handleNewChat = () => {
    if (homePageRef.current) {
      homePageRef.current.startNewChat();
    }
  };

  /**
   * Handle history item selection
   * Loads the selected conversation into the HomePage
   * @param item - The selected history item containing conversation data
   */
  const handleHistoryItemSelect = (item: HistoryItem) => {
    // The HomePage component will handle loading the conversation
    // This callback is passed to HomePage for history integration
    console.log('History item selected:', item.title);
  };

  return (
    <Layout onNewChat={handleNewChat}>
      <HomePage 
        ref={homePageRef} 
        onNewChat={handleNewChat}
        onItemSelect={handleHistoryItemSelect}
      />
    </Layout>
  );
};

export default Index;
