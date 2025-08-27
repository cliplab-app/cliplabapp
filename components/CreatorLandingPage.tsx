'use client';

import React from 'react';
import { Button } from './ui/button';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Crown,
  ArrowRight
} from 'lucide-react';
import { FeaturedClip, TopCreator } from '../App';

interface CreatorLandingPageProps {
  featuredClips: FeaturedClip[];
  topCreators: TopCreator[];
  onLogin: () => void;
  onSignup: () => void;
  onSwitchToClipper: () => void;
  onStartCampaign: (mode: 'velocity' | 'reach' | 'select') => void;
  onViewFeaturedCampaign?: (clip: FeaturedClip) => void;
}

export function CreatorLandingPage({ 
  onLogin, 
  onSignup, 
  onSwitchToClipper, 
  onStartCampaign
}: CreatorLandingPageProps) {
  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                <Crown className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-retro-display text-lg">CLIPLAB</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={onSwitchToClipper} variant="ghost" className="text-retro-nav">
                For Clippers
              </Button>
              <Button onClick={onLogin} variant="ghost" className="text-retro-nav">
                Login
              </Button>
              <Button onClick={onSignup} className="btn-primary">
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-retro-display text-6xl text-primary">
              AMPLIFY YOUR CONTENT
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Launch campaigns to get viral clips from your content. Set bounties and 
              let our community of talented clippers create engaging shorts from your videos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="window-card p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-retro-display text-lg mb-2">CREATE CAMPAIGNS</h3>
              <p className="text-sm">Set up bounties with custom parameters and budgets</p>
            </div>
            
            <div className="window-card p-6 text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-retro-display text-lg mb-2">GET SUBMISSIONS</h3>
              <p className="text-sm">Receive viral clips from skilled content creators</p>
            </div>
            
            <div className="window-card p-6 text-center">
              <div className="w-12 h-12 bg-status-approved rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-retro-display text-lg mb-2">AMPLIFY REACH</h3>
              <p className="text-sm">Watch your content reach millions of new viewers</p>
            </div>
          </div>
          
          <Button 
            onClick={() => onStartCampaign('reach')} 
            className="btn-primary text-lg px-8 py-4"
          >
            LAUNCH YOUR FIRST CAMPAIGN
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      </main>
    </div>
  );
}