'use client';

import { supabase } from '../utils/supabase/client';
import { loadOrCreateProfile, type Profile } from './profile';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'creator' | 'clipper' | 'admin';
  channelLink?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  isDemoMode?: boolean;
}

// Mock users for demo mode
const DEMO_USERS = {
  'creator@test.com': {
    id: 'demo-creator-1',
    email: 'creator@test.com',
    username: 'demo_creator',
    role: 'creator' as const,
    channelLink: 'https://youtube.com/@democreator',
    avatar: undefined,
    isVerified: true,
    createdAt: new Date('2024-01-01')
  },
  'clipper@test.com': {
    id: 'demo-clipper-1',
    email: 'clipper@test.com', 
    username: 'demo_clipper',
    role: 'clipper' as const,
    channelLink: undefined,
    avatar: undefined,
    isVerified: false,
    createdAt: new Date('2024-01-15')
  },
  'admin@test.com': {
    id: 'demo-admin-1',
    email: 'admin@test.com',
    username: 'demo_admin',
    role: 'admin' as const,
    channelLink: undefined,
    avatar: undefined,
    isVerified: true,
    createdAt: new Date('2024-01-01')
  }
};

class AuthService {
  private static instance: AuthService;
  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    error: null,
    isInitialized: false,
    isDemoMode: false
  };
  private initializationTimeout: NodeJS.Timeout | null = null;
  private demoMode = false;

  constructor() {
    // Delay initialization to ensure DOM is ready
    if (typeof window !== 'undefined') {
      setTimeout(() => this.initializeAuth(), 100);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Check if we're in demo mode
  private isDemoConfiguration(): boolean {
    try {
      const url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
      const key = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
      
      return !url || !key || url.includes('demo') || key.includes('demo') || url === 'https://demo.supabase.co';
    } catch {
      return true;
    }
  }

  // Initialize authentication state with safety timeout
  private async initializeAuth(): Promise<void> {
    console.log('🔐 Initializing auth service...');

    // Check if we're in demo mode
    this.demoMode = this.isDemoConfiguration();

    if (this.demoMode) {
      console.log('🎭 Running in demo mode - using mock authentication');
      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: true
      });
      return;
    }

    // Safety timeout: after 8 seconds, fall back to signed out
    this.initializationTimeout = setTimeout(() => {
      console.warn('⚠️ Auth initialization timeout - falling back to signed out');
      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: false
      });
    }, 8000);

    try {
      // Get initial session
      console.log('📡 Getting initial session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session fetch error: ${sessionError.message}`);
      }

      if (session?.user) {
        console.log('✅ Found existing session for:', session.user.email);
        await this.loadUserProfile(session.user, session);
      } else {
        console.log('ℹ️ No existing session found');
        this.setState({
          user: null,
          session: null,
          isLoading: false,
          error: null,
          isInitialized: true,
          isDemoMode: false
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👤 User signed in:', session.user.email);
          await this.loadUserProfile(session.user, session);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          this.setState({
            user: null,
            session: null,
            isLoading: false,
            error: null,
            isInitialized: true,
            isDemoMode: false
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed for:', session.user.email);
          await this.loadUserProfile(session.user, session);
        }
      });

      // Clear timeout since initialization completed
      if (this.initializationTimeout) {
        clearTimeout(this.initializationTimeout);
        this.initializationTimeout = null;
      }

    } catch (error) {
      console.error('💥 Auth initialization error:', error);
      
      // Clear timeout
      if (this.initializationTimeout) {
        clearTimeout(this.initializationTimeout);
        this.initializationTimeout = null;
      }

      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication initialization failed',
        isInitialized: true,
        isDemoMode: false
      });
    }
  }

  // Load user profile with resilient error handling
  private async loadUserProfile(supabaseUser: User, session: Session): Promise<void> {
    try {
      console.log('👤 Loading profile for user:', supabaseUser.id);
      
      const profile = await loadOrCreateProfile(supabaseUser);
      
      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        role: profile.role,
        channelLink: profile.channel_link || undefined,
        avatar: profile.avatar_url || undefined,
        isVerified: profile.is_verified,
        createdAt: new Date(profile.created_at)
      };

      this.setState({
        user: authUser,
        session,
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: false
      });

      console.log('✅ Profile loaded successfully for:', authUser.username);

    } catch (error) {
      console.error('💥 Failed to load user profile:', error);
      
      // Don't completely fail - keep the session but show error
      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load user profile',
        isInitialized: true,
        isDemoMode: false
      });
    }
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Emit current state immediately
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Emit state changes to all subscribers
  private emit(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Update state and emit changes
  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.emit();
  }

  // Demo login with custom user data
  async demoLogin(mockUser: any): Promise<{ success: boolean; error?: string }> {
    console.log('🎭 Demo login with custom user:', mockUser);
    
    this.setState({ isLoading: true, error: null });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const authUser: AuthUser = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        role: mockUser.role,
        channelLink: mockUser.channelLink,
        avatar: mockUser.avatar,
        isVerified: mockUser.isVerified || false,
        createdAt: mockUser.createdAt || new Date()
      };
      
      this.setState({
        user: authUser,
        session: null, // No real session in demo mode
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: true
      });
      
      console.log('✅ Demo login successful for:', authUser.username);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Demo login failed';
      this.setState({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }

  // Login with email and password (supports demo mode)
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.setState({ isLoading: true, error: null });

    // Demo mode login
    if (this.demoMode) {
      console.log('🎭 Demo mode login for:', email);
      
      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
      if (demoUser) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.setState({
          user: demoUser,
          session: null, // No real session in demo mode
          isLoading: false,
          error: null,
          isInitialized: true,
          isDemoMode: true
        });
        
        console.log('✅ Demo login successful for:', demoUser.username);
        return { success: true };
      } else {
        this.setState({
          isLoading: false,
          error: 'Invalid demo credentials. Try: creator@test.com, clipper@test.com, or admin@test.com'
        });
        return { success: false, error: 'Invalid demo credentials' };
      }
    }

    // Real Supabase login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user && data.session) {
        // Profile loading will be handled by auth state change listener
        return { success: true };
      } else {
        throw new Error('Login failed: No user data received');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.setState({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }

  // Register new user (supports demo mode)
  async register(userData: {
    email: string;
    password: string;
    username: string;
    role: 'creator' | 'clipper';
    channelLink?: string;
  }): Promise<{ success: boolean; error?: string }> {
    this.setState({ isLoading: true, error: null });

    // Demo mode registration
    if (this.demoMode) {
      console.log('🎭 Demo mode registration for:', userData.email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDemoUser: AuthUser = {
        id: `demo-${userData.role}-${Date.now()}`,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        channelLink: userData.channelLink,
        avatar: undefined,
        isVerified: false,
        createdAt: new Date()
      };
      
      this.setState({
        user: newDemoUser,
        session: null, // No real session in demo mode
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: true
      });
      
      console.log('✅ Demo registration successful for:', newDemoUser.username);
      return { success: true };
    }

    // Real Supabase registration
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            role: userData.role,
            channel_link: userData.channelLink || null
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Profile creation will be handled by auth state change listener
        return { success: true };
      } else {
        throw new Error('Registration failed: No user data received');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      this.setState({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    this.setState({ isLoading: true });

    // Demo mode logout
    if (this.demoMode) {
      console.log('🎭 Demo mode logout');
      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: true
      });
      return;
    }

    // Real Supabase logout
    try {
      await supabase.auth.signOut();
      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if logout API call fails
      this.setState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        isDemoMode: false
      });
    }
  }

  // Get current auth state
  getState(): AuthState {
    return this.state;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.state.user);
  }

  // Check if user has specific role
  hasRole(role: 'creator' | 'clipper' | 'admin'): boolean {
    return this.state.user?.role === role;
  }

  // Get authorization header for API calls
  getAuthHeader(): Record<string, string> {
    if (this.demoMode) {
      return { 'Authorization': 'Bearer demo-token' };
    }
    return this.state.session?.access_token 
      ? { 'Authorization': `Bearer ${this.state.session.access_token}` }
      : {};
  }

  // Get access token
  getAccessToken(): string | null {
    if (this.demoMode) {
      return 'demo-token';
    }
    return this.state.session?.access_token || null;
  }

  // Check if we're in demo mode
  isDemoMode(): boolean {
    return this.demoMode;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// React hook for using auth service
import { useState, useEffect } from 'react';

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    username: string;
    role: 'creator' | 'clipper';
    channelLink?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (mockUser: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: 'creator' | 'clipper' | 'admin') => boolean;
  getAccessToken: () => string | null;
  isDemoMode: () => boolean;
} {
  const [state, setState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    demoLogin: authService.demoLogin.bind(authService),
    logout: authService.logout.bind(authService),
    isAuthenticated: authService.isAuthenticated(),
    hasRole: authService.hasRole.bind(authService),
    getAccessToken: authService.getAccessToken.bind(authService),
    isDemoMode: authService.isDemoMode.bind(authService)
  };
}