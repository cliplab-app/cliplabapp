'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Calendar,
  Users,
  Flame,
  ChevronDown,
  ChevronUp,
  Plus,
  Activity,
  Zap,
  Eye,
  Star,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Bounty } from '../../App';
import { CAMPAIGN_MODE_INFO } from '../constants/clipperConstants';
import exampleImage from 'figma:asset/a7ad2e5fa1d51be662182d21cebf2c086d69e4d4.png';

interface BountyCardProps {
  bounty: Bounty;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onSubmitClip: () => void;
  onViewCampaign?: () => void;
}

export function BountyCard({ 
  bounty, 
  isExpanded, 
  onToggleExpanded, 
  onSubmitClip,
  onViewCampaign 
}: BountyCardProps) {
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isClickable = target.closest('button') || 
                       target.closest('[role="button"]') || 
                       target.closest('input') || 
                       target.closest('select') || 
                       target.closest('textarea') ||
                       target.closest('.badge') ||
                       target.hasAttribute('data-prevent-card-click');
    
    if (!isClickable && onViewCampaign) {
      onViewCampaign();
    }
  };

  // Helper function to get creator username (mock data for now)
  const getCreatorUsername = (creatorId: string) => {
    const creators = {
      'creator1': 'druski',
      'creator2': 'adin ross',
      'creator3': 'kai cenat',
      'creator4': 'ishowspeed',
      'creator5': 'xqc',
      'creator6': 'nickmercs',
      'creator7': 'pokimane',
      'creator8': 'tfue',
      'creator9': 'valkyrae',
      'creator10': 'shroud'
    };
    return creators[creatorId as keyof typeof creators] || `Creator${creatorId.slice(-1)}`;
  };

  const getModeIcon = () => {
    switch (bounty.campaignMode) {
      case 'velocity': return Zap;
      case 'reach': return Eye;
      case 'select': return Star;
      default: return Star;
    }
  };

  // Calculate budget spent based on winning submissions and campaign mode
  const calculateBudgetSpent = () => {
    const winnerSubmissions = bounty.submissions.filter(sub => 
      sub.status.includes('winner') || sub.status === 'approved'
    );

    if (winnerSubmissions.length === 0) return 0;

    let totalSpent = 0;

    if (bounty.campaignMode === 'velocity' && bounty.campaignData) {
      // Velocity mode - percentage based payouts
      const firstPlace = parseFloat(bounty.campaignData.firstPlace || '50') / 100;
      const secondPlace = parseFloat(bounty.campaignData.secondPlace || '30') / 100;
      const thirdPlace = parseFloat(bounty.campaignData.thirdPlace || '20') / 100;

      winnerSubmissions.forEach(sub => {
        if (sub.status === 'winner-1st') {
          totalSpent += bounty.amount * firstPlace;
        } else if (sub.status === 'winner-2nd') {
          totalSpent += bounty.amount * secondPlace;
        } else if (sub.status === 'winner-3rd') {
          totalSpent += bounty.amount * thirdPlace;
        }
      });
    } else if (bounty.campaignMode === 'reach' && bounty.campaignData) {
      // Reach mode - CPM based payouts (simplified calculation)
      const cpmRate = parseFloat(bounty.campaignData.cpmRate || '1.50');
      winnerSubmissions.forEach(sub => {
        if (sub.youtubeData) {
          const payout = (sub.youtubeData.views / 1000) * cpmRate;
          totalSpent += Math.min(payout, bounty.amount * 0.8); // Cap at 80% of budget per submission
        }
      });
    } else if (bounty.campaignMode === 'select' && bounty.campaignData) {
      // Select mode - equal distribution among winners
      const numWinners = parseInt(bounty.campaignData.numWinners || '3');
      const payoutPerWinner = bounty.amount / numWinners;
      totalSpent = winnerSubmissions.length * payoutPerWinner;
    } else {
      // Default calculation - assume equal distribution
      const avgPayout = bounty.amount * 0.6; // 60% of budget for winners
      totalSpent = winnerSubmissions.length * (avgPayout / Math.max(winnerSubmissions.length, 1));
    }

    return Math.min(totalSpent, bounty.amount); // Never exceed total budget
  };

  const spent = calculateBudgetSpent();
  const remaining = bounty.amount - spent;
  const spentPercentage = (spent / bounty.amount) * 100;
  const isActivelyPaying = spent > 0;
  const isLowBudget = spentPercentage > 70;

  const ModeIcon = getModeIcon();

  // Calculate days ago
  const daysAgo = Math.floor((Date.now() - bounty.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card 
      className="window-card p-0 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]" 
      onClick={handleCardClick}
    >
      {/* New Compact Horizontal Layout matching reference image */}
      <div className="p-6">
        {/* Top Row: Title with HOT badge and Budget */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-retro-display text-xl font-bold uppercase tracking-tight">
              {bounty.title}
            </h3>
            {bounty.featured && (
              <Badge className="status-rejected px-2 py-1 text-xs font-bold">
                HOT
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${spent > 0 ? Math.round(spent).toLocaleString() : '0'}/${bounty.amount.toLocaleString()}
            </div>
            {spent > 0 && (
              <div className="w-20 h-1 bg-muted rounded-full mt-1">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Creator Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium">
              {daysAgo === 0 ? 'TODAY' : `${daysAgo} DAYS AGO`}
            </span>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">{bounty.submissions.length}</span>
            </div>
            <span className="text-muted-foreground font-medium">CREATOR</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">
              {getCreatorUsername(bounty.creatorId).replace(/([a-z])([A-Z])/g, '$1 $2')}
            </div>
          </div>
        </div>

        {/* Bottom Row: Description and Submit Button */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-6">
            <p className="text-sm text-muted-foreground">
              {bounty.description.length > 100 
                ? `${bounty.description.substring(0, 100)}...` 
                : bounty.description
              }
            </p>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onSubmitClip();
            }}
            className="btn-primary px-6 py-2 whitespace-nowrap"
            disabled={spentPercentage >= 95}
          >
            {spentPercentage >= 95 ? 'BUDGET FULL' : 'Submit A Clip'}
          </Button>
        </div>

        {/* Quick Tags Preview - Only show if not expanded */}
        {!isExpanded && (
          <div className="flex flex-wrap gap-2 mt-4">
            {bounty.hashtags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="border-primary/50 text-primary text-xs"
                data-prevent-card-click="true"
              >
                #{tag}
              </Badge>
            ))}
            {bounty.hashtags.length > 3 && (
              <Badge 
                variant="outline" 
                className="border-muted text-muted-foreground text-xs"
                data-prevent-card-click="true"
              >
                +{bounty.hashtags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Additional Actions Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex space-x-2">
            {onViewCampaign && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCampaign();
                }}
                variant="outline"
                className="btn-secondary-cyan px-4 py-1 text-xs"
              >
                <Activity className="w-3 h-3 mr-1" />
                TRACK
              </Button>
            )}
            {bounty.difficulty && (
              <Badge className="status-pending px-2 py-1 text-xs">
                {bounty.difficulty}
              </Badge>
            )}
            {isActivelyPaying && (
              <Badge className="status-approved px-2 py-1 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                PAYING OUT
              </Badge>
            )}
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            variant="outline"
            size="sm"
            className="px-3"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expandable Content - Keep existing expanded content */}
      {isExpanded && (
        <div className="border-t border-border bg-background-secondary/50 p-6 space-y-4">
          {/* Budget Breakdown */}
          {spent > 0 && (
            <div>
              <h4 className="text-retro-display text-sm mb-2">PAYOUT BREAKDOWN</h4>
              <div className="space-y-2">
                {bounty.submissions.filter(sub => sub.status.includes('winner') || sub.status === 'approved').map(sub => {
                  let payout = 0;
                  if (bounty.campaignMode === 'velocity' && bounty.campaignData) {
                    const firstPlace = parseFloat(bounty.campaignData.firstPlace || '50') / 100;
                    const secondPlace = parseFloat(bounty.campaignData.secondPlace || '30') / 100;
                    const thirdPlace = parseFloat(bounty.campaignData.thirdPlace || '20') / 100;
                    
                    if (sub.status === 'winner-1st') payout = bounty.amount * firstPlace;
                    else if (sub.status === 'winner-2nd') payout = bounty.amount * secondPlace;
                    else if (sub.status === 'winner-3rd') payout = bounty.amount * thirdPlace;
                  } else if (bounty.campaignMode === 'reach' && bounty.campaignData && sub.youtubeData) {
                    const cpmRate = parseFloat(bounty.campaignData.cpmRate || '1.50');
                    payout = Math.min((sub.youtubeData.views / 1000) * cpmRate, bounty.amount * 0.8);
                  } else if (bounty.campaignMode === 'select' && bounty.campaignData) {
                    const numWinners = parseInt(bounty.campaignData.numWinners || '3');
                    payout = bounty.amount / numWinners;
                  }
                  
                  return (
                    <div key={sub.id} className="flex justify-between items-center p-2 bg-card rounded border">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={
                            sub.status === 'winner-1st' ? 'status-winner-1st' :
                            sub.status === 'winner-2nd' ? 'status-winner-2nd' :
                            sub.status === 'winner-3rd' ? 'status-winner-3rd' :
                            'status-approved'
                          }
                          data-prevent-card-click="true"
                        >
                          {sub.status.replace('winner-', '').replace('1st', '1ST').replace('2nd', '2ND').replace('3rd', '3RD')}
                        </Badge>
                        <span className="text-sm">{sub.clipperUsername}</span>
                      </div>
                      <span className="text-sm text-vibrant-green">${Math.round(payout).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h4 className="text-retro-display text-sm mb-2">FULL DESCRIPTION</h4>
            <p className="text-sm text-muted-foreground">{bounty.description}</p>
          </div>

          {/* All Hashtags */}
          <div>
            <h4 className="text-retro-display text-sm mb-2">TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {bounty.hashtags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-primary/50 text-primary"
                  data-prevent-card-click="true"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Campaign Info */}
          {bounty.campaignMode && (
            <div>
              <h4 className="text-retro-display text-sm mb-2">CAMPAIGN MODE</h4>
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <ModeIcon className={`w-4 h-4 ${CAMPAIGN_MODE_INFO[bounty.campaignMode].color}`} />
                  <span className="text-retro-display text-sm capitalize">{bounty.campaignMode}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {CAMPAIGN_MODE_INFO[bounty.campaignMode].description}
                </p>
                
                {/* Campaign-specific details */}
                {bounty.campaignData && (
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    {bounty.campaignMode === 'velocity' && (
                      <>
                        <div>1st: {bounty.campaignData.firstPlace}% • 2nd: {bounty.campaignData.secondPlace}% • 3rd: {bounty.campaignData.thirdPlace}%</div>
                      </>
                    )}
                    {bounty.campaignMode === 'reach' && (
                      <>
                        <div>CPM Rate: ${bounty.campaignData.cpmRate} • Min Views: {parseInt(bounty.campaignData.minViews || '0').toLocaleString()}</div>
                      </>
                    )}
                    {bounty.campaignMode === 'select' && (
                      <>
                        <div>Winners: {bounty.campaignData.numWinners} • Review Period: {bounty.campaignData.reviewPeriod} days</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}