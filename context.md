# FlowKey Application - Technical Context

## Project Overview

FlowKey is a modern, accessible frontend application inspired by Perplexity AI's interface, built with React, TypeScript, and Tailwind CSS. The application has been completely refactored from the original Perplexity clone to meet specific requirements while maintaining production-quality standards. **The application now features real-time AI-powered continuous chat functionality through Google Gemini API integration with persistent conversation history.**

## Key Changes Implemented

### 1. Branding Update
- **Original**: Perplexity AI with "pro" badge
- **New**: FlowKey brand (no pro badge)
- **Implementation**: Centralized in `src/config/branding.ts`

### 2. Navigation Restructuring
- **Removed**: Discover, Account, Upgrade, Install buttons
- **Replaced**: "Spaces" with "History" 
- **Added**: Full History component with search/chat tracking
- **Configuration**: Centralized in `src/config/navigation.ts`

### 3. Architecture Improvements
- **No Hardcoding**: All UI elements driven by configuration
- **Type Safety**: Comprehensive TypeScript interfaces
- **Accessibility**: WCAG 2.1 AA+ compliance throughout
- **Documentation**: TSDoc comments and README files

### 4. Google Gemini API Integration
- **Real-time Chat**: Powered by Google Gemini 2.5 Flash Lite model using @google/genai
- **Streaming Responses**: Real-time streaming of AI responses with enhanced capabilities
- **Continuous Conversation**: Maintains context across multiple messages
- **Enhanced Tools**: Code execution and Google Search integration capabilities
- **Error Handling**: Comprehensive error handling for API failures
- **Type Safety**: Full TypeScript interfaces for API responses
- **Environment Configuration**: Secure API key management via `.env`

### 5. Continuous Chat Architecture
- **Chat Interface**: Real-time conversation bubbles with user/assistant differentiation
- **Message Actions**: Thumbs up/down, copy, share, edit, regenerate functionality
- **Conversation History**: Persistent storage of full conversations with unique conversation tracking
- **Context Preservation**: Maintains conversation context for AI responses
- **Visual Design**: Chat bubbles similar to modern messaging applications
- **Unique Conversation Sessions**: Each conversation has a unique ID to prevent duplicate entries
- **Upsert Functionality**: History items are updated rather than duplicated when conversations continue
- **Mermaid Workflow Generation**: User-triggered diagram generation with inline display

### 6. Mermaid Workflow Generation
- **User-Triggered Process**: Only generates workflows when explicitly requested by user
- **Configuration-Driven**: All strings, prompts, and settings externalized to simplified configuration
- **Retry Logic**: Progressive retry mechanism with simpler prompts on failure
- **Script Validation**: Client-side validation before rendering attempts
- **Dual Trigger Methods**: Text command ("generate workflow") or UI button
- **Real-time Processing**: Loading states and progress indicators during generation
- **Comprehensive Error Handling**: Configuration-driven error messages and graceful failure handling
- **Type Safety**: Full TypeScript interfaces for all workflow-related configurations
- **Simplified Prompts**: Focused, concise prompts that reduce AI confusion and syntax errors
- **Timeout Protection**: Generation attempts are bounded by configurable timeouts

## Current Component Architecture

### Core Layout
```
Layout.tsx (main wrapper)
├── Sidebar.tsx (configurable navigation)
└── HomePage.tsx (main content area)
    ├── FlowKeyLogo.tsx (brand display)
    ├── ChatContainer.tsx (conversation display)
    ├── ChatMessage.tsx (individual message bubbles)
    ├── SearchBar.tsx (input interface)
    └── History.tsx (conversation history management)
```

### Configuration System
```
src/config/
├── navigation.ts    # Sidebar navigation items
├── branding.ts      # Brand configuration
└── workflow.ts      # Mermaid workflow generation configuration
```

### Type Definitions
```
src/types/
├── history.ts       # History feature types
├── search.ts        # Search and API response types
└── chat.ts          # Chat message and conversation types (includes Mermaid)
```

