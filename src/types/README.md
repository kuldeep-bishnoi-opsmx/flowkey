# Types Directory

This directory contains TypeScript type definitions and interfaces for the FlowKey application, providing comprehensive type safety and documentation for data structures.

## Type Files Overview

### `history.ts`
Comprehensive type definitions for the history feature, including:

#### Core Interfaces

**`HistoryItem`**
- Represents a single history entry (search, chat, or interaction)
- Includes metadata for result counts, duration, and additional data
- Supports different types: 'search', 'chat', 'interaction'

**`HistoryState`**
- Manages the overall state of the history feature
- Includes loading states, error handling, and pagination
- Supports infinite scrolling with `hasMore` and `currentPage`

**`HistoryAction`**
- Redux-style action types for history state management
- Supports loading, success, error, add, remove, and clear operations
- Type-safe payload definitions for each action

#### Component Props

**`HistoryProps`**
- Props interface for the main History component
- Configurable callbacks for item selection and deletion
- Optional styling and behavior customization

**`HistoryItemProps`**
- Props for individual history item components
- Click handlers, delete functionality, and accessibility features
- Flexible styling options

## Type Definition Patterns

### Interface Naming
- Use PascalCase for all interfaces
- Suffix with descriptive terms: `Props`, `State`, `Action`, `Config`
- Prefix with feature name for clarity: `HistoryItem`, `NavigationConfig`

### Optional vs Required
- Mark all optional properties with `?`
- Provide sensible defaults in component implementations
- Document when properties are conditionally required

### Generic Types
```typescript
interface ComponentProps<T = unknown> {
  data: T;
  onSelect: (item: T) => void;
}
```

### Event Handlers
```typescript
interface EventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}
```

## Integration with Components

### Props Validation
All component props should reference types from this directory:

```typescript
import { HistoryProps } from '@/types/history';

export const History: React.FC<HistoryProps> = (props) => {
  // Component implementation
};
```

### State Management
Type definitions support both local state and external state management:

```typescript
import { HistoryState, HistoryAction } from '@/types/history';

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  // Reducer implementation
};
```

## Best Practices

### Comprehensive Documentation
- Include JSDoc comments for all interfaces and properties
- Document expected values, constraints, and relationships
- Provide usage examples where helpful

### Extensibility
- Design interfaces to be easily extended
- Use union types for controlled vocabularies
- Consider future feature requirements

### Type Safety
- Use strict TypeScript settings
- Avoid `any` types in favor of specific interfaces
- Leverage utility types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`

### Consistency
- Follow established naming conventions
- Use consistent patterns across related types
- Align with component and configuration patterns

## Future Additions

When adding new types:

1. **Create focused type files** for each major feature area
2. **Export all types** from a central index file
3. **Document relationships** between related types
4. **Include usage examples** in JSDoc comments
5. **Maintain backward compatibility** when updating existing types

## Testing Types

Types should be validated through:
- Component prop usage
- Function parameter validation  
- State management integration
- API response typing

The TypeScript compiler serves as the primary validation tool, with strict mode ensuring comprehensive type checking.