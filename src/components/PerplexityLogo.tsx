/**
 * FlowKey Logo Component
 * 
 * Displays the FlowKey brand logo with configurable styling
 * Features smooth animations and accessibility support
 * 
 * @component
 */

import React from 'react';
import { brandConfig, brandTypography, LogoSize } from '@/config/branding';

/**
 * FlowKey Logo Props
 */
interface FlowKeyLogoProps {
  className?: string;
  showProBadge?: boolean;
  size?: LogoSize;
}

/**
 * Main FlowKey Logo Component
 * 
 * Renders the FlowKey brand logo with configurable styling
 * Includes hover animations and accessibility attributes
 */
export const FlowKeyLogo: React.FC<FlowKeyLogoProps> = ({
  className = '',
  showProBadge = brandConfig.showProBadge,
  size = brandConfig.defaultSize
}) => {
  return (
    <div 
      className={`
        flex items-center justify-center gap-2
        animate-fade-in
        ${className}
      `}
      role="banner"
      aria-label={brandConfig.name}
    >
      <h1 className={`
        ${brandTypography.fontWeight} text-perplexity-text
        transition-transform duration-200 hover:scale-105
        ${brandTypography.sizes[size]}
      `}>
        {brandConfig.name}
        {showProBadge && (
          <span className="
            inline-block ml-2 
            bg-perplexity-accent text-perplexity-bg 
            text-xs font-bold px-2 py-1 rounded-md
            animate-scale-in
            transition-all duration-200 hover:scale-110
          ">
            {brandConfig.proBadgeText}
          </span>
        )}
      </h1>
    </div>
  );
};

// Re-export with old name for backward compatibility
export const PerplexityLogo = FlowKeyLogo;
export default FlowKeyLogo;