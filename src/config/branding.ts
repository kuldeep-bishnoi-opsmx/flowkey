/**
 * Branding Configuration
 * 
 * Centralized configuration for all branding elements in the application
 * Replaces Perplexity branding with FlowKey branding as requested
 * 
 * Features:
 * - Configurable brand name and styling
 * - i18n ready string externalization
 * - Consistent branding across components
 */

/**
 * Primary brand configuration
 */
export const brandConfig = {
  /** Main brand name */
  name: 'FlowKey',
  /** Whether to show the pro badge */
  showProBadge: false,
  /** Pro badge text (not used since showProBadge is false) */
  proBadgeText: 'pro',
  /** Brand tagline or description */
  tagline: 'AI-powered search and discovery',
  /** Default size for logo display */
  defaultSize: 'md' as const
} as const;

/**
 * Logo size variants
 */
export type LogoSize = 'sm' | 'md' | 'lg';

/**
 * Brand color variants for different contexts
 */
export const brandColors = {
  primary: 'hsl(var(--perplexity-text))',
  accent: 'hsl(var(--perplexity-accent))',
  muted: 'hsl(var(--perplexity-text-muted))'
} as const;

/**
 * Typography configuration for brand elements
 */
export const brandTypography = {
  fontWeight: 'font-semibold',
  sizes: {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }
} as const;