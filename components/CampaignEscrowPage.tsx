'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Crown, 
  Shield,
  CheckCircle,
  DollarSign,
  Eye,
  Calendar,
  Target,
  Lock,
  CreditCard,
  Zap,
  Users,
  TrendingUp,
  Star,
  Plus
} from 'lucide-react';

interface CampaignEscrowPageProps {
  onBack: () => void;
  onComplete: () => void;
  onAddPaymentMethod: () => void;
  campaignData: any;
  user: any;
  hasPaymentMethod?: boolean;
}

export function CampaignEscrowPage({ 
  onBack, 
  onComplete, 
  onAddPaymentMethod,
  campaignData, 
  user,
  hasPaymentMethod = false
}: CampaignEscrowPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const data = campaignData.data;
  const activePlatforms = data.platforms || [];
  const totalViews = data.totalExpectedViews || 0;
  const totalBudget = data.budget || 0;

  // Format large numbers for display
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(0) + 'K';
    }
    return views.toString();
  };

  const formatDuration = (duration: string): string => {
    const durationMap = {
      '3-days-fast': '3 Days',
      '7-days-balanced': '7 Days', 
      '14-days-extended': '14 Days',
      '30-days-long': '30 Days'
    };
    return durationMap[duration] || '7 Days';
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentConfirmed(true);
    setIsProcessing(false);
    
    // Auto-proceed after confirmation
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="outline"
            className="btn-secondary-cyan text-sm px-4 py-2"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>

          {/* Center Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CLIPLAB</h1>
              <p className="text-xs">Campaign Creator</p>
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CLIPLAB</h1>
              <p className="text-xs">Campaign Creator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white border-b-2 border-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-retro-display text-lg">CAMPAIGN SETUP</h2>
            <span className="text-retro-display text-sm">STEP 3 OF 3</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={100} className="h-3 border-2 border-foreground" />
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-sm">
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs text-muted-foreground">Campaign Type</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs text-muted-foreground">Campaign Details</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs">Escrow & Launch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-retro-display text-3xl mb-4">
              CONFIRM & LAUNCH
              <br />
              YOUR CAMPAIGN
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Review your campaign details and secure your budget in escrow to launch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Campaign Preview */}
            <div className="space-y-6">
              
              {/* Campaign Overview */}
              <Card className="window-card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="w-5 h-5" />
                  <h3 className="text-retro-display text-lg">CAMPAIGN PREVIEW</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-retro-display text-sm mb-2">{data.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
                  </div>

                  <Separator />

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <Eye className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-retro-display text-lg">{formatViews(totalViews)}</p>
                      <p className="text-xs text-muted-foreground">Total Reach</p>
                    </div>
                    
                    <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-secondary" />
                      <p className="text-retro-display text-lg">{formatDuration(data.duration)}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>

                  {/* Platform Breakdown */}
                  <div>
                    <h4 className="text-retro-display text-sm mb-3">PLATFORM DISTRIBUTION</h4>
                    <div className="space-y-2">
                      {activePlatforms.map((platform) => (
                        <div key={platform.id} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{platform.icon}</span>
                            <span className="text-sm">{platform.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-retro-display text-sm">{formatViews(platform.expectedViews)}</p>
                            <p className="text-xs text-muted-foreground">${platform.cpmRate} CPM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Sources */}
                  <div>
                    <h4 className="text-retro-display text-sm mb-3">CONTENT SOURCES</h4>
                    <div className="space-y-2">
                      {data.contentSources?.map((source, index) => (
                        <div key={index} className="p-2 bg-background-secondary rounded text-sm">
                          <p className="text-retro-display text-xs">{source.label}</p>
                          <p className="text-muted-foreground text-xs truncate">{source.url}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Escrow Protection */}
              <Card className="window-card p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-retro-display text-lg">ESCROW PROTECTION</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">Your budget is held in secure escrow</p>
                      <p className="text-xs text-muted-foreground">Funds are only released when clips reach view thresholds</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">Pay only for verified performance</p>
                      <p className="text-xs text-muted-foreground">10K+ view minimum per platform before payment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">100% refund guarantee</p>
                      <p className="text-xs text-muted-foreground">Get your money back if view thresholds aren't met</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Payment & Launch */}
            <div className="space-y-6">
              
              {/* Investment Summary */}
              <Card className="window-card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="text-retro-display text-lg">INVESTMENT SUMMARY</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Campaign Budget:</span>
                    <span className="text-retro-display">${totalBudget}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Platform Fee:</span>
                    <span className="text-retro-display">$0 (Beta)</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Processing Fee:</span>
                    <span className="text-retro-display">$0</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-retro-display">TOTAL INVESTMENT:</span>
                    <span className="text-retro-display text-lg">${totalBudget}</span>
                  </div>

                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 mt-4">
                    <p className="text-sm text-primary text-center">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Funds held in escrow until performance verified
                    </p>
                  </div>
                </div>
              </Card>

              {/* Expected Results */}
              <Card className="window-card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-retro-display text-lg">EXPECTED RESULTS</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm">Total Views:</span>
                    </div>
                    <span className="text-retro-display">{formatViews(totalViews)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="text-sm">Est. Submissions:</span>
                    </div>
                    <span className="text-retro-display">{data.estimatedSubmissions || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-status-pending" />
                      <span className="text-sm">Avg. CPM:</span>
                    </div>
                    <span className="text-retro-display">
                      ${(activePlatforms.reduce((sum, p) => sum + p.cpmRate, 0) / activePlatforms.length || 1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment Confirmation */}
              <Card className="window-card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="text-retro-display text-lg">PAYMENT & LAUNCH</h3>
                </div>

                {!paymentConfirmed ? (
                  <div className="space-y-4">
                    {/* Payment Method Section */}
                    {hasPaymentMethod ? (
                      // Show existing payment method
                      <div className="bg-background-secondary p-4 rounded-lg border">
                        <div className="flex items-center space-x-3 mb-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">Payment Method</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>Card ending in ••••1234</p>
                          <p>Expires 12/26</p>
                        </div>
                      </div>
                    ) : (
                      // Show add payment method button
                      <div className="bg-background-secondary p-4 rounded-lg border border-dashed border-muted-foreground/30">
                        <div className="text-center space-y-3">
                          <CreditCard className="w-8 h-8 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">No payment method added</p>
                            <Button
                              onClick={onAddPaymentMethod}
                              variant="outline"
                              className="btn-secondary-cyan"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              ADD PAYMENT DETAILS
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Launch Button - only show if has payment method */}
                    {hasPaymentMethod && (
                      <>
                        <Button
                          onClick={handlePaymentConfirm}
                          className="btn-primary w-full py-4"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 animate-pulse" />
                              <span>PROCESSING PAYMENT...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4" />
                              <span>CONFIRM & LAUNCH CAMPAIGN</span>
                            </div>
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          By confirming, you agree to our Terms of Service and Escrow Policy
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-retro-display text-lg text-primary">PAYMENT CONFIRMED!</h4>
                      <p className="text-sm text-muted-foreground">Your campaign is now live and accepting submissions</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}