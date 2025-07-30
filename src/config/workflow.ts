/**
 * Workflow Configuration
 * 
 * Configuration-driven settings for Mermaid diagram generation
 * Provides simplified prompts, validation settings, and error messages
 * Supports retry logic with progressively simpler prompts
 * 
 * @module workflow
 */

import { ChatMessage } from '@/types/chat';

/**
 * Configuration for Mermaid diagram generation attempts
 */
export const mermaidGenerationConfig = {
  /** Maximum number of retry attempts for diagram generation */
  maxRetryAttempts: 3,
  
  /** Timeout in milliseconds for each generation attempt */
  generationTimeoutMs: 30000,
  
  /** Valid Mermaid diagram type prefixes for validation */
  validDiagramTypes: [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
    'stateDiagram', 'erDiagram', 'journey', 'gantt', 
    'pie', 'quadrantChart', 'requirement', 'gitgraph', 
    'mindmap', 'timeline', 'zenuml', 'sankey'
  ] as const,
  
  /** Minimum script length to be considered valid */
  minScriptLength: 20,
  
  /** Maximum script length to prevent overly complex diagrams */
  maxScriptLength: 5000
} as const;

/**
 * Progressive prompt templates for retry logic
 * Each attempt uses a simpler, more focused prompt
 */
export const promptTemplates = {
  /** 
   * Primary attempt: Focused and clear prompt with essential rules
   */
  primary: (conversation: string): string => {
    return `Generate a valid Mermaid diagram script based on this conversation.

CRITICAL REQUIREMENTS:
1. Start with a valid diagram type: flowchart TD, graph LR, sequenceDiagram, etc.
2. Use square brackets for all node labels: NodeName[Description]
3. Use proper arrow syntax: A --> B or A -- label --> B
4. No spaces in node IDs (use camelCase or underscores)
5. All brackets must be balanced
6. Use %% for comments (separate lines only)
7. No HTML tags or markdown in labels

RETURN ONLY the raw Mermaid script, nothing else.
If no meaningful diagram can be created, return: NO_DIAGRAM

Conversation:
${conversation}`;
  },

  /** 
   * Secondary attempt: Even simpler prompt for retry
   */
  secondary: (conversation: string): string => {
    return `Create a simple Mermaid flowchart for this conversation:

${conversation}

Requirements:
- Start with: flowchart TD
- Use format: NodeName[Description] --> OtherNode[Description]
- Keep it simple and focused
- Return only the Mermaid script or NO_DIAGRAM`;
  },

  /** 
   * Final attempt: Most basic prompt possible
   */
  fallback: (conversation: string): string => {
    return `Generate a basic flowchart showing the main steps discussed:

${conversation}

Format:
flowchart TD
  A[Step 1] --> B[Step 2]
  
Return only valid Mermaid syntax or NO_DIAGRAM`;
  }
} as const;

/**
 * User-facing messages for different states and errors
 */
export const userMessages = {
  /** Initial message shown when generation starts */
  generationStarted: 'Generating workflow diagram...',
  
  /** Message shown during retry attempts */
  retryingGeneration: 'Retrying with simplified approach...',
  
  /** Success message when diagram is generated */
  generationSuccess: 'Workflow diagram generated successfully!',
  
  /** Message when AI determines no diagram is possible */
  noDiagramPossible: 'Unable to create a meaningful workflow diagram from this conversation. Please try discussing specific processes or steps.',
  
  /** Generic generation failure message */
  generationFailed: 'Failed to generate workflow diagram. Please try again.',
  
  /** Script validation failure message */
  validationFailed: 'Generated diagram contains syntax errors and cannot be displayed.',
  
  /** API authentication error */
  authenticationError: 'Authentication failed. Please check your API configuration.',
  
  /** Rate limiting error */
  rateLimitError: 'Rate limit exceeded. Please wait a moment before trying again.',
  
  /** Network connectivity error */
  networkError: 'Network error occurred. Please check your connection and try again.',
  
  /** Timeout error */
  timeoutError: 'Diagram generation timed out. Please try again with a simpler request.',
  
  /** No conversation content error */
  noContentError: 'No conversation content available for diagram generation.'
} as const;

/**
 * Workflow trigger configuration
 */
export const triggerConfig = {
  /** Text command that triggers workflow generation */
  textCommand: 'generate workflow',
  
  /** Button text for UI trigger */
  buttonText: 'Generate Workflow',
  
  /** Button tooltip text */
  buttonTooltip: 'Create a visual workflow diagram from this conversation'
} as const;

/**
 * Accessibility configuration
 */
