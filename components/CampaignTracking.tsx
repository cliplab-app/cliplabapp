'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Zap,
  Eye,
  Target,
  DollarSign,
  Clock,
  Users,
  Crown,
  Award,
  Star,
  Play,
  TrendingUp,
  Filter,
  Download,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  Trophy,
  Timer,
  Activity,
  CheckCircle,
  XCircle,
  Edit3,
  StopCircle,
  AlertTriangle
} from 'lucide-react';
import { User, Bounty, Submission } from '../App';

interface CampaignTrackingProps {
  campaign: Bounty;
  user: User;
  submissions: Submission[];
  onBack: () => void;
  onUpdateSubmissionStatus?: (submissionId: string, status: Submission['status']) => void;
  onEditCampaign?: () => void;
  onEndCampaign?: () => void;
}

type LeaderboardEntry = {
  rank: number;
  submission: Submission;
  score: number;
  estimatedEarnings: number;
};

export function CampaignTracking({ 
  campaign, 
  user, 
  submissions, 
  onBack, 
  onUpdateSubmissionStatus,
  onEditCampaign,
  onEndCampaign 
}: CampaignTrackingProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['header', 'leaderboard']));
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'mine'>('all');
  const [submissionSort, setSubmissionSort] = useState<'newest' | 'views' | 'earnings'>('newest');
  const [showMySubmissions, setShowMySubmissions] = useState(false);

  const isCreator = user.role === 'creator';
  const isClipper = user.role === 'clipper';
  
  // Calculate time remaining
  const timeRemaining = Math.max(0, campaign.deadline.getTime() - Date.now());
  const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  // Campaign data based on mode
  const campaignData = campaign.campaignData || {};
  
  // Calculate progress metrics
  const budgetSpent = campaign.campaignMode === 'reach' 
    ? Math.min(campaign.amount, submissions.length * 50) // Mock calculation
    : submissions.filter(s => s.status.includes('winner')).length > 0 ? campaign.amount : 0;
  
  const budgetProgress = (budgetSpent / campaign.amount) * 100;
  const timeProgress = ((Date.now() - campaign.createdAt.getTime()) / (campaign.deadline.getTime() - campaign.createdAt.getTime())) * 100;
  
  // Generate leaderboard for velocity/reach modes
  const generateLeaderboard = (): LeaderboardEntry[] => {
    if (campaign.campaignMode === 'select') return [];
    
    return submissions
      .filter(s => s.youtubeData)
      .map((submission, index) => {
        let score = 0;
        let estimatedEarnings = 0;
        
        if (campaign.campaignMode === 'velocity' && submission.youtubeData) {
          const weights = campaignData;
          score = (submission.youtubeData.views * (weights?.viewsWeight || 50) / 100) +
                  (submission.youtubeData.likes * (weights?.likesWeight || 30) / 100) +
                  (submission.youtubeData.comments * (weights?.commentsWeight || 20) / 100);
          
          // Calculate earnings based on rank
          const rank = index + 1;
          if (rank === 1) estimatedEarnings = campaign.amount * (parseInt(campaignData.firstPlace || '50') / 100);
          else if (rank === 2) estimatedEarnings = campaign.amount * (parseInt(campaignData.secondPlace || '30') / 100);
          else if (rank === 3) estimatedEarnings = campaign.amount * (parseInt(campaignData.thirdPlace || '20') / 100);
        } else if (campaign.campaignMode === 'reach' && submission.youtubeData) {
          score = submission.youtubeData.views;
          const cpmRate = parseFloat(campaignData.cpmRate || '1.50');
          const minViews = parseInt(campaignData.minViews || '10000');
          if (submission.youtubeData.views >= minViews) {
            estimatedEarnings = (submission.youtubeData.views / 1000) * cpmRate;
          }
        }
        
        return {
          rank: index + 1,
          submission,
          score,
          estimatedEarnings
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, 10);
  };

  const leaderboard = generateLeaderboard();
  const mySubmissions = submissions.filter(s => s.clipperId === user.id);
  const myEarnings = mySubmissions.reduce((total, sub) => {
    const entry = leaderboard.find(l => l.submission.id === sub.id);
    return total + (entry?.estimatedEarnings || 0);
  }, 0);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getModeIcon = () => {
    switch (campaign.campaignMode) {
      case 'velocity': return Zap;
      case 'reach': return Eye;
      case 'select': return Target;
      default: return Trophy;
    }
  };

  const getModeColor = () => {
    switch (campaign.campaignMode) {
      case 'velocity': return 'bg-secondary';
      case 'reach': return 'bg-status-pending';
      case 'select': return 'bg-primary';
      default: return 'bg-primary';
    }
  };

  const filteredSubmissions = submissions
    .filter(sub => submissionFilter === 'all' || sub.clipperId === user.id)
    .sort((a, b) => {
      switch (submissionSort) {
        case 'views':
          return (b.youtubeData?.views || 0) - (a.youtubeData?.views || 0);
        case 'earnings':
          const aEarnings = leaderboard.find(l => l.submission.id === a.id)?.estimatedEarnings || 0;
          const bEarnings = leaderboard.find(l => l.submission.id === b.id)?.estimatedEarnings || 0;
          return bEarnings - aEarnings;
        default:
          return b.submittedAt.getTime() - a.submittedAt.getTime();
      }
    });

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon,
    children,
    defaultExpanded = false 
  }: {
    id: string;
    title: string;
    icon: any;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <div className="border border-border rounded-lg overflow-hidden window-card">
        <Button
          variant="ghost"
          onClick={() => toggleSection(id)}
          className="w-full p-4 h-auto justify-between rounded-none hover:bg-background-secondary"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-retro-display text-lg">{title}</span>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
        
        {isExpanded && (
          <div className="border-t border-border bg-background-secondary/30 p-6">
            {children}
          </div>
        )}
      </div>
    );
  };

  const IconComponent = getModeIcon();

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${getModeColor()} border-2 border-foreground flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-retro-display text-lg">CAMPAIGN TRACKING</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="status-approved px-4 py-2">
                LIVE CAMPAIGN
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* 1. Campaign Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="btn-secondary-cyan px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
          <div className="h-6 w-px bg-border"></div>
        </div>
        
        <CollapsibleSection id="header" title="Campaign Overview" icon={Trophy} defaultExpanded>
          <div className="space-y-6">
            {/* Title and Status */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-retro-display text-3xl mb-2">{campaign.title}</h1>
                <p className="text-muted-foreground mb-4">{campaign.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className={`px-3 py-2 ${getModeColor()} text-white`}>
                    <IconComponent className="w-4 h-4 mr-2" />
                    {campaign.campaignMode?.toUpperCase()} MODE
                  </Badge>
                  <Badge className="status-approved px-3 py-2">
                    <Activity className="w-4 h-4 mr-2" />
                    LIVE
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-retro-display text-3xl text-primary mb-2">
                  ${campaign.amount.toLocaleString()}
                </div>
                <div className="text-retro-mono text-sm text-muted-foreground">
                  Total Budget
                </div>
              </div>
            </div>

            {/* Time and Budget Progress */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Time Remaining */}
              <div className="window-card p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Timer className="w-5 h-5 text-status-pending" />
                  <span className="text-retro-display text-sm">TIME REMAINING</span>
                </div>
                <div className="space-y-3">
                  <div className="text-retro-display text-2xl">
                    {daysLeft}d {hoursLeft}h {minutesLeft}m
                  </div>
                  <Progress value={Math.min(100, timeProgress)} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Started: {campaign.createdAt.toLocaleDateString()}</span>
                    <span>Ends: {campaign.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Budget Status */}
              <div className="window-card p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-retro-display text-sm">BUDGET STATUS</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-retro-display text-lg text-status-rejected">
                      ${budgetSpent.toLocaleString()}
                    </span>
                    <span className="text-retro-mono text-sm text-muted-foreground">spent</span>
                  </div>
                  <Progress value={budgetProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${(campaign.amount - budgetSpent).toLocaleString()} remaining</span>
                    <span>{budgetProgress.toFixed(1)}% used</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Information */}
            <div className="window-card p-4 bg-primary/5 border-primary/30">
              <div className="flex items-center space-x-2 mb-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-retro-display text-sm">PAYOUT STRUCTURE</span>
              </div>
              {campaign.campaignMode === 'velocity' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-retro-display text-lg text-status-winner-1st">
                      {campaignData.firstPlace || 50}%
                    </div>
                    <div className="text-xs text-muted-foreground">1st Place</div>
                    <div className="text-retro-mono text-sm">${((campaign.amount * (parseInt(campaignData.firstPlace || '50') / 100))).toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-retro-display text-lg text-status-winner-2nd">
                      {campaignData.secondPlace || 30}%
                    </div>
                    <div className="text-xs text-muted-foreground">2nd Place</div>
                    <div className="text-retro-mono text-sm">${((campaign.amount * (parseInt(campaignData.secondPlace || '30') / 100))).toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-retro-display text-lg text-status-winner-3rd">
                      {campaignData.thirdPlace || 20}%
                    </div>
                    <div className="text-xs text-muted-foreground">3rd Place</div>
                    <div className="text-retro-mono text-sm">${((campaign.amount * (parseInt(campaignData.thirdPlace || '20') / 100))).toLocaleString()}</div>
                  </div>
                </div>
              )}
              {campaign.campaignMode === 'reach' && (
                <div className="flex items-center justify-between">
                  <span className="text-retro-mono">CPM Rate: ${campaignData.cpmRate || '1.50'}</span>
                  <span className="text-retro-mono">Min Views: {parseInt(campaignData.minViews || '10000').toLocaleString()}</span>
                  <span className="text-retro-mono">Max Submissions: {campaignData.maxSubmissions || 'Unlimited'}</span>
                </div>
              )}
              {campaign.campaignMode === 'select' && (
                <div className="flex items-center justify-between">
                  <span className="text-retro-mono">Winners: {campaignData.numWinners || 3}</span>
                  <span className="text-retro-mono">Prize per Winner: ${(campaign.amount / parseInt(campaignData.numWinners || '3')).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. Leaderboard Section */}
        {(campaign.campaignMode === 'velocity' || campaign.campaignMode === 'reach') && (
          <CollapsibleSection id="leaderboard" title="Live Leaderboard" icon={BarChart3} defaultExpanded>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-retro-display text-sm">TOP PERFORMERS</span>
                  <Badge className="status-pending px-2 py-1">
                    {leaderboard.length} SUBMISSIONS
                  </Badge>
                </div>
                <Tabs value={showMySubmissions ? 'mine' : 'all'} onValueChange={(value) => setShowMySubmissions(value === 'mine')}>
                  <TabsList className="grid w-48 grid-cols-2">
                    <TabsTrigger value="all">All Clips</TabsTrigger>
                    <TabsTrigger value="mine">My Clips</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                {(showMySubmissions ? leaderboard.filter(entry => entry.submission.clipperId === user.id) : leaderboard).map((entry) => (
                  <div key={entry.submission.id} className="window-card p-4 bg-card">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank === 1 ? 'bg-status-winner-1st text-foreground' :
                        entry.rank === 2 ? 'bg-status-winner-2nd text-foreground' :
                        entry.rank === 3 ? 'bg-status-winner-3rd text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank === 1 && <Crown className="w-4 h-4" />}
                        {entry.rank === 2 && <Award className="w-4 h-4" />}
                        {entry.rank === 3 && <Star className="w-4 h-4" />}
                        {entry.rank > 3 && entry.rank}
                      </div>

                      {/* Thumbnail */}
                      <div className="w-16 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary" />
                      </div>

                      {/* Clip Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-retro-mono text-sm truncate">{entry.submission.youtubeData?.title}</h4>
                        <p className="text-xs text-muted-foreground">@{entry.submission.clipperUsername}</p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{(entry.submission.youtubeData?.views || 0).toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{entry.score.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="text-right">
                        <div className="text-retro-display text-lg text-primary">
                          ${entry.estimatedEarnings.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Est. Earnings</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet. Be the first to submit!</p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* 3. Campaign Completion Meter */}
        <CollapsibleSection id="progress" title="Campaign Progress" icon={Activity}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Budget Progress */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - budgetProgress / 100)}`}
                    className="text-primary transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-retro-display text-lg">{budgetProgress.toFixed(0)}%</span>
                </div>
              </div>
              <h4 className="text-retro-display text-sm mb-2">BUDGET SPENT</h4>
              <p className="text-retro-mono text-xs text-muted-foreground">
                ${budgetSpent.toLocaleString()} of ${campaign.amount.toLocaleString()}
              </p>
            </div>

            {/* Time Progress */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(100, timeProgress) / 100)}`}
                    className="text-status-pending transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-retro-display text-lg">{Math.min(100, timeProgress).toFixed(0)}%</span>
                </div>
              </div>
              <h4 className="text-retro-display text-sm mb-2">TIME ELAPSED</h4>
              <p className="text-retro-mono text-xs text-muted-foreground">
                {daysLeft}d {hoursLeft}h remaining
              </p>
            </div>

            {/* Submission Progress */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(100, (submissions.length / (parseInt(campaignData.maxSubmissions) || 100)) * 100) / 100)}`}
                    className="text-secondary transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-retro-display text-lg">{submissions.length}</span>
                </div>
              </div>
              <h4 className="text-retro-display text-sm mb-2">SUBMISSIONS</h4>
              <p className="text-retro-mono text-xs text-muted-foreground">
                {campaignData.maxSubmissions ? `of ${campaignData.maxSubmissions} max` : 'total received'}
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. Submission Feed */}
        <CollapsibleSection id="submissions" title="Submission Feed" icon={Play}>
          <div className="space-y-4">
            {/* Filters and Sorting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={submissionFilter} onValueChange={(value: 'all' | 'mine') => setSubmissionFilter(value)}>
                  <SelectTrigger className="w-32 input-retro">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clips</SelectItem>
                    <SelectItem value="mine">My Clips</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={submissionSort} onValueChange={(value: 'newest' | 'views' | 'earnings') => setSubmissionSort(value)}>
                  <SelectTrigger className="w-36 input-retro">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="earnings">Top Earnings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Badge className="status-pending px-3 py-1">
                {filteredSubmissions.length} CLIPS
              </Badge>
            </div>

            {/* Submission Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubmissions.map((submission) => {
                const leaderboardEntry = leaderboard.find(l => l.submission.id === submission.id);
                return (
                  <div key={submission.id} className="window-card p-4 bg-card">
                    <div className="space-y-3">
                      {/* Thumbnail and Status */}
                      <div className="relative">
                        <div className="w-full h-32 bg-primary/20 rounded flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary" />
                        </div>
                        {leaderboardEntry && leaderboardEntry.rank <= 3 && (
                          <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            leaderboardEntry.rank === 1 ? 'bg-status-winner-1st text-foreground' :
                            leaderboardEntry.rank === 2 ? 'bg-status-winner-2nd text-foreground' :
                            'bg-status-winner-3rd text-white'
                          }`}>
                            {leaderboardEntry.rank === 1 && <Crown className="w-3 h-3" />}
                            {leaderboardEntry.rank === 2 && <Award className="w-3 h-3" />}
                            {leaderboardEntry.rank === 3 && <Star className="w-3 h-3" />}
                          </div>
                        )}
                        <Badge className={`absolute top-2 right-2 px-2 py-1 text-xs ${
                          submission.status === 'pending' ? 'status-pending' :
                          submission.status === 'approved' ? 'status-approved' :
                          submission.status.includes('winner') ? 'status-winner-1st' :
                          'status-rejected'
                        }`}>
                          {submission.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      {/* Clip Info */}
                      <div>
                        <h4 className="text-retro-mono text-sm line-clamp-2 mb-1">
                          {submission.youtubeData?.title || submission.description}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">@{submission.clipperUsername}</p>
                        <div className="text-xs text-muted-foreground">
                          {submission.submittedAt.toLocaleDateString()}
                        </div>
                      </div>

                      {/* Metrics */}
                      {submission.youtubeData && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Views:</span>
                            <span className="ml-1 text-retro-mono">{submission.youtubeData.views.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Likes:</span>
                            <span className="ml-1 text-retro-mono">{submission.youtubeData.likes.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Earnings */}
                      {leaderboardEntry && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Est. Earnings:</span>
                            <span className="text-retro-display text-sm text-primary">
                              ${leaderboardEntry.estimatedEarnings.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Creator Actions */}
                      {isCreator && submission.status === 'pending' && onUpdateSubmissionStatus && (
                        <div className="flex space-x-2 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            onClick={() => onUpdateSubmissionStatus(submission.id, 'approved')}
                            className="flex-1 bg-status-approved text-foreground hover:bg-status-approved/80"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            APPROVE
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onUpdateSubmissionStatus(submission.id, 'rejected')}
                            className="flex-1 bg-status-rejected text-white hover:bg-status-rejected/80"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            REJECT
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No submissions found with current filters.</p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* 5. Clipper Earnings Section */}
        {isClipper && (
          <CollapsibleSection id="earnings" title="Your Earning Potential" icon={DollarSign}>
            <div className="space-y-6">
              {/* Current Earnings */}
              <div className="window-card p-6 bg-primary/5 border-primary/30">
                <div className="text-center">
                  <h3 className="text-retro-display text-sm mb-2">YOUR CURRENT EARNINGS</h3>
                  <div className="text-retro-display text-3xl text-primary mb-4">
                    ${myEarnings.toFixed(0)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Submissions:</span>
                      <span className="ml-2 text-retro-mono">{mySubmissions.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best Rank:</span>
                      <span className="ml-2 text-retro-mono">
                        {Math.min(...mySubmissions.map(sub => 
                          leaderboard.find(l => l.submission.id === sub.id)?.rank || Infinity
                        )) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earning Opportunities */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="window-card p-4">
                  <h4 className="text-retro-display text-sm mb-3">REMAINING POTENTIAL</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Max Total Payout:</span>
                      <span className="text-retro-mono">${campaign.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Remaining:</span>
                      <span className="text-retro-mono text-primary">${(campaign.amount - budgetSpent).toLocaleString()}</span>
                    </div>
                    {campaign.campaignMode === 'velocity' && (
                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2">Prize Structure:</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>1st Place:</span>
                            <span className="text-retro-mono">${((campaign.amount * (parseInt(campaignData.firstPlace || '50') / 100))).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>2nd Place:</span>
                            <span className="text-retro-mono">${((campaign.amount * (parseInt(campaignData.secondPlace || '30') / 100))).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>3rd Place:</span>
                            <span className="text-retro-mono">${((campaign.amount * (parseInt(campaignData.thirdPlace || '20') / 100))).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="window-card p-4">
                  <h4 className="text-retro-display text-sm mb-3">PERFORMANCE TIPS</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {campaign.campaignMode === 'velocity' && (
                      <>
                        <p>• Focus on engagement: views ({campaignData.viewsWeight || 50}%), likes ({campaignData.likesWeight || 30}%), comments ({campaignData.commentsWeight || 20}%)</p>
                        <p>• Post during peak hours for maximum visibility</p>
                        <p>• Use trending hashtags and compelling thumbnails</p>
                      </>
                    )}
                    {campaign.campaignMode === 'reach' && (
                      <>
                        <p>• Minimum {parseInt(campaignData.minViews || '10000').toLocaleString()} views required for payout</p>
                        <p>• Earn ${campaignData.cpmRate || '1.50'} per 1,000 views</p>
                        <p>• No submission limit - keep posting!</p>
                      </>
                    )}
                    {campaign.campaignMode === 'select' && (
                      <>
                        <p>• {campaignData.numWinners || 3} winners will be manually selected</p>
                        <p>• Focus on creativity and brand alignment</p>
                        <p>• Deadline: {new Date(campaignData.submissionDeadline).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* 6. Creator Tools */}
        {isCreator && (
          <CollapsibleSection id="creator-tools" title="Creator Tools" icon={Settings}>
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Button 
                  onClick={onEditCampaign}
                  className="btn-secondary-cyan p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <Edit3 className="w-6 h-6" />
                  <span className="text-sm">EDIT CAMPAIGN</span>
                </Button>

                <Button 
                  onClick={onEndCampaign}
                  className="btn-secondary-pink p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <StopCircle className="w-6 h-6" />
                  <span className="text-sm">END EARLY</span>
                </Button>

                <Button 
                  className="bg-muted hover:bg-muted/80 text-muted-foreground p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-sm">EXPORT CSV</span>
                </Button>

                {campaign.campaignMode === 'select' && (
                  <Button 
                    className="btn-primary p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <Trophy className="w-6 h-6" />
                    <span className="text-sm">PICK WINNERS</span>
                  </Button>
                )}
              </div>

              {/* Campaign Analytics Summary */}
              <div className="window-card p-4 bg-background-secondary/50">
                <h4 className="text-retro-display text-sm mb-4">CAMPAIGN ANALYTICS</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Views:</span>
                    <div className="text-retro-mono text-lg">{submissions.reduce((total, sub) => total + (sub.youtubeData?.views || 0), 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg. Engagement:</span>
                    <div className="text-retro-mono text-lg">
                      {submissions.length > 0 ? 
                        ((submissions.reduce((total, sub) => {
                          if (!sub.youtubeData) return total;
                          return total + ((sub.youtubeData.likes + sub.youtubeData.comments) / sub.youtubeData.views);
                        }, 0) / submissions.length) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pending Review:</span>
                    <div className="text-retro-mono text-lg">{submissions.filter(s => s.status === 'pending').length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approved:</span>
                    <div className="text-retro-mono text-lg">{submissions.filter(s => s.status === 'approved' || s.status.includes('winner')).length}</div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}
      </main>
    </div>
  );
}