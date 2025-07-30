/**
 * History Page Component
 * 
 * Displays the search history and previous conversations
 * Features a list of past searches with timestamps and the ability to restore or delete items
 * 
 * @component
 */

import React from 'react';
import { Layout } from '@/components/Layout';
import { History as HistoryComponent } from '@/components/History';

/**
 * History Page Component
 * 
 * Renders the history page with the History component
 * Provides a dedicated route for viewing search history
 */
const History: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-12">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-semibold text-perplexity-text mb-8 text-center">
            Search History
          </h1>
          <HistoryComponent />
        </div>
      </div>
    </Layout>
  );
};

export default History; 