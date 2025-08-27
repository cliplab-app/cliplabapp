'use client';

import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Trophy, 
  DollarSign, 
  Eye, 
  ThumbsUp, 
  MessageSquare,
  Calendar,
  Star,
  Award,
  Target,
  Zap,
  Youtube,
  Facebook,
  Instagram,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Users,
  Flame
} from 'lucide-react';
import { User, Submission, TopCreator, Bounty } from '../App';

interface ClipperAnalyticsProps {
  user: User;
  userSubmissions: Submission[];
  topCreators: TopCreator[];
  bounties: Bounty[];
}

export function ClipperAnalytics({ user, userSubmissions, topCreators, bounties }: ClipperAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const timeframes = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };

    const timeframePeriod = timeframes[selectedTimeframe];
    const startDate = new Date(now.getTime() - timeframePeriod);

    // Filter submissions by timeframe
    const timeframeSubmissions = userSubmissions.filter(sub => 
      sub.submittedAt >= startDate
    );

    // Calculate earnings
    const totalEarnings = timeframeSubmissions.reduce((sum, sub) => {
      if (sub.status.includes('winner')) {
        if (sub.status === 'winner-1st') return sum + 500; // Mock payout
        if (sub.status === 'winner-2nd') return sum + 300;
        if (sub.status === 'winner-3rd') return sum + 200;
      }
      return sum;
    }, 0);

    // Calculate total views, likes, comments
    const totalViews = timeframeSubmissions.reduce((sum, sub) => 
      sum + (sub.youtubeData?.views || 0), 0
    );
    const totalLikes = timeframeSubmissions.reduce((sum, sub) => 
      sum + (sub.youtubeData?.likes || 0), 0
    );
    const totalComments = timeframeSubmissions.reduce((sum, sub) => 
      sum + (sub.youtubeData?.comments || 0), 0
    );

    // Calculate success rate
    const winningSubmissions = timeframeSubmissions.filter(sub => 
      sub.status.includes('winner') || sub.status === 'approved'
    );
    const successRate = timeframeSubmissions.length > 0 
      ? (winningSubmissions.length / timeframeSubmissions.length) * 100 
      : 0;

    // Find user's rank
    const userRank = topCreators.findIndex(creator => 
      creator.username === user.username
    ) + 1;

    return {
      earnings: totalEarnings,
      submissions: timeframeSubmissions.length,
      views: totalViews,
      likes: totalLikes,
      comments: totalComments,
      successRate,
      userRank: userRank || Math.floor(Math.random() * 50) + 1,
      avgEarningsPerClip: timeframeSubmissions.length > 0 ? totalEarnings / timeframeSubmissions.length : 0,
      topPerformingSubmissions: timeframeSubmissions
        .sort((a, b) => (b.youtubeData?.views || 0) - (a.youtubeData?.views || 0))
        .slice(0, 5)
    };
  }, [userSubmissions, selectedTimeframe, topCreators, user.username]);

  // Mock channel performance data
  const channelPerformance = [
    {
      platform: 'YouTube',
      icon: Youtube,
      clips: 12,
      views: '2.4M',
      earnings: 1240,
      growth: '+15%',
      color: 'text-red-500'
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      clips: 8,
      views: '890K',
      earnings: 680,
      growth: '+8%',
      color: 'text-blue-500'
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      clips: 5,
      views: '1.1M',
      earnings: 420,
      growth: '+22%',
      color: 'text-pink-500'
    }
  ];

  // Mock category performance
  const categoryPerformance = [
    { category: 'Gaming', earnings: 850, clips: 8, avgViews: '420K', growth: '+12%' },
    { category: 'Comedy', earnings: 620, clips: 6, avgViews: '380K', growth: '+8%' },
    { category: 'Music', earnings: 480, clips: 4, avgViews: '290K', growth: '+15%' },
    { category: 'Sports', earnings: 390, clips: 3, avgViews: '310K', growth: '+5%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-retro-display text-3xl mb-2">PERSONAL ANALYTICS</h1>
          <p className="text-muted-foreground">Deep dive into your ClipLab performance metrics</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              className={selectedTimeframe === timeframe ? 'btn-primary' : 'hover:btn-secondary-cyan'}
              size="sm"
            >
              {timeframe === '7d' ? '7 DAYS' : 
               timeframe === '30d' ? '30 DAYS' : 
               timeframe === '90d' ? '90 DAYS' : '1 YEAR'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="window-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-status-approved rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TOTAL EARNINGS</p>
              <p className="text-2xl font-bold">${analyticsData.earnings.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-status-approved mr-1" />
            <span className="text-status-approved">+12% vs last period</span>
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LEADERBOARD RANK</p>
              <p className="text-2xl font-bold">#{analyticsData.userRank}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-status-approved mr-1" />
            <span className="text-status-approved">+3 positions</span>
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TOTAL VIEWS</p>
              <p className="text-2xl font-bold">{(analyticsData.views / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-status-approved mr-1" />
            <span className="text-status-approved">+18% vs last period</span>
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-secondary-alt rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SUCCESS RATE</p>
              <p className="text-2xl font-bold">{analyticsData.successRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-status-approved mr-1" />
            <span className="text-status-approved">+5% vs last period</span>
          </div>
        </Card>
      </div>

      {/* Performance Charts & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card className="window-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-retro-display text-lg">EARNINGS TREND</h3>
            <Badge className="status-approved">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% GROWTH
            </Badge>
          </div>
          <div className="space-y-4">
            {/* Mock chart data */}
            <div className="flex items-end space-x-2 h-32">
              {[420, 580, 340, 750, 920, 680, 840].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t-sm"
                    style={{ height: `${(value / 1000) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">${analyticsData.avgEarningsPerClip.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">AVG PER CLIP</p>
              </div>
              <div>
                <p className="text-lg font-bold">{analyticsData.submissions}</p>
                <p className="text-xs text-muted-foreground">CLIPS SUBMITTED</p>
              </div>
              <div>
                <p className="text-lg font-bold">89%</p>
                <p className="text-xs text-muted-foreground">WIN RATE</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Platform Performance */}
        <Card className="window-card p-6">
          <h3 className="text-retro-display text-lg mb-6">PLATFORM PERFORMANCE</h3>
          <div className="space-y-4">
            {channelPerformance.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.platform} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${platform.color}`} />
                    <div>
                      <p className="font-semibold">{platform.platform}</p>
                      <p className="text-sm text-muted-foreground">{platform.clips} clips • {platform.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${platform.earnings}</p>
                    <p className="text-sm text-status-approved">{platform.growth}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Category Performance & Top Clips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <Card className="window-card p-6">
          <h3 className="text-retro-display text-lg mb-6">CATEGORY BREAKDOWN</h3>
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{category.category}</span>
                  <span className="text-sm text-status-approved">{category.growth}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{category.clips} clips</span>
                  <span>{category.avgViews} avg views</span>
                  <span className="font-bold text-foreground">${category.earnings}</span>
                </div>
                <Progress value={(category.earnings / 1000) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Clips */}
        <Card className="window-card p-6">
          <h3 className="text-retro-display text-lg mb-6">TOP PERFORMING CLIPS</h3>
          <div className="space-y-4">
            {analyticsData.topPerformingSubmissions.slice(0, 5).map((submission, index) => (
              <div key={submission.id} className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
                <div className="flex-shrink-0">
                  <Badge className={
                    index === 0 ? 'status-winner-1st' :
                    index === 1 ? 'status-winner-2nd' :
                    index === 2 ? 'status-winner-3rd' :
                    'status-approved'
                  }>
                    #{index + 1}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{submission.youtubeData?.title || submission.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {(submission.youtubeData?.views || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {(submission.youtubeData?.likes || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {submission.status.includes('winner') && (
                    <Badge className="status-approved text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      VIRAL
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leaderboard Position & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Leaderboard Position */}
        <Card className="window-card p-6">
          <h3 className="text-retro-display text-lg mb-6">LEADERBOARD POSITION</h3>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">#{analyticsData.userRank}</span>
            </div>
            <p className="text-sm text-muted-foreground">OUT OF 1,247 CLIPPERS</p>
          </div>
          
          <div className="space-y-3">
            {/* Show nearby rankings */}
            {topCreators.slice(Math.max(0, analyticsData.userRank - 2), analyticsData.userRank + 2).map((creator, index) => {
              const actualRank = Math.max(0, analyticsData.userRank - 2) + index + 1;
              const isCurrentUser = creator.username === user.username;
              
              return (
                <div key={creator.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentUser ? 'bg-primary/20 border border-primary' : 'bg-background-secondary'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center font-bold">#{actualRank}</span>
                    <span className={isCurrentUser ? 'font-bold' : ''}>{creator.username}</span>
                  </div>
                  <span className="font-bold">${creator.totalEarnings.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="window-card p-6">
          <h3 className="text-retro-display text-lg mb-6">RECENT ACHIEVEMENTS</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-status-approved/10 border border-status-approved/30 rounded-lg">
              <Star className="w-8 h-8 text-status-approved" />
              <div>
                <p className="font-semibold">First Viral Hit!</p>
                <p className="text-sm text-muted-foreground">Your clip reached 1M+ views</p>
              </div>
              <Badge className="status-approved ml-auto">NEW</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
              <Award className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold">Top 50 Clipper</p>
                <p className="text-sm text-muted-foreground">Ranked in top 50 globally</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">Speed Demon</p>
                <p className="text-sm text-muted-foreground">5 clips submitted in one day</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-secondary-alt/10 border border-secondary-alt/30 rounded-lg">
              <Users className="w-8 h-8 text-secondary-alt" />
              <div>
                <p className="font-semibold">Community Favorite</p>
                <p className="text-sm text-muted-foreground">100K+ combined likes</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals & Recommendations */}
      <Card className="window-card p-6">
        <h3 className="text-retro-display text-lg mb-6">PERFORMANCE INSIGHTS & GOALS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-foreground" />
            </div>
            <h4 className="font-semibold mb-2">Next Goal: Top 25</h4>
            <p className="text-sm text-muted-foreground mb-3">You need $2,340 more earnings to reach top 25</p>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">78% complete</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Focus on Gaming</h4>
            <p className="text-sm text-muted-foreground mb-3">Your gaming clips perform 23% better than average</p>
            <Badge className="status-approved">RECOMMENDED</Badge>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-alt rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-foreground" />
            </div>
            <h4 className="font-semibold mb-2">Consistency Bonus</h4>
            <p className="text-sm text-muted-foreground mb-3">Submit 3 more clips this week for 15% bonus</p>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">3/5 clips</p>
          </div>
        </div>
      </Card>
    </div>
  );
}