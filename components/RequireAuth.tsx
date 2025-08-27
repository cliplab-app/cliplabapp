'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../services/auth';
import { Loading } from './Loading';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireRole?: 'creator' | 'clipper' | 'admin';
  onUnauthorized?: () => void;
}

/**
 * Route guard that redirects unauthenticated users
 */
export function RequireAuth({ 
  children, 
  fallback,
  requireRole,
  onUnauthorized
}: RequireAuthProps) {
  const auth = useAuth();

  useEffect(() => {
    // If auth is initialized and user is not authenticated, redirect
    if (auth.isInitialized && !auth.isAuthenticated) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Default redirect to login
        window.location.href = '/';
      }
    }
  }, [auth.isInitialized, auth.isAuthenticated, onUnauthorized]);

  // Show loading while auth is initializing
  if (!auth.isInitialized || auth.isLoading) {
    return fallback || <Loading />;
  }

  // Show error if there's an auth error
  if (auth.error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-destructive border-2 border-foreground flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-white"></div>
          </div>
          <h1 className="text-retro-display text-xl mb-4">AUTH ERROR</h1>
          <p className="text-muted-foreground mb-6">{auth.error}</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="btn-primary px-6 py-3"
          >
            GO HOME
          </button>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated) {
    return fallback || <Loading />;
  }

  // Check role requirement if specified
  if (requireRole && !auth.hasRole(requireRole)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-status-rejected border-2 border-foreground flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-white"></div>
          </div>
          <h1 className="text-retro-display text-xl mb-4">ACCESS DENIED</h1>
          <p className="text-muted-foreground mb-6">
            This page requires {requireRole} access
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="btn-primary px-6 py-3"
          >
            GO HOME
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
}