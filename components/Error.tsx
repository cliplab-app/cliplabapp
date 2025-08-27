'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function Error({ message = 'Something went wrong', onRetry }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 bg-destructive border-2 border-foreground flex items-center justify-center shadow-md mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-retro-display text-xl mb-4">SYSTEM ERROR</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="btn-primary px-6 py-3">
              <RefreshCw className="w-4 h-4 mr-2" />
              TRY AGAIN
            </Button>
          )}
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="w-full px-6 py-3"
          >
            RELOAD PAGE
          </Button>
        </div>
      </div>
    </div>
  );
}