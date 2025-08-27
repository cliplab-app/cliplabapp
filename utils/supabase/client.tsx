'use client';

import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with fallbacks
let supabaseUrl: string = '';
let supabaseAnonKey: string = '';

// Check if we're in a browser environment and import.meta.env exists
if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
}

// Environment check and debug logging
console.log('🔧 Supabase env check:', {
  url: !!supabaseUrl,
  keyLen: (supabaseAnonKey || '').length,
  isDev: typeof window !== 'undefined' && import.meta?.env?.DEV
});

// Show banner in development if env vars are missing
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const isDev = import.meta?.env?.DEV || window.location.hostname === 'localhost';
  
  if (isDev && (!supabaseUrl || !supabaseAnonKey)) {
    // Only create banner once
    if (!document.getElementById('supabase-env-warning')) {
      const banner = document.createElement('div');
      banner.id = 'supabase-env-warning';
      banner.innerHTML = `
        <div style="
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          background: #FF3B30; 
          color: white; 
          padding: 12px; 
          text-align: center; 
          font-family: monospace; 
          font-weight: bold; 
          z-index: 9999;
          border-bottom: 3px solid #000;
        ">
          ⚠️ SUPABASE ENV NOT SET - Check .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
        </div>
      `;
      document.body.appendChild(banner);
    }
  }
}

// Use demo/placeholder values if environment variables are missing
const fallbackUrl = supabaseUrl || 'https://demo.supabase.co';
const fallbackKey = supabaseAnonKey || 'demo-key';

// Create Supabase client
export const supabase = createClient(fallbackUrl, fallbackKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          role: 'creator' | 'clipper' | 'admin';
          channel_link?: string;
          avatar_url?: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          role: 'creator' | 'clipper' | 'admin';
          channel_link?: string;
          avatar_url?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          role?: 'creator' | 'clipper' | 'admin';
          channel_link?: string;
          avatar_url?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export default supabase;