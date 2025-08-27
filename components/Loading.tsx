'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center shadow-md mx-auto mb-4">
          <div className="w-6 h-6 bg-foreground animate-pulse rounded"></div>
        </div>
        <h1 className="text-retro-display text-xl mb-2">LOADING CLIPLAB...</h1>
        <p className="text-muted-foreground text-sm">Initializing your experience</p>
      </div>
    </div>
  );
}