### API Integration
```
src/lib/
├── gemini.ts        # Google Gemini API client and utilities
```

## Component Details

### HomePage (`src/components/HomePage.tsx`)
- **Continuous Chat**: Manages conversation state with ChatMessageUnion array
- **Context Preservation**: Sends full conversation history to OpenAI API
- **History Integration**: Automatically saves conversations to local storage
- **Error Handling**: Displays user-friendly error messages for API failures
- **Loading States**: Shows typing indicators during AI responses
- **New Chat**: Clears conversation and saves to history when starting new chat
- **Mermaid Orchestration**: Manages workflow generation process and state
- **Workflow Triggers**: Handles both text command and button-based workflow generation

### ChatContainer (`src/components/ChatContainer.tsx`)
- **Message Display**: Scrollable container for conversation messages
- **Auto-scroll**: Automatically scrolls to latest messages
- **Loading Indicator**: Shows typing animation during AI responses
- **Responsive Layout**: Adapts to different screen sizes

### ChatMessage (`src/components/ChatMessage.tsx`)
- **Visual Differentiation**: User messages (blue, right-aligned) vs Assistant messages (grey, left-aligned)
- **Message Actions**: Thumbs up/down, copy, share, edit, regenerate buttons
- **Accessibility**: Full keyboard navigation and ARIA support
- **Timestamps**: Displays message timestamps
- **Error States**: Shows error messages for failed responses
- **Mermaid Rendering**: Inline display of workflow diagrams with loading states
- **Diagram Support**: Renders Mermaid diagrams as images with proper alt text
- **Enhanced Styling**: Improved visual presentation with padding, shadows, and rounded corners
- **Export Functionality**: SVG export button for downloading diagrams

### SearchBar (`src/components/SearchBar.tsx`)
- **Controlled Component**: External state management for input value
- **Multi-Modal**: Text input and file upload support
- **Real-time Updates**: Immediate UI updates as user types
- **Keyboard Shortcuts**: Enter to send, Escape to clear
- **API Integration**: Triggers OpenAI API calls through `onSearch` prop
- **Workflow Generation**: Button and command-based workflow trigger
- **Configuration-Driven**: All workflow-related strings from configuration

### OpenAI Integration (`src/lib/openai.ts`)
- **Client Configuration**: Initialized with environment API key
- **Error Handling**: Standardized error handling for different API error types
- **Validation**: API key validation utilities
- **Default Parameters**: Pre-configured chat completion parameters
- **Mermaid Script Generation**: Generates Mermaid scripts from conversation history
- **Enhanced Script Validation**: Robust validation with aggressive cleaning and syntax checking
- **Prompt Engineering**: Highly prescriptive prompts for consistent Mermaid script generation

### Mermaid Client-Side Rendering
- **Client-Side Rendering**: Uses Mermaid.js library for browser-based diagram rendering
- **No External Dependencies**: Eliminates need for external API calls and authentication
- **Error Handling**: Comprehensive error handling for rendering failures
- **Direct Script Processing**: Processes Mermaid scripts directly without URL encoding
- **Performance Benefits**: Faster rendering without network requests

### Gemini Integration (`src/lib/gemini.ts`)
- **Client Configuration**: Initialized with environment API key and proper validation
- **Retry Logic**: Progressive retry system with 3 attempts using simpler prompts
- **Script Validation**: Client-side Mermaid syntax validation before rendering
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Timeout Protection**: Configurable timeouts prevent hanging requests
- **Configuration-Driven**: All prompts and messages externalized to workflow config
- **Performance Optimized**: Separate configurations for chat vs. diagram generation

