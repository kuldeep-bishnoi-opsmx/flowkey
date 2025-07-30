# Configuration Directory

This directory contains all configuration files for the FlowKey application, implementing a centralized configuration approach to avoid hardcoding throughout the codebase.

## Files Overview

### `navigation.ts`
- **Purpose**: Defines all navigation items for the sidebar
- **Features**: 
  - Type-safe navigation item definitions
  - Configurable icons, labels, and actions
  - Support for different variants (default, accent, user)
  - Helper functions for navigation state management

### `branding.ts`
- **Purpose**: Centralizes all branding elements for the FlowKey application
- **Features**:
  - Brand name configuration (FlowKey)
  - Logo sizing and typography settings
  - Color variants for different contexts
  - Consistent branding across components

## Usage Patterns

### Adding New Navigation Items
```typescript
// In navigation.ts
export const mainNavigationItems: NavigationItem[] = [
  {
    id: 'my-feature',
    icon: MyIcon,
    label: 'My Feature',
    ariaLabel: 'Access my feature'
  }
  // ... other items
];
```

### Updating Brand Configuration
```typescript
// In branding.ts
export const brandConfig = {
  name: 'YourBrand',
  showProBadge: false,
  // ... other settings
};
```

## Integration Points

- **Components**: All UI components should import configurations instead of hardcoding values
- **i18n**: Label strings should be externalized for internationalization
- **Theming**: Colors and typography use the design system tokens
- **Accessibility**: ARIA labels and accessibility features are configured centrally

## Best Practices

1. **No Hardcoding**: All navigation items, labels, and configurations must be defined here
2. **Type Safety**: Use TypeScript interfaces for all configuration objects
3. **Extensibility**: Design configurations to be easily extended without breaking changes
4. **Documentation**: Document all configuration options and their purposes
