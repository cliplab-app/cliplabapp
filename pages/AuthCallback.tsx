'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract the code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('No authentication code found in URL');
        }

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw new Error(exchangeError.message);
        }

        if (data.session) {
          console.log('Magic link auth successful:', data.session.user.email);
          setStatus('success');
          
          // Redirect to home after a brief success message
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          throw new Error('No session received after code exchange');
        }

      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Zap className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-retro-display text-lg">CLIPLAB</span>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <div className="window-card p-8 text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-primary border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-foreground animate-pulse rounded"></div>
                </div>
                <h1 className="text-retro-display text-xl mb-4">COMPLETING SIGN IN...</h1>
                <p className="text-muted-foreground">
                  Processing your magic link authentication
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-status-approved border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-foreground" />
                </div>
                <h1 className="text-retro-display text-xl mb-4">SIGN IN SUCCESSFUL!</h1>
                <p className="text-muted-foreground mb-4">
                  Welcome back to ClipLab
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the app...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-destructive border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-retro-display text-xl mb-4">SIGN IN FAILED</h1>
                <p className="text-muted-foreground mb-6">
                  {error || 'Something went wrong during authentication'}
                </p>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="btn-primary px-6 py-3"
                >
                  RETURN TO HOME
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}