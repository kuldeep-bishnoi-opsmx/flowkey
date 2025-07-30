# FlowKey

A modern, accessible frontend application built with React, TypeScript, and Tailwind CSS. Features real-time AI-powered continuous chat functionality through Google Gemini API integration with persistent conversation history and streaming responses.

## Key Features

### Continuous Chat
- Real-time conversation with Google Gemini 2.5 Pro model
- Persistent conversation history with unique session tracking
- Context preservation across multiple messages
- Comprehensive error handling for API failures

### Mermaid Diagram Integration
- User-triggered workflow generation with inline diagram rendering
- Progressive retry logic with simplified prompts for reliable generation
- Client-side script validation before rendering attempts
- Client-side Mermaid.js rendering for fast, secure diagram display
- SVG export functionality for generated diagrams
- Copy-to-clipboard functionality for raw Mermaid scripts
- Comprehensive error handling with user-friendly messages

### Design System
- HSL-based color palette for consistent theming
- WCAG 2.1 AA+ accessibility compliance
- Responsive design with mobile optimization
- Configuration-driven architecture

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API (gemini-2.5-pro) with streaming support
- **Diagram Rendering**: Mermaid.js (client-side)
- **State Management**: React hooks with local storage
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FlowKey
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Chat Interface
- Type your questions in the search bar
- Engage in natural conversation with Google Gemini AI
- View streaming responses in real-time
- Access conversation history and context

### Workflow Generation
- Click the "Generate Workflow" button or type "generate workflow" to create diagrams
- System uses progressive retry logic with simpler prompts if initial attempts fail
- Diagrams are validated and rendered inline using client-side Mermaid.js
- Export diagrams as SVG files with configurable naming
- View and copy raw Mermaid scripts
- Clear error messages if diagram generation isn't possible

### History Management
- All conversations are automatically saved to local storage
- Access previous conversations through the History sidebar
- Each conversation maintains full context and Mermaid scripts

## Architecture

### Component Structure
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

## Development

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for consistent code style
- Comprehensive TSDoc comments throughout
- WCAG 2.1 AA+ accessibility compliance

### Testing
- Unit tests for components and utilities
- Integration tests for user workflows
- End-to-end tests for critical paths

### Building for Production
```bash
npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for chat functionality | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
