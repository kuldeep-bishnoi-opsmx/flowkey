# Components Directory

This directory contains all React components for the FlowKey application, organized in a feature-first approach with comprehensive documentation and accessibility support.

## Component Overview

### Core Layout Components

#### `Layout.tsx`
- **Purpose**: Main application layout wrapper
- **Features**: Sidebar integration, tooltip provider, responsive design
- **Props**: `children`, `className`
- **Dependencies**: Sidebar, TooltipProvider

#### `Sidebar.tsx`
- **Purpose**: Left navigation sidebar with configurable items
- **Features**: Icon navigation, tooltips, keyboard accessibility
- **Configuration**: Uses `src/config/navigation.ts`
- **Props**: `className`

### Content Components

#### `HomePage.tsx`
- **Purpose**: Main landing page with search interface
- **Features**: Brand logo, search bar, welcome content, quick actions
- **Props**: `className`
- **State**: Search results, loading states

#### `PerplexityLogo.tsx` (now FlowKeyLogo)
- **Purpose**: Brand logo component with configurable styling
- **Features**: Multiple sizes, optional pro badge, hover animations
- **Configuration**: Uses `src/config/branding.ts`
- **Props**: `className`, `showProBadge`, `size`

#### `SearchBar.tsx`
- **Purpose**: Advanced search input with multi-modal support
- **Features**: Text input, voice activation, file upload, validation
- **Props**: `onSearch`, `onVoiceInput`, `onFileUpload`, `placeholder`, `className`
- **Accessibility**: Full keyboard support, ARIA labels

#### `History.tsx`
- **Purpose**: Search history management and display
- **Features**: Item list, deletion, restoration, empty states, error handling
- **Props**: `className`, `onItemSelect`, `onItemDelete`, `maxItems`, `showDeleteButton`
- **Types**: Defined in `src/types/history.ts`

## Component Architecture

### Design Principles

1. **Configuration-Driven**: Components use external configuration instead of hardcoded values
2. **Accessibility First**: All components implement WCAG 2.1 AA+ standards
3. **Type Safety**: Comprehensive TypeScript interfaces for all props and state
4. **Composability**: Components are designed to be easily composed and reused
5. **Documentation**: TSDoc comments for all components, props, and major functions

### Common Patterns

#### Props Interface
```typescript
interface ComponentProps {
  className?: string;        // Optional CSS classes
  children?: React.ReactNode; // Child components (when applicable)
  // ... specific props
}
```

#### Event Handlers
```typescript
const handleEvent = useCallback((param: Type) => {
  // Event handling logic
}, [dependencies]);
```

#### Accessibility
- Semantic HTML elements
- ARIA labels and descriptions  
- Keyboard event handling
- Focus management
- Screen reader optimization

### State Management

Components use local state for UI-specific concerns and accept props for data and event handling. This approach promotes:

- **Reusability**: Components aren't tied to specific data sources
- **Testability**: Easy to test with mock props
- **Flexibility**: Can be used in different contexts

## UI Components (`ui/` directory)

The `ui/` directory contains shadcn/ui components that provide the foundational design system:

- **Consistent Styling**: All components use the same design tokens
- **Accessibility**: Built-in accessibility features
- **Customization**: Easily customizable through variants and props
- **Documentation**: Each component includes usage examples

## Integration Guidelines

### Adding New Components

1. **Create Component File**: Use PascalCase naming (e.g., `MyComponent.tsx`)
2. **Add Interface**: Define props interface with proper TypeScript
3. **Implement Component**: Follow established patterns and accessibility guidelines
4. **Add Documentation**: Include TSDoc comments for all public APIs
5. **Export Component**: Add to appropriate index files

### Using Existing Components

```typescript
import { ComponentName } from '@/components/ComponentName';

// In your JSX
<ComponentName 
  prop1="value1"
  prop2={value2}
  onEvent={handleEvent}
  className="custom-styles"
/>
```

### Configuration Integration

Components should import configuration from `src/config/` instead of hardcoding values:

```typescript
import { navigationItems } from '@/config/navigation';
import { brandConfig } from '@/config/branding';
```

## Testing Components

### Unit Tests
- Test component rendering
- Verify prop handling
- Check event callbacks
- Validate accessibility attributes

### Integration Tests  
- Test component composition
- Verify configuration integration
- Check responsive behavior

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast

## Performance Considerations

- **Lazy Loading**: Large components use React.lazy()
- **Memoization**: useCallback and useMemo for expensive operations
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Error Boundaries**: Graceful error handling and fallbacks

## Best Practices

1. **Single Responsibility**: Each component has a clear, focused purpose
2. **Prop Validation**: Use TypeScript interfaces for all props
3. **Error Handling**: Implement proper error states and fallbacks
4. **Performance**: Optimize re-renders and bundle size
5. **Accessibility**: Test with keyboard and screen readers
6. **Documentation**: Keep TSDoc comments up-to-date