### Workflow Configuration (`src/config/workflow.ts`)
- **Progressive Prompts**: Three levels of prompt complexity for retry logic
- **User Messages**: Centralized, configuration-driven user-facing messages
- **Validation Settings**: Script length limits and syntax validation rules
- **Trigger Configuration**: Text commands and button settings
- **Accessibility Config**: Alt text and ARIA labels for generated diagrams
- **Export Configuration**: File naming and supported formats

## Design System

### Color Palette (HSL-based)
- **Background**: `210 11% 15%` - Main dark background
- **Surface**: `210 11% 17%` - Card and component backgrounds  
- **Accent**: `180 100% 50%` - Cyan brand accent
- **Text Primary**: `0 0% 95%` - Main text color
- **Text Muted**: `0 0% 60%` - Secondary text
- **Error**: `0 100% 50%` - Red for error states
- **User Message**: `217 91% 60%` - Blue for user messages
- **Assistant Message**: `210 11% 17%` - Grey for assistant messages

### Typography
- **Brand**: `font-semibold` with configurable sizes
- **Body**: Standard weights with semantic classes
- **Sizes**: `sm: text-2xl`, `md: text-3xl`, `lg: text-4xl`

## Development Standards

### Code Quality
- **TypeScript Strict Mode**: All code fully typed
- **ESLint Configuration**: Consistent code style
- **Documentation**: TSDoc comments throughout
- **Error Handling**: Comprehensive error states and graceful error handling

### Accessibility
- **WCAG 2.1 AA+**: Full compliance implemented
- **Keyboard Navigation**: Complete keyboard operability
- **Screen Readers**: Optimized for assistive technology
- **ARIA Labels**: Comprehensive labeling system

### Performance
- **Bundle Optimization**: Tree shaking and code splitting
- **React Optimization**: useCallback, useMemo where appropriate
- **CSS Optimization**: Tailwind purging and semantic classes
- **Image Optimization**: Proper alt text and loading strategies

## API Integration

### Google Gemini Configuration
- **Environment Variable**: `VITE_GEMINI_API_KEY` in `.env` file
- **Model**: gemini-2.5-flash-lite for chat completions
- **Package**: @google/genai with streaming support
- **Parameters**: 1000 max output tokens, 0.7 temperature, streaming enabled
- **Enhanced Features**: Code execution and Google Search integration
- **Error Types**: Authentication, rate limiting, invalid requests, network errors

### Chat Flow
1. **User Input**: Query entered in SearchBar component
2. **Conversation ID Generation**: Unique conversation ID created for new conversations
3. **Message Creation**: User message added to conversation array
4. **Context Preparation**: Full conversation history sent to OpenAI API
5. **API Call**: Google Gemini chat completion with conversation context
6. **Response Processing**: Assistant message added to conversation
7. **History Persistence**: Conversation saved to local storage using upsert functionality
8. **UI Update**: Chat bubbles updated with new messages
9. **Unique Storage**: Each conversation session stored with unique ID to prevent duplicates

### Type Safety
- **ChatMessage**: Interface for individual chat messages
- **Conversation**: Interface for complete conversation sessions
- **HistoryItem**: Interface for history storage with full conversation data and unique tracking
- **SearchError**: Interface for standardized error handling
- **Conversation ID Management**: UUID-based unique conversation tracking

## Integration Points

### Configuration Management
- **Navigation**: Modify `src/config/navigation.ts` to update sidebar
- **Branding**: Update `src/config/branding.ts` for brand changes
- **API Settings**: Configure OpenAI parameters in `src/lib/openai.ts`

### Data Integration
- **History API**: History component ready for API integration
- **Local Storage**: Persistent conversation history management with unique session tracking
- **Type Safety**: Full TypeScript interfaces for all data structures
- **Conversation Persistence**: Full conversation data stored and retrieved with upsert functionality

### Feature Extensibility
- **Navigation**: Easy to add/remove navigation items
- **History**: Configurable callbacks for external state management with full conversation data
- **Search**: Multi-modal support ready for backend integration
- **API Models**: Easy to switch between different Gemini models
- **Message Actions**: Extensible action system for chat messages
- **Conversation Management**: Unique session tracking and history persistence

