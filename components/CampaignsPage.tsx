'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft,
  Crown, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Trophy,
  Zap,
  Flame,
  ChevronDown,
  ChevronUp,
  Play,
  BarChart3,
  Activity,
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Youtube,
  Video,
  Instagram,
  Twitter,
  Pause,
  Edit3,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { User, Bounty, Submission } from '../App';

interface CampaignsPageProps {
  user: User;
  bounties: Bounty[];
  onBack: () => void;
  onUpdateSubmissionStatus: (submissionId: string, status: Submission['status']) => void;
  onViewCampaign?: (campaign: Bounty) => void;
  onNavigateToPage?: (page: string) => void;
}

export function CampaignsPage({ 
  user, 
  bounties, 
  onBack,
  onUpdateSubmissionStatus,
  onViewCampaign,
  onNavigateToPage 
}: CampaignsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  const filteredBounties = bounties.filter(bounty => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bounty.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCampaigns = filteredBounties.filter(b => b.status === 'active');
  const completedCampaigns = filteredBounties.filter(b => b.status === 'completed');
  const expiredCampaigns = filteredBounties.filter(b => b.status === 'expired');

  const totalSpent = bounties.reduce((acc, b) => acc + b.amount, 0);
  const totalSubmissions = bounties.reduce((acc, b) => acc + b.submissions.length, 0);
  const totalViews = bounties.reduce((acc, b) => 
    acc + b.submissions.reduce((subAcc, sub) => subAcc + (sub.youtubeData?.views || 0), 0), 0
  );

  const toggleCampaignExpanded = (campaignId: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedCampaigns(newExpanded);
  };

  const getCampaignPerformance = (bounty: Bounty) => {
    const totalViews = bounty.submissions.reduce((acc, sub) => acc + (sub.youtubeData?.views || 0), 0);
    const totalLikes = bounty.submissions.reduce((acc, sub) => acc + (sub.youtubeData?.likes || 0), 0);
    const totalComments = bounty.submissions.reduce((acc, sub) => acc + (sub.youtubeData?.comments || 0), 0);
    const winnerSubmissions = bounty.submissions.filter(sub => sub.status.includes('winner'));
    
    return { totalViews, totalLikes, totalComments, winnerSubmissions };
  };

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <span className="text-retro-display text-2xl">CAMPAIGNS</span>
                  <div className="text-xs text-muted-foreground">Campaign Management</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-retro-display text-sm">Welcome, {user.username}</div>
                <div className="text-xs text-muted-foreground">Level {user.level} Creator</div>
              </div>
              <Button 
                onClick={() => onNavigateToPage?.('campaign-creation')}
                className="btn-primary px-6 py-3"
              >
                <Zap className="w-5 h-5 mr-2" />
                NEW CAMPAIGN
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Campaign Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="window-card bg-gradient-to-r from-primary to-primary-alt p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/80 text-sm">Total Campaigns</p>
                <p className="text-2xl text-retro-display text-foreground">{bounties.length}</p>
              </div>
              <Crown className="w-8 h-8 text-foreground/80" />
            </div>
          </Card>

          <Card className="window-card bg-status-approved/10 border-status-approved/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Spent</p>
                <p className="text-2xl text-status-approved text-retro-display">${totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-status-approved" />
            </div>
          </Card>

          <Card className="window-card bg-vibrant-blue/10 border-vibrant-blue/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Views</p>
                <p className="text-2xl text-vibrant-blue text-retro-display">{(totalViews / 1000000).toFixed(1)}M</p>
              </div>
              <Eye className="w-8 h-8 text-vibrant-blue" />
            </div>
          </Card>

          <Card className="window-card bg-vibrant-purple/10 border-vibrant-purple/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Submissions</p>
                <p className="text-2xl text-vibrant-purple text-retro-display">{totalSubmissions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-vibrant-purple" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="window-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-retro pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 input-retro">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Campaign Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="window-card bg-status-approved/5 border-status-approved/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-retro-display text-lg mb-2">ACTIVE CAMPAIGNS</h3>
                <p className="text-3xl text-status-approved text-retro-display">{activeCampaigns.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Running campaigns</p>
              </div>
              <Activity className="w-12 h-12 text-status-approved" />
            </div>
          </Card>

          <Card className="window-card bg-status-pending/5 border-status-pending/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-retro-display text-lg mb-2">COMPLETED</h3>
                <p className="text-3xl text-status-pending text-retro-display">{completedCampaigns.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Finished campaigns</p>
              </div>
              <CheckCircle className="w-12 h-12 text-status-pending" />
            </div>
          </Card>

          <Card className="window-card bg-status-rejected/5 border-status-rejected/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-retro-display text-lg mb-2">EXPIRED</h3>
                <p className="text-3xl text-status-rejected text-retro-display">{expiredCampaigns.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Expired campaigns</p>
              </div>
              <XCircle className="w-12 h-12 text-status-rejected" />
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-retro-display text-2xl">
              ALL CAMPAIGNS ({filteredBounties.length})
            </h2>
          </div>

          {filteredBounties.length === 0 ? (
            <Card className="window-card text-center p-12">
              <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Campaigns Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Launch your first campaign to start amplifying your content'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => onNavigateToPage?.('campaign-creation')} className="btn-primary px-8 py-3">
                  <Zap className="w-5 h-5 mr-2" />
                  CREATE CAMPAIGN
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBounties.map((bounty) => {
                const isExpanded = expandedCampaigns.has(bounty.id);
                const performance = getCampaignPerformance(bounty);
                
                return (
                  <Card key={bounty.id} className="window-card p-0 overflow-hidden">
                    {/* Campaign Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-retro-display text-lg">{bounty.title}</h3>
                            {bounty.featured && (
                              <Badge className="status-winner-1st px-2 py-1">
                                <Flame className="w-3 h-3 mr-1" />
                                FEATURED
                              </Badge>
                            )}
                            <Badge className={`px-2 py-1 ${
                              bounty.status === 'active' ? 'status-approved' : 
                              bounty.status === 'completed' ? 'status-pending' : 'status-rejected'
                            }`}>
                              {bounty.status.toUpperCase()}
                            </Badge>
                            {bounty.campaignMode && (
                              <Badge variant="outline" className="border-primary/50 text-primary">
                                {bounty.campaignMode.toUpperCase()} MODE
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ends {bounty.deadline.toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{bounty.submissions.length} submissions</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{(performance.totalViews / 1000).toFixed(0)}K views</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge className="status-approved text-lg px-3 py-2">
                              ${bounty.amount.toLocaleString()}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {Math.max(0, Math.ceil((bounty.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {onViewCampaign && (
                              <Button 
                                onClick={() => onViewCampaign(bounty)}
                                size="sm"
                                className="btn-primary"
                              >
                                <Activity className="w-4 h-4 mr-1" />
                                VIEW
                              </Button>
                            )}
                            <Button 
                              onClick={() => toggleCampaignExpanded(bounty.id)}
                              variant="outline"
                              size="sm"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats Bar */}
                      <div className="grid grid-cols-4 gap-4 p-3 bg-background-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-sm text-retro-display text-primary">{bounty.submissions.length}</div>
                          <div className="text-xs text-muted-foreground">Submissions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-retro-display text-secondary">{(performance.totalViews / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-muted-foreground">Total Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-retro-display text-secondary-alt">{performance.winnerSubmissions.length}</div>
                          <div className="text-xs text-muted-foreground">Winners</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-retro-display text-status-approved">
                            {bounty.hashtags.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Tags</div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="border-t border-border bg-background-secondary/50 p-6 space-y-4">
                        {/* Description */}
                        <div>
                          <h4 className="text-retro-display text-sm mb-2">DESCRIPTION</h4>
                          <p className="text-sm text-muted-foreground">{bounty.description}</p>
                        </div>

                        {/* Tags */}
                        <div>
                          <h4 className="text-retro-display text-sm mb-2">TAGS</h4>
                          <div className="flex flex-wrap gap-2">
                            {bounty.hashtags.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-primary/50 text-primary">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Performance Details */}
                        <div>
                          <h4 className="text-retro-display text-sm mb-3">PERFORMANCE BREAKDOWN</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="window-card p-3 bg-card">
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4 text-vibrant-blue" />
                                <span className="text-sm">Total Views</span>
                              </div>
                              <div className="text-lg text-retro-display text-vibrant-blue">
                                {performance.totalViews.toLocaleString()}
                              </div>
                            </div>
                            <div className="window-card p-3 bg-card">
                              <div className="flex items-center space-x-2">
                                <Heart className="w-4 h-4 text-vibrant-purple" />
                                <span className="text-sm">Total Likes</span>
                              </div>
                              <div className="text-lg text-retro-display text-vibrant-purple">
                                {performance.totalLikes.toLocaleString()}
                              </div>
                            </div>
                            <div className="window-card p-3 bg-card">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="w-4 h-4 text-vibrant-green" />
                                <span className="text-sm">Comments</span>
                              </div>
                              <div className="text-lg text-retro-display text-vibrant-green">
                                {performance.totalComments.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Submissions */}
                        {bounty.submissions.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-retro-display text-sm">RECENT SUBMISSIONS</h4>
                              <Badge className="status-pending px-2 py-1">
                                {bounty.submissions.length} TOTAL
                              </Badge>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {bounty.submissions.slice(0, 5).map((submission) => (
                                <div key={submission.id} className="window-card p-3 bg-card">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className="w-8 h-6 bg-primary/20 rounded flex items-center justify-center">
                                        <Play className="w-3 h-3 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-retro-mono text-sm truncate">{submission.clipperUsername}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{submission.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 ml-3">
                                      {submission.youtubeData && (
                                        <div className="text-right text-xs text-muted-foreground">
                                          <div>{(submission.youtubeData.views / 1000).toFixed(0)}K views</div>
                                          <div>{(submission.youtubeData.likes / 1000).toFixed(1)}K likes</div>
                                        </div>
                                      )}
                                      <Badge className={`px-2 py-1 text-xs ${
                                        submission.status === 'pending' ? 'status-pending' :
                                        submission.status === 'approved' ? 'status-approved' :
                                        submission.status.includes('winner') ? 'status-winner-1st' :
                                        'status-rejected'
                                      }`}>
                                        {submission.status.replace('-', ' ').toUpperCase()}
                                      </Badge>
                                      {submission.status === 'pending' && (
                                        <div className="flex space-x-1">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onUpdateSubmissionStatus(submission.id, 'approved')}
                                            className="w-8 h-8 p-0 hover:bg-status-approved/20"
                                          >
                                            <CheckCircle className="w-3 h-3 text-status-approved" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onUpdateSubmissionStatus(submission.id, 'rejected')}
                                            className="w-8 h-8 p-0 hover:bg-status-rejected/20"
                                          >
                                            <XCircle className="w-3 h-3 text-status-rejected" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}