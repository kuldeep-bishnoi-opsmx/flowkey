/**
 * Google Gemini API Integration
 * 
 * This module provides integration with Google's Gemini AI API for chat completions
 * and Mermaid diagram generation. It implements retry logic, proper validation,
 * and configuration-driven error handling for the FlowKey application.
 * 
 * @module gemini
 */

import { GoogleGenAI } from '@google/genai';
import { ChatMessageUnion } from '@/types/chat';
import { SearchError } from '@/types/search';
import { 
  mermaidGenerationConfig, 
  getPromptForAttempt, 
  validateMermaidScript, 
  cleanMermaidScript,
  userMessages 
} from '@/config/workflow';

/**
 * Initialize Google GenAI client with environment API key
 */
export const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/**
 * Default model for all Gemini API interactions
 */
export const DEFAULT_MODEL = 'gemini-2.5-pro';

/**
 * Default parameters for chat completions
 */
export const defaultChatParams = {
  maxOutputTokens: -1,
  temperature: 1,
  topK: 40,
  topP: 0.95
};

/**
 * Enhanced tools configuration for chat completions
 */
export const chatTools = [
  { codeExecution: {} },
  { googleSearch: {} },
];

/**
 * Configuration for standard chat interactions
 */
export const chatConfig = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  tools: chatTools,
};

/**
 * Configuration for Mermaid generation (no tools needed)
 */
export const mermaidConfig = {
  thinkingConfig: {
    thinkingBudget: 500, // Limited thinking budget for focused responses
  },
  temperature: 0.3, // Lower temperature for more consistent diagram generation
  topK: 20,
  topP: 0.8,
};

/**
 * Validate that the Gemini API key is properly configured
 * @returns True if API key is available and valid, false otherwise
 */
export const validateApiKey = (): boolean => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return !!(apiKey && apiKey.trim() !== '' && apiKey.length > 10);
};

/**
 * Generate a chat completion using Gemini API with streaming support
 * @param messages - Array of chat messages to send to the API
 * @returns Promise that resolves to the generated response text
 * @throws Error if API call fails or response is invalid
 */
export const generateGeminiCompletion = async (
  messages: ChatMessageUnion[]
): Promise<string> => {
  try {
    if (!validateApiKey()) {
      throw new Error(userMessages.authenticationError);
    }

    // Convert internal message format to Gemini format
    const contents = messages
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map(message => ({
        role: message.role === 'assistant' ? 'model' : message.role,
        parts: [{ text: message.content }],
      }));

    // Generate streaming response with chat configuration
    const response = await genAI.models.generateContentStream({
      model: DEFAULT_MODEL,
      config: chatConfig,
      contents,
    });

    let fullResponse = '';
    
    // Process streaming chunks
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      
      const part = chunk.candidates[0].content.parts[0];
      
      if (part.text) {
        fullResponse += part.text;
      }
      
      // Log any code execution results for debugging
      if (part.executableCode) {
        console.log('Executable code received:', part.executableCode);
      }
      
      if (part.codeExecutionResult) {
        console.log('Code execution result:', part.codeExecutionResult);
      }
    }

    if (!fullResponse) {
      throw new Error('No response content received from Gemini API');
    }

    return fullResponse;

  } catch (error) {
    console.error('Gemini chat completion error:', error);
    throw handleGeminiApiError(error);
  }
};

/**
 * Generate Mermaid script from conversation with retry logic and validation
 * @param conversationHistory - Array of chat messages to analyze
 * @returns Promise that resolves to a validated Mermaid script or "NO_DIAGRAM"
 * @throws Error if all retry attempts fail
 */
export const generateMermaidScriptFromConversation = async (
  conversationHistory: ChatMessageUnion[]
): Promise<string> => {
  try {
    if (!validateApiKey()) {
      throw new Error(userMessages.authenticationError);
    }

    // Filter and prepare conversation content
    const userAndAssistantMessages = conversationHistory.filter(
      message => message.role === 'user' || message.role === 'assistant'
    );

    if (userAndAssistantMessages.length === 0) {
      throw new Error(userMessages.noContentError);
    }

    // Create conversation context string
    const conversationContent = userAndAssistantMessages
      .map(message => `${message.role}: ${message.content}`)
      .join('\n\n');

    // Attempt generation with retry logic
    for (let attempt = 1; attempt <= mermaidGenerationConfig.maxRetryAttempts; attempt++) {
      try {
        console.log(`Mermaid generation attempt ${attempt}/${mermaidGenerationConfig.maxRetryAttempts}`);
        
        const script = await attemptMermaidGeneration(conversationContent, attempt);
        
        if (script === 'NO_DIAGRAM') {
          console.log('Gemini determined no diagram is possible');
          return 'NO_DIAGRAM';
        }

        // Clean and validate the generated script
        const cleanedScript = cleanMermaidScript(script);
        
        if (validateMermaidScript(cleanedScript)) {
          console.log('Valid Mermaid script generated on attempt', attempt);
          return cleanedScript;
        } else {
          console.log(`Generated script failed validation on attempt ${attempt}`);
          
          // If this is the last attempt, throw validation error
          if (attempt === mermaidGenerationConfig.maxRetryAttempts) {
            throw new Error(userMessages.validationFailed);
          }
        }
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        // If this is the last attempt, re-throw the error
        if (attempt === mermaidGenerationConfig.maxRetryAttempts) {
          throw error;
        }
        
        // For non-final attempts, continue to the next attempt
        console.log(`Retrying with simpler approach (attempt ${attempt + 1})`);
      }
    }

    // This should never be reached due to the retry logic above
    throw new Error(userMessages.generationFailed);

  } catch (error) {
    console.error('Mermaid script generation failed:', error);
    throw handleMermaidGenerationError(error);
  }
};