## Environment Setup

### Required Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation Steps
1. **Install Dependencies**: `npm install @google/genai mime uuid @types/uuid mermaid`
2. **Create .env File**: Add Gemini API key to root directory
3. **Update .gitignore**: Ensure `.env` is excluded from version control
4. **Restart Development Server**: For environment variable changes to take effect

## Outstanding Technical Debt

### None Currently
The comprehensive refactoring has addressed all major workflow generation issues:
- ✅ Eliminated hardcoded values throughout the workflow system
- ✅ Implemented proper TypeScript interfaces with strict typing
- ✅ Added comprehensive documentation and configuration
- ✅ Ensured accessibility compliance for diagram generation
- ✅ Created fully configurable architecture
- ✅ Integrated reliable Gemini API with proper error handling
- ✅ Implemented retry logic with progressive prompt simplification
- ✅ Added client-side script validation before rendering
- ✅ Removed complex Google Search integration that caused failures
- ✅ Simplified prompts to reduce AI confusion and syntax errors
- ✅ Added timeout protection and comprehensive error handling

## Future Enhancement Opportunities

### Backend Integration
- **Authentication**: Ready for user account integration
- **Search API**: SearchBar component prepared for API calls
- **History Persistence**: History component ready for backend storage
- **Real-time Updates**: Architecture supports WebSocket integration

### Feature Additions
- **Search Filters**: Easily extensible search configuration
- **Theme Switching**: Design system ready for multiple themes
- **Internationalization**: String externalization ready for i18n
- **Advanced History**: Sorting, filtering, and search within history
- **Streaming Responses**: Real-time streaming of AI responses
- **File Processing**: AI-powered file content analysis
- **Voice Input**: Speech-to-text integration
- **Message Editing**: In-place message editing functionality
- **Diagram Export**: ✅ SVG export functionality for Mermaid diagrams

### Performance Optimizations
- **Virtual Scrolling**: For large conversation histories
- **Image Lazy Loading**: For search results with images
- **Progressive Loading**: For search result streams
- **Caching Strategy**: For frequently accessed data
- **Response Caching**: Cache common search results
- **Message Pagination**: Load conversations in chunks

## Testing Strategy

### Unit Testing
- **Component Testing**: All major components tested
- **Hook Testing**: Custom hooks with comprehensive coverage
- **Utility Testing**: Helper functions and configurations
- **Type Testing**: TypeScript compilation as validation
- **API Testing**: Mock OpenAI API responses

### Integration Testing
- **User Workflows**: Complete user interaction flows
- **Accessibility Testing**: Keyboard and screen reader testing
- **Responsive Testing**: Multi-device and viewport testing
- **Configuration Testing**: Verify configuration-driven behavior
- **API Integration**: Test OpenAI API integration flows
- **Chat Flow**: Test continuous conversation functionality

### End-to-End Testing
- **Critical Paths**: Search, navigation, history management, chat conversations
- **Error Scenarios**: Network failures, invalid inputs, API errors
- **Performance Testing**: Loading times and interaction responsiveness
- **Cross-browser Testing**: Modern browser compatibility

## Deployment Considerations

### Build Optimization
- **Bundle Size**: Optimized for fast loading
- **Asset Optimization**: Images and static assets optimized
- **Cache Strategy**: Proper cache headers for static assets
- **Progressive Enhancement**: Graceful degradation for older browsers

### Monitoring
- **Error Tracking**: Ready for error monitoring integration
- **Performance Monitoring**: Core Web Vitals optimization
- **User Analytics**: Privacy-compliant user interaction tracking
- **Accessibility Monitoring**: Automated accessibility testing
- **API Monitoring**: Track Gemini API usage and errors
- **Chat Analytics**: Monitor conversation patterns and user engagement

This context document should be updated whenever significant architectural changes are made to the application.