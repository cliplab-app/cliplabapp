'use client';

import { supabase } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  username: string;
  role: 'creator' | 'clipper' | 'admin';
  channel_link?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileLoadResult {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

// Check if we're in demo mode
function isDemoMode(): boolean {
  try {
    const url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
    const key = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
    
    return !url || !key || url.includes('demo') || key.includes('demo') || url === 'https://demo.supabase.co';
  } catch {
    return true;
  }
}

/**
 * Loads or creates a user profile with resilient error handling
 */
export async function loadOrCreateProfile(user: User): Promise<Profile> {
  console.log('Loading/creating profile for user:', user.id);

  // Demo mode - return mock profile
  if (isDemoMode()) {
    console.log('🎭 Demo mode - returning mock profile for:', user.email);
    
    const mockProfile: Profile = {
      id: user.id,
      email: user.email || 'demo@user.com',
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'demo_user',
      role: user.user_metadata?.role || 'clipper',
      channel_link: user.user_metadata?.channel_link || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      is_verified: user.user_metadata?.role === 'creator' ? true : false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockProfile;
  }

  try {
    // First, try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected, other errors are real issues
      console.error('Error fetching profile:', fetchError);
      throw new Error(`Failed to fetch profile: ${fetchError.message}`);
    }

    if (existingProfile) {
      console.log('Found existing profile for user:', user.id);
      return existingProfile;
    }

    // Profile doesn't exist, create it
    console.log('Profile not found, creating new one for user:', user.id);
    
    const newProfile: Omit<Profile, 'created_at' | 'updated_at'> = {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      role: user.user_metadata?.role || 'clipper',
      channel_link: user.user_metadata?.channel_link || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      is_verified: false,
    };

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      throw new Error(`Failed to create profile: ${createError.message}`);
    }

    console.log('Successfully created profile for user:', user.id);
    return createdProfile;

  } catch (error) {
    console.error('Profile load/create error:', error);
    throw error;
  }
}

/**
 * React hook for loading profile with loading/error states
 */
import { useState, useEffect } from 'react';

export function useProfile(user: User | null): ProfileLoadResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedProfile = await loadOrCreateProfile(user);
        
        if (!isCancelled) {
          setProfile(loadedProfile);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
          setError(errorMessage);
          console.error('Profile loading failed:', errorMessage);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  return { profile, loading, error };
}

/**
 * Update an existing profile
 */
export async function updateProfile(
  userId: string, 
  updates: Partial<Pick<Profile, 'username' | 'channel_link' | 'avatar_url'>>
): Promise<Profile> {
  // Demo mode - return mock updated profile
  if (isDemoMode()) {
    console.log('🎭 Demo mode - simulating profile update for:', userId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUpdatedProfile: Profile = {
      id: userId,
      email: 'demo@user.com',
      username: updates.username || 'updated_user',
      role: 'clipper',
      channel_link: updates.channel_link || null,
      avatar_url: updates.avatar_url || null,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockUpdatedProfile;
  }

  try {
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return updatedProfile;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}