/**
 * Attempt to generate a Mermaid script using a specific prompt template
 * @param conversationContent - The conversation content to analyze
 * @param attemptNumber - The current attempt number (1-based)
 * @returns Promise that resolves to the raw AI response
 * @throws Error if the API call fails
 */
const attemptMermaidGeneration = async (
  conversationContent: string, 
  attemptNumber: number
): Promise<string> => {
  
  // Get the appropriate prompt for this attempt
  const prompt = getPromptForAttempt(attemptNumber, conversationContent);
  
  // Prepare the request content
  const contents = [{
    role: 'user',
    parts: [{ text: prompt }],
  }];

  // Create a timeout promise to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(userMessages.timeoutError));
    }, mermaidGenerationConfig.generationTimeoutMs);
  });

  // Race the generation against the timeout
  const generationPromise = (async () => {
    const response = await genAI.models.generateContentStream({
      model: DEFAULT_MODEL,
      config: mermaidConfig,
      contents,
    });

    let aiResponse = '';
    
    for await (const chunk of response) {
      if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts) {
        for (const part of chunk.candidates[0].content.parts) {
          if (part.text) {
            aiResponse += part.text;
          }
        }
      }
    }

    return aiResponse.trim();
  })();

  const result = await Promise.race([generationPromise, timeoutPromise]);
  
  if (!result) {
    throw new Error('Empty response received from Gemini API');
  }

  return result;
};

/**
 * Handle Gemini API errors and convert them to user-friendly messages
 * @param error - The error object from the API call
 * @returns Error object with user-friendly message
 * @throws Error with appropriate message for the error type
 */
const handleGeminiApiError = (error: unknown): Error => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Authentication errors
    if (message.includes('api key') || message.includes('authentication') || message.includes('unauthorized')) {
      return new Error(userMessages.authenticationError);
    }

    // Rate limiting errors
    if (message.includes('rate limit') || message.includes('quota') || message.includes('too many requests')) {
      return new Error(userMessages.rateLimitError);
    }

    // Network errors
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return new Error(userMessages.networkError);
    }

    // Return the original error message if it's already user-friendly
    return error;
  }

  // Fallback for unknown error types
  return new Error('An unexpected error occurred while communicating with the AI service.');
};

/**
 * Handle specific Mermaid generation errors
 * @param error - The error object from the generation process
 * @returns Error object with appropriate message for Mermaid generation
 * @throws Error with user-friendly message
 */
const handleMermaidGenerationError = (error: unknown): Error => {
  if (error instanceof Error) {
    const message = error.message;

    // If it's already a user-friendly message from our configuration, return as-is
    if (Object.values(userMessages).includes(message as any)) {
      return error;
    }

    // Handle specific API errors
    return handleGeminiApiError(error);
  }

  return new Error(userMessages.generationFailed);
};

/**
 * Legacy compatibility function - delegates to the main generation function
 * @param conversation - Array of chat messages to analyze
 * @returns Promise that resolves to a valid Mermaid script or "NO_DIAGRAM"
 * @deprecated Use generateMermaidScriptFromConversation instead
 */
export const generateMermaidScriptForConversation = async (
  conversation: ChatMessageUnion[]
): Promise<string> => {
  return generateMermaidScriptFromConversation(conversation);
};

/**
 * Legacy error handler for backward compatibility
 * @param error - The error object from the API call
 * @returns SearchError object with user-friendly message and error type
 * @deprecated Use direct error handling with new user messages
 */
export const handleGeminiError = (error: unknown): SearchError => {
  console.error('Gemini API error:', error);

  if (error instanceof Error) {
    const message = error.message;

    // Map to SearchError format for compatibility
    if (message === userMessages.authenticationError) {
      return {
        message: userMessages.authenticationError,
        type: 'api_error',
        timestamp: new Date()
      };
    }

    if (message === userMessages.rateLimitError) {
      return {
        message: userMessages.rateLimitError,
        type: 'api_error',
        timestamp: new Date()
      };
    }

    if (message === userMessages.networkError) {
      return {
        message: userMessages.networkError,
        type: 'network_error',
        timestamp: new Date()
      };
    }

    return {
      message: message,
      type: 'api_error',
      timestamp: new Date()
    };
  }

  return {
    message: userMessages.generationFailed,
    type: 'unknown',
    timestamp: new Date()
  };
}; 

/**
 * Strip any markdown code block wrappers from the script and fix common syntax errors
 * @param script - The script that might contain markdown wrappers
 * @returns Cleaned script without wrappers and with syntax fixes
 */
const stripMermaidWrappers = (script: string): string => {
  if (!script || typeof script !== 'string') {
    return '';
  }

  let cleaned = script.trim();

  // Regex to match '```mermaid' or '```' at the start/end, ignoring whitespace
  const wrapperRegex = /^\s*```(?:mermaid)?\s*([\s\S]*?)\s*```\s*$/;
  const match = cleaned.match(wrapperRegex);
  
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // Remove any remaining conversational text
  const phrasesToRemove = [
    /^here's a mermaid diagram:/i,
    /^here is a mermaid diagram:/i,
    /^this is a mermaid diagram:/i,
    /^the mermaid diagram is:/i,
    /^here's the workflow:/i,
    /^here is the workflow:/i,
    /^the workflow diagram:/i,
    /^generated mermaid script:/i,
    /^mermaid script:/i,
    /^diagram:/i,
    /^workflow:/i,
    /^here's the diagram:/i,
    /^here is the diagram:/i
  ];

  for (const phrase of phrasesToRemove) {
    cleaned = cleaned.replace(phrase, '').trim();
  }

  return cleaned;
};



 