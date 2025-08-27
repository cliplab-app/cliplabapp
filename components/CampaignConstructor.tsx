'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { ArrowLeft, Eye, DollarSign, Lock, UserPlus, LogIn } from 'lucide-react';

interface CampaignConstructorProps {
  campaignMode: 'reach'; // Only reach mode now
  onBack: () => void;
  onLaunch: (campaignData: any) => void;
  user?: any; // Optional user for preview mode
  onSignup?: () => void;
  onLogin?: () => void;
}

type ReachData = {
  budget: string;
  cpmRate: string;
  minViews: string;
  maxSubmissions: string;
  campaignDuration: string;
  creatorNotes: string;
};

export function CampaignConstructor({ campaignMode, onBack, onLaunch, user, onSignup, onLogin }: CampaignConstructorProps) {
  const [reachData, setReachData] = useState<ReachData>({
    budget: !user ? '500' : '',
    cpmRate: '1.50',
    minViews: '10000',
    maxSubmissions: !user ? '25' : '',
    campaignDuration: '14',
    creatorNotes: !user ? 'Seeking viral-worthy moments from any gaming content. Perfect timing and editing are key.' : ''
  });

  const handleLaunch = () => {
    // If user is not logged in, show authentication options
    if (!user) {
      return;
    }

    const campaignData = {
      mode: campaignMode,
      data: reachData
    };
    onLaunch(campaignData);
  };

  const isPreviewMode = !user;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="btn-secondary-cyan px-3 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-status-pending border-2 border-foreground flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="text-retro-display text-lg">CLIPLAB</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="status-approved px-4 py-2">
                SET UP REACH CAMPAIGN
              </Badge>
              {isPreviewMode && (
                <Badge className="status-pending px-4 py-2">
                  <Lock className="w-4 h-4 mr-2" />
                  PREVIEW MODE
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <Card className="window-card bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-retro-mono text-sm">
                {isPreviewMode ? 'EXPLORE CAMPAIGN SETUP' : 'SET UP YOUR CAMPAIGN'}
              </span>
              <span className="text-retro-mono text-sm">
                {isPreviewMode ? 'DEMO MODE' : 'STEP 2 OF 3'}
              </span>
            </div>
            <Progress value={66} className="h-3 bg-muted" />
            <div className="flex justify-between mt-2 text-xs text-retro-mono text-muted-foreground">
              <span>Campaign Mode</span>
              <span className="text-status-approved">Campaign Setup</span>
              <span>{isPreviewMode ? 'Sign Up to Launch' : 'Review & Launch'}</span>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="window-card bg-white p-8">
              <div className="bg-status-pending border-b-2 border-foreground -mx-8 -mt-8 mb-8 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-8 h-8 text-white" />
                    <h1 className="text-retro-display text-2xl text-white">Set Up Reach Campaign</h1>
                  </div>
                  {isPreviewMode && (
                    <Badge className="bg-white/20 text-white border-white/40 px-3 py-1">
                      <Lock className="w-3 h-3 mr-2" />
                      DEMO MODE
                    </Badge>
                  )}
                </div>
                {isPreviewMode && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-white/90 text-retro-mono text-sm">
                      🎯 <strong>Explore the interface!</strong> Configure your campaign settings to see exactly how ClipLab works. 
                      Sign up when you're ready to launch your first campaign and start earning.
                    </p>
                  </div>
                )}
              </div>

              {/* Reach Mode Configuration */}
              <div className="space-y-8">
                {/* Budget */}
                <div>
                  <Label className="text-retro-display mb-3 block">TOTAL BUDGET</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[parseInt(reachData.budget) || 100]}
                      onValueChange={(value) => setReachData(prev => ({ ...prev, budget: value[0].toString() }))}
                      min={100}
                      max={10000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-retro-mono text-sm">
                      <span>$100</span>
                      <span className="status-approved px-2 py-1">
                        ${reachData.budget || '100'}
                      </span>
                      <span>$10,000</span>
                    </div>
                  </div>
                  <p className="text-retro-mono text-xs text-muted-foreground mt-2">
                    Maximum payout limit: ${Math.floor((parseInt(reachData.budget) || 100) / parseFloat(reachData.cpmRate)).toLocaleString()} views
                  </p>
                </div>

                {/* CPM Rate */}
                <div>
                  <Label className="text-retro-display mb-3 block">CPM RATE</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[parseFloat(reachData.cpmRate)]}
                      onValueChange={(value) => setReachData(prev => ({ ...prev, cpmRate: value[0].toFixed(2) }))}
                      min={0.5}
                      max={5.0}
                      step={0.25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-retro-mono text-sm">
                      <span>$0.50</span>
                      <span className="status-pending px-2 py-1">
                        ${reachData.cpmRate}
                      </span>
                      <span>$5.00</span>
                    </div>
                  </div>
                  <p className="text-retro-mono text-xs text-muted-foreground mt-2">
                    Earnings per 1,000 views: ${(parseFloat(reachData.cpmRate) * parseInt(reachData.minViews) / 1000).toFixed(2)} at {parseInt(reachData.minViews).toLocaleString()} views
                  </p>
                </div>

                {/* Minimum View Threshold */}
                <div>
                  <Label className="text-retro-display mb-3 block">MINIMUM VIEW THRESHOLD</Label>
                  <Select value={reachData.minViews} onValueChange={(value) => setReachData(prev => ({ ...prev, minViews: value }))}>
                    <SelectTrigger className="input-retro">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5000">5,000 views</SelectItem>
                      <SelectItem value="10000">10,000 views</SelectItem>
                      <SelectItem value="25000">25,000 views</SelectItem>
                      <SelectItem value="50000">50,000 views</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-retro-mono text-xs text-muted-foreground mt-2">
                    Minimum views required before payout starts
                  </p>
                </div>

                {/* Max Submissions */}
                <div>
                  <Label className="text-retro-display mb-3 block">MAX SUBMISSIONS (OPTIONAL)</Label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={reachData.maxSubmissions}
                    onChange={(e) => setReachData(prev => ({ ...prev, maxSubmissions: e.target.value }))}
                    className={`input-retro ${isPreviewMode && reachData.maxSubmissions ? 'bg-primary/5 border-primary/30' : ''}`}
                  />
                  <p className="text-retro-mono text-xs text-muted-foreground mt-2">
                    Cap on number of submissions to control budget
                  </p>
                </div>

                {/* Campaign Duration */}
                <div>
                  <Label className="text-retro-display mb-3 block">CAMPAIGN DURATION</Label>
                  <Select value={reachData.campaignDuration} onValueChange={(value) => setReachData(prev => ({ ...prev, campaignDuration: value }))}>
                    <SelectTrigger className="input-retro">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-retro-mono text-xs text-muted-foreground mt-2">
                    How long clips can be submitted and earn rewards
                  </p>
                </div>

                {/* Creator Notes */}
                <div>
                  <Label className="text-retro-display mb-3 block">CREATOR NOTES (OPTIONAL)</Label>
                  <div className="relative">
                    <Textarea
                      placeholder="Specify content guidelines, style preferences, or restrictions"
                      value={reachData.creatorNotes}
                      onChange={(e) => setReachData(prev => ({ ...prev, creatorNotes: e.target.value }))}
                      className={`input-retro min-h-[100px] ${isPreviewMode && reachData.creatorNotes ? 'bg-primary/5 border-primary/30' : ''}`}
                    />
                    {isPreviewMode && reachData.creatorNotes && (
                      <Badge className="absolute top-3 right-3 bg-primary/20 text-primary text-xs px-2 py-1">
                        EXAMPLE
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <Card className="window-card bg-white p-6 sticky top-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-retro-display text-lg mb-4">CAMPAIGN SUMMARY</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-retro-mono text-xs">CAMPAIGN TYPE</span>
                      <Badge className="status-pending px-2 py-1 text-xs">REACH MODE</Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-retro-mono text-xs">TOTAL BUDGET</span>
                      <span className="text-retro-display">${reachData.budget || '0'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-retro-mono text-xs">CPM RATE</span>
                      <span className="text-retro-display">${reachData.cpmRate}/1K views</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-retro-mono text-xs">MIN VIEWS</span>
                      <span className="text-retro-display">{parseInt(reachData.minViews).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-retro-mono text-xs">DURATION</span>
                      <span className="text-retro-display">{reachData.campaignDuration} days</span>
                    </div>
                    
                    {reachData.maxSubmissions && (
                      <div className="flex justify-between">
                        <span className="text-retro-mono text-xs">MAX SUBMISSIONS</span>
                        <span className="text-retro-display">{reachData.maxSubmissions}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="bg-secondary-pale p-4 rounded-lg mb-4">
                    <h4 className="text-retro-display text-sm mb-2">ESTIMATED REACH</h4>
                    <div className="space-y-2 text-retro-mono text-xs">
                      <div>Target payout at 100K views: ${((100000 * parseFloat(reachData.cpmRate)) / 1000).toFixed(0)}</div>
                      <div>Target payout at 500K views: ${((500000 * parseFloat(reachData.cpmRate)) / 1000).toFixed(0)}</div>
                      <div>Target payout at 1M views: ${((1000000 * parseFloat(reachData.cpmRate)) / 1000).toFixed(0)}</div>
                    </div>
                  </div>

                  {isPreviewMode ? (
                    <div className="space-y-3">
                      <Button onClick={onSignup} className="w-full btn-primary">
                        <UserPlus className="w-4 h-4 mr-2" />
                        SIGN UP TO LAUNCH
                      </Button>
                      <Button onClick={onLogin} variant="outline" className="w-full btn-secondary-cyan">
                        <LogIn className="w-4 h-4 mr-2" />
                        HAVE ACCOUNT? LOGIN
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleLaunch}
                      className="w-full btn-primary"
                      disabled={!reachData.budget || !reachData.cpmRate}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      LAUNCH CAMPAIGN
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}