export const accessibilityConfig = {
  /** Alt text for generated diagrams */
  diagramAltText: 'Generated workflow diagram',
  
  /** Loading indicator text for screen readers */
  loadingAriaLabel: 'Generating workflow diagram, please wait',
  
  /** Error state aria label */
  errorAriaLabel: 'Workflow diagram generation failed'
} as const;

/**
 * Export configuration
 */
export const exportConfig = {
  /** Default filename for exported diagrams */
  defaultFilename: 'workflow-diagram',
  
  /** Supported export formats */
  supportedFormats: ['svg', 'png'] as const,
  
  /** Export button text */
  exportButtonText: 'Export Diagram'
} as const;

/**
 * Get the appropriate prompt template for a given attempt number
 * @param attemptNumber - The current attempt number (1-based)
 * @param conversation - The conversation content to include in the prompt
 * @returns The prompt string for this attempt
 */
export const getPromptForAttempt = (attemptNumber: number, conversation: string): string => {
  switch (attemptNumber) {
    case 1:
      return promptTemplates.primary(conversation);
    case 2:
      return promptTemplates.secondary(conversation);
    default:
      return promptTemplates.fallback(conversation);
  }
};

/**
 * Validate that a string represents a potentially valid Mermaid script
 * @param script - The script to validate
 * @returns True if the script appears to be valid Mermaid syntax
 */
export const validateMermaidScript = (script: string): boolean => {
  if (!script || typeof script !== 'string') {
    return false;
  }

  const trimmed = script.trim();
  
  // Check length constraints
  if (trimmed.length < mermaidGenerationConfig.minScriptLength || 
      trimmed.length > mermaidGenerationConfig.maxScriptLength) {
    return false;
  }

  // Check for valid diagram type at start
  const hasValidDiagramType = mermaidGenerationConfig.validDiagramTypes.some(
    type => trimmed.toLowerCase().startsWith(type.toLowerCase())
  );
  
  if (!hasValidDiagramType) {
    return false;
  }

  // Check for basic syntax patterns
  const hasBrackets = /\[.*?\]/.test(trimmed);
  const hasArrows = /-->|->|<--|<-/.test(trimmed);
  
  // Should have either brackets (for flowcharts) or other valid syntax
  if (!hasBrackets && !hasArrows && !trimmed.includes('participant') && !trimmed.includes('class')) {
    return false;
  }

  // Check for balanced brackets
  const openBrackets = (trimmed.match(/\[/g) || []).length;
  const closeBrackets = (trimmed.match(/\]/g) || []).length;
  
  if (openBrackets !== closeBrackets) {
    return false;
  }

  // Check for common syntax errors
  const hasInvalidPatterns = [
    /\.\.\.[^[\]]*?\]/,  // Incomplete node references
    /\[.*?; %%/,         // Inline comments after brackets
    /^\s*-->|<--\s*$/m,  // Arrows without nodes
  ].some(pattern => pattern.test(trimmed));

  return !hasInvalidPatterns;
};

/**
 * Clean and normalize a Mermaid script by removing wrappers and fixing common issues
 * @param rawScript - The raw script from the AI
 * @returns Cleaned script ready for rendering
 */
export const cleanMermaidScript = (rawScript: string): string => {
  if (!rawScript || typeof rawScript !== 'string') {
    return '';
  }

  let cleaned = rawScript.trim();

  // Remove markdown code block wrappers
  const wrapperRegex = /^\s*```(?:mermaid)?\s*([\s\S]*?)\s*```\s*$/;
  const match = cleaned.match(wrapperRegex);
  
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // Remove common AI response prefixes
  const prefixesToRemove = [
    /^here'?s?( a| the)? mermaid( diagram| script)?:?\s*/i,
    /^this is( a| the)? mermaid( diagram| script)?:?\s*/i,
    /^generated? mermaid( diagram| script)?:?\s*/i,
    /^workflow( diagram)?:?\s*/i,
    /^diagram:?\s*/i
  ];

  for (const prefix of prefixesToRemove) {
    cleaned = cleaned.replace(prefix, '');
  }

  return cleaned.trim();
};

/**
 * Type definitions for configuration objects
 */
export type MermaidGenerationConfig = typeof mermaidGenerationConfig;
export type PromptTemplates = typeof promptTemplates;
export type UserMessages = typeof userMessages;
export type TriggerConfig = typeof triggerConfig;
export type AccessibilityConfig = typeof accessibilityConfig;
export type ExportConfig = typeof exportConfig;
export type ValidDiagramType = typeof mermaidGenerationConfig.validDiagramTypes[number]; 