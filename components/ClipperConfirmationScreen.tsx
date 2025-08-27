'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Trophy, TrendingUp, Target, Play, Plus } from 'lucide-react';
import { Bounty } from '../App';

interface ClipperConfirmationScreenProps {
  campaign: Bounty;
  submissionId: string;
  onTrackRank: () => void;
  onSubmitAnother: () => void;
  user: any;
}

export function ClipperConfirmationScreen({ 
  campaign, 
  submissionId, 
  onTrackRank, 
  onSubmitAnother,
  user 
}: ClipperConfirmationScreenProps) {
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [estimatedEarnings, setEstimatedEarnings] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Simulate loading and calculating position
    const timer = setTimeout(() => {
      // Mock leaderboard position calculation
      const mockPosition = Math.floor(Math.random() * 10) + 1;
      setCurrentPosition(mockPosition);
      
      // Mock earnings calculation based on position
      const baseEarning = campaign.amount / 10; // Split among top 10
      const positionMultiplier = Math.max(1, 11 - mockPosition) / 10;
      setEstimatedEarnings(Math.floor(baseEarning * positionMultiplier));
      
      setIsAnimating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [campaign.amount]);

  const getPositionBadge = (position: number) => {
    if (position === 1) return { class: 'status-winner-1st', icon: Trophy, text: '1ST PLACE' };
    if (position === 2) return { class: 'status-winner-2nd', icon: Trophy, text: '2ND PLACE' };
    if (position === 3) return { class: 'status-winner-3rd', icon: Trophy, text: '3RD PLACE' };
    if (position <= 10) return { class: 'status-approved', icon: Target, text: `${position}TH PLACE` };
    return { class: 'status-pending', icon: TrendingUp, text: `${position}TH PLACE` };
  };

  const positionInfo = currentPosition ? getPositionBadge(currentPosition) : null;
  const PositionIcon = positionInfo?.icon || Trophy;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                <Play className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-retro-display text-lg">CLIPLAB</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-status-approved mb-6 transition-all duration-1000 ${
            isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
          }`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-retro-display text-4xl text-primary mb-4">
            CLIP SUBMITTED!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Your submission is live and earning views
          </p>
        </div>

        {/* Results Card */}
        <Card className="window-card p-8 mb-8">
          <div className="space-y-6">
            {/* Campaign Info */}
            <div className="text-center border-b border-border pb-6">
              <h2 className="text-retro-display text-xl mb-2">{campaign.title}</h2>
              <Badge className="status-approved px-4 py-2">
                ${campaign.amount.toLocaleString()} PRIZE POOL
              </Badge>
            </div>

            {/* Position & Earnings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">CURRENT POSITION</div>
                {currentPosition ? (
                  <div className="space-y-2">
                    <Badge className={`${positionInfo?.class} px-4 py-2 text-lg`}>
                      <PositionIcon className="w-5 h-5 mr-2" />
                      {positionInfo?.text}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Out of {campaign.submissions.length + 1} submissions
                    </div>
                  </div>
                ) : (
                  <div className="window-card p-4 bg-background-secondary">
                    <div className="animate-pulse">
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">POTENTIAL EARNINGS</div>
                {currentPosition ? (
                  <div className="space-y-2">
                    <div className="text-3xl text-retro-display text-status-approved">
                      ${estimatedEarnings.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Based on current performance
                    </div>
                  </div>
                ) : (
                  <div className="window-card p-4 bg-background-secondary">
                    <div className="animate-pulse">
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-lg text-retro-display text-vibrant-blue">
                  {Math.floor(Math.random() * 50000) + 10000}
                </div>
                <div className="text-xs text-muted-foreground">CURRENT VIEWS</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg text-retro-display text-vibrant-purple">
                  {Math.floor(Math.random() * 5000) + 500}
                </div>
                <div className="text-xs text-muted-foreground">LIKES</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg text-retro-display text-vibrant-orange">
                  {Math.floor(Math.random() * 500) + 50}
                </div>
                <div className="text-xs text-muted-foreground">COMMENTS</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="space-y-4">
          <Button 
            onClick={onTrackRank}
            className="w-full btn-primary py-4 text-lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            TRACK MY RANK
          </Button>
          
          <Button 
            onClick={onSubmitAnother}
            variant="outline"
            className="w-full btn-secondary-cyan py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            SUBMIT ANOTHER CLIP
          </Button>
        </div>

        {/* Tips */}
        <Card className="window-card p-6 mt-8 bg-vibrant-blue/10 border-vibrant-blue/20">
          <h3 className="text-retro-display text-sm mb-3">BOOST YOUR PERFORMANCE</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Share your clip on social media to drive more views</li>
            <li>• Engage with comments to boost YouTube algorithm ranking</li>
            <li>• Submit to multiple campaigns to maximize earnings</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}