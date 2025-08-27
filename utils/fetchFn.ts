'use client';

import { supabase } from './supabase/client';

interface FunctionCallOptions {
  requireAuth?: boolean;
  timeout?: number;
}

/**
 * Safe Edge Function call utility with proper auth handling
 */
export async function callFunction(
  functionPath: string, 
  body?: any, 
  options: FunctionCallOptions = {}
): Promise<any> {
  const { requireAuth = true, timeout = 10000 } = options;

  try {
    // Get current session if auth is required
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (requireAuth) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session?.access_token) {
        throw new Error('No valid session found - please sign in');
      }

      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    // Get Supabase project URL from environment with safe access
    let supabaseUrl: string = '';
    
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) {
      supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    }

    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured - check environment variables');
    }

    // Extract project ref from URL (e.g., https://abc123.supabase.co -> abc123)
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    const functionUrl = `https://${projectRef}.functions.supabase.co/${functionPath}`;

    console.log(`📡 Calling function: ${functionPath}`, { requireAuth, hasBody: !!body });

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Function call failed (${response.status}): ${errorText}`);
      }

      // Parse JSON response
      const responseText = await response.text();
      
      if (!responseText) {
        return null;
      }

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        // If JSON parsing fails, return the raw text
        console.warn('Function response is not JSON:', responseText);
        return responseText;
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new Error(`Function call timed out after ${timeout}ms`);
        }
        throw fetchError;
      }
      
      throw new Error('Network error during function call');
    }

  } catch (error) {
    console.error(`💥 Function call error for ${functionPath}:`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Unknown error calling function: ${functionPath}`);
  }
}

/**
 * Call function without authentication
 */
export async function callPublicFunction(functionPath: string, body?: any): Promise<any> {
  return callFunction(functionPath, body, { requireAuth: false });
}

/**
 * Example usage:
 * 
 * // With auth (default)
 * const result = await callFunction('my-function', { data: 'test' });
 * 
 * // Without auth
 * const publicResult = await callPublicFunction('public-function', { data: 'test' });
 * 
 * // With custom timeout
 * const slowResult = await callFunction('slow-function', { data: 'test' }, { timeout: 30000 });
 */