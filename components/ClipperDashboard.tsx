'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  Flame,
  ArrowRight,
  Zap,
  Target,
  Play,
  LogOut,
  Trophy,
  TrendingUp,
  Settings,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { User, Bounty, Submission, FeaturedClip, TopCreator } from '../App';
import { BountyCard } from './ClipperDashboard/BountyCard';
import { SubmissionCard } from './ClipperDashboard/SubmissionCard';

interface ClipperDashboardProps {
  user: User;
  bounties: Bounty[];
  userSubmissions: Submission[];
  featuredClips: FeaturedClip[];
  topCreators: TopCreator[];
  onAddSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'youtubeData'>) => void;
  onViewCampaign: (campaign: Bounty) => void;
  defaultTab?: string;
  onLogout: () => void;
}

export function ClipperDashboard({ 
  user, 
  bounties, 
  userSubmissions, 
  featuredClips, 
  topCreators, 
  onAddSubmission, 
  onViewCampaign,
  defaultTab = 'bounties',
  onLogout
}: ClipperDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hot' | 'new'>('all');
  const [expandedBounties, setExpandedBounties] = useState<Set<string>>(new Set());

  const toggleBountyExpanded = (bountyId: string) => {
    const newExpanded = new Set(expandedBounties);
    if (newExpanded.has(bountyId)) {
      newExpanded.delete(bountyId);
    } else {
      newExpanded.add(bountyId);
    }
    setExpandedBounties(newExpanded);
  };

  // Filter bounties based on search and filter
  const filteredBounties = bounties.filter(bounty => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bounty.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'hot' && bounty.featured) ||
                         (selectedFilter === 'new' && new Date().getTime() - bounty.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmitClip = (bounty: Bounty) => {
    // Mock submission
    const mockUrl = `https://youtube.com/shorts/${Date.now()}`;
    onAddSubmission({
      bountyId: bounty.id,
      clipperId: user.id,
      clipperUsername: user.username,
      youtubeUrl: mockUrl,
      description: `New submission for ${bounty.title}`,
      status: 'pending'
    });
  };

  // Calculate user stats
  const totalEarnings = user.totalEarnings || 0;
  const pendingSubmissions = userSubmissions.filter(s => s.status === 'pending').length;
  const approvedSubmissions = userSubmissions.filter(s => s.status === 'approved').length;
  const totalSubmissions = userSubmissions.length;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                  <Play className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-retro-display text-lg">CLIPLAB</span>
              </div>
              <div className="h-6 w-px bg-foreground/20" />
              <span className="text-retro-display text-sm">CLIPPER HUB</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="status-approved px-3 py-2">
                <DollarSign className="w-4 h-4 mr-1" />
                ${totalEarnings.toLocaleString()}
              </Badge>
              <Badge className="status-pending px-3 py-2">
                <Trophy className="w-4 h-4 mr-1" />
                RANK #{Math.floor(Math.random() * 100) + 1}
              </Badge>
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="btn-secondary-cyan px-3 py-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats Card */}
            <Card className="window-card p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary border-2 border-foreground rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-foreground">
                    {user.username?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">{user.username || 'Clipper'}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Earned</span>
                  <span className="text-status-approved font-bold">${totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Submissions</span>
                  <span className="font-bold">{totalSubmissions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Approved</span>
                  <span className="text-status-approved font-bold">{approvedSubmissions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending</span>
                  <span className="text-status-pending font-bold">{pendingSubmissions}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="window-card p-6">
              <h3 className="text-retro-display mb-4">QUICK ACTIONS</h3>
              <div className="space-y-2">
                <Button className="w-full btn-primary py-2" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  VIEW ANALYTICS
                </Button>
                <Button className="w-full btn-secondary-cyan py-2" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  LEADERBOARDS
                </Button>
                <Button className="w-full btn-secondary-cyan py-2" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  SETTINGS
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-card border-2 border-foreground">
                <TabsTrigger 
                  value="bounties" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-retro-display text-sm"
                >
                  BOUNTIES
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-retro-display text-sm"
                >
                  MY SUBMISSIONS
                </TabsTrigger>
                <TabsTrigger 
                  value="featured" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-retro-display text-sm"
                >
                  FEATURED
                </TabsTrigger>
              </TabsList>

              {/* Bounties Tab */}
              <TabsContent value="bounties" className="space-y-6">
                {/* Featured Campaign Banner */}
                <Card className="window-card overflow-hidden">
                  <div className="relative bg-gradient-to-r from-primary to-secondary p-8">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <Badge className="bg-black/20 text-white border-white/30">
                            <Flame className="w-3 h-3 mr-1" />
                            FEATURED CAMPAIGN
                          </Badge>
                          <Badge className="bg-black/20 text-white border-white/30">
                            <Zap className="w-3 h-3 mr-1" />
                            ENDING SOON
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          SUMMER GAMING COMPILATION - $2,500 PRIZE POOL
                        </h2>
                        <p className="text-white/90 mb-4 max-w-2xl">
                          Epic gaming moments wanted! Submit your best clutch plays, rage moments, and viral gaming clips. 
                          Top 10 submissions share the massive prize pool.
                        </p>
                        <div className="flex items-center space-x-6 text-white/90 text-sm">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            $2,500 Prize Pool
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            247 Submissions
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            3 Days Left
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-8">
                        <Button className="bg-white text-foreground hover:bg-white/90 font-bold px-8 py-3">
                          SUBMIT NOW
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bounties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 input-retro"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSelectedFilter('all')}
                      variant={selectedFilter === 'all' ? 'default' : 'outline'}
                      className={selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary-cyan'}
                      size="sm"
                    >
                      ALL
                    </Button>
                    <Button
                      onClick={() => setSelectedFilter('hot')}
                      variant={selectedFilter === 'hot' ? 'default' : 'outline'}
                      className={selectedFilter === 'hot' ? 'btn-secondary-pink' : 'btn-secondary-cyan'}
                      size="sm"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Button>
                    <Button
                      onClick={() => setSelectedFilter('new')}
                      variant={selectedFilter === 'new' ? 'default' : 'outline'}
                      className={selectedFilter === 'new' ? 'btn-primary' : 'btn-secondary-cyan'}
                      size="sm"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      NEW
                    </Button>
                  </div>
                </div>

                {/* Bounties List */}
                <div className="space-y-6">
                  {filteredBounties.length === 0 ? (
                    <Card className="window-card p-12 text-center">
                      <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bounties found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </Card>
                  ) : (
                    filteredBounties.map((bounty) => (
                      <BountyCard
                        key={bounty.id}
                        bounty={bounty}
                        isExpanded={expandedBounties.has(bounty.id)}
                        onToggleExpanded={() => toggleBountyExpanded(bounty.id)}
                        onSubmitClip={() => handleSubmitClip(bounty)}
                        onViewCampaign={() => onViewCampaign(bounty)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-retro-display text-2xl mb-2">MY SUBMISSIONS</h2>
                    <p className="text-muted-foreground">Track your clip submissions and their status</p>
                  </div>
                  <Badge className="status-approved px-4 py-2">
                    {totalSubmissions} TOTAL SUBMISSIONS
                  </Badge>
                </div>

                {/* Submissions Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="window-card p-6 bg-status-pending/10 border-status-pending/30">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-8 h-8 text-status-pending" />
                      <div>
                        <div className="text-2xl font-bold text-status-pending">{pendingSubmissions}</div>
                        <div className="text-sm text-muted-foreground">PENDING REVIEW</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="window-card p-6 bg-status-approved/10 border-status-approved/30">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-status-approved" />
                      <div>
                        <div className="text-2xl font-bold text-status-approved">{approvedSubmissions}</div>
                        <div className="text-sm text-muted-foreground">APPROVED</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="window-card p-6 bg-status-rejected/10 border-status-rejected/30">
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-8 h-8 text-status-rejected" />
                      <div>
                        <div className="text-2xl font-bold text-status-rejected">
                          {userSubmissions.filter(s => s.status === 'rejected').length}
                        </div>
                        <div className="text-sm text-muted-foreground">REJECTED</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                  {userSubmissions.length === 0 ? (
                    <Card className="window-card p-12 text-center">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground mb-4">Start submitting clips to see them here</p>
                      <Button className="btn-primary">
                        BROWSE BOUNTIES
                      </Button>
                    </Card>
                  ) : (
                    userSubmissions.map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        bounty={bounties.find(b => b.id === submission.bountyId)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Featured Tab */}
              <TabsContent value="featured" className="space-y-6">
                <div>
                  <h2 className="text-retro-display text-2xl mb-2">FEATURED CLIPS</h2>
                  <p className="text-muted-foreground">Top performing clips from the community</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredClips.map((clip, index) => (
                    <Card key={index} className="window-card overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{clip.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{clip.creator}</span>
                          <span>{clip.views} views</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}