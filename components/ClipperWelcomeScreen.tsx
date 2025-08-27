'use client';

import React from 'react';
import { Button } from './ui/button';
import { Play, ArrowRight, LogIn } from 'lucide-react';

interface ClipperWelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSwitchToCreator: () => void;
}

export function ClipperWelcomeScreen({ 
  onGetStarted, 
  onLogin, 
  onSwitchToCreator 
}: ClipperWelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                <Play className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-retro-display text-lg">CLIPLAB</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={onSwitchToCreator} variant="ghost" className="text-retro-nav">
                For Creators
              </Button>
              <Button onClick={onLogin} variant="ghost" className="text-retro-nav">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl text-retro-display text-primary">
              CLIP, CLIMB, CASH OUT.
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Submit your best YouTube Shorts edits, climb the leaderboard, and earn cash.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={onGetStarted} 
              className="btn-primary text-2xl px-12 py-6 text-lg"
            >
              GET STARTED
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <span className="text-sm">Already have an account?</span>
              <Button 
                onClick={onLogin} 
                variant="link" 
                className="text-sm underline p-0 h-auto text-vibrant-blue hover:text-primary"
              >
                Log in
              </Button>
            </div>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="window-card p-6 text-center">
              <div className="text-3xl text-retro-display text-primary mb-2">$28,400</div>
              <div className="text-sm text-muted-foreground">TOP CLIPPER EARNINGS</div>
            </div>
            
            <div className="window-card p-6 text-center">
              <div className="text-3xl text-retro-display text-secondary mb-2">156</div>
              <div className="text-sm text-muted-foreground">ACTIVE CAMPAIGNS</div>
            </div>
            
            <div className="window-card p-6 text-center">
              <div className="text-3xl text-retro-display text-status-approved mb-2">2.4M</div>
              <div className="text-sm text-muted-foreground">VIEWS THIS WEEK</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}