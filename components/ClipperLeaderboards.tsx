'use client';

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Crown, 
  Star, 
  Flame, 
  TrendingUp, 
  DollarSign,
  Target,
  Calendar,
  Users,
  Award,
  ChevronUp,
  ChevronDown,
  Minus,
  Eye,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { User, TopCreator, Bounty } from '../App';

interface ClipperLeaderboardsProps {
  user: User;
  topCreators: TopCreator[];
  bounties: Bounty[];
}

export function ClipperLeaderboards({ user, topCreators, bounties }: ClipperLeaderboardsProps) {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  // Generate a comprehensive leaderboard that includes the user
  const generateFullLeaderboardData = (period: string) => {
    const multiplier = period === 'daily' ? 0.1 : period === 'weekly' ? 0.5 : 1;
    
    // Calculate user earnings first so it's available throughout the function
    const userEarnings = Math.floor((user.totalEarnings || 2500) * multiplier * (Math.random() * 0.4 + 0.8));
    
    // Start with existing top creators
    let leaderboardData = topCreators.map((creator, index) => ({
      ...creator,
      earnings: Math.floor(creator.totalEarnings * multiplier * (Math.random() * 0.4 + 0.8)),
      submissions: Math.floor(Math.random() * 15 + 5) * (period === 'daily' ? 1 : period === 'weekly' ? 3 : 10),
      winRate: Math.floor(Math.random() * 30 + 50),
      rankChange: index < 2 ? 0 : Math.floor(Math.random() * 5) - 2,
      avgViews: Math.floor(Math.random() * 500000 + 100000),
      isCurrentUser: creator.username === user.username
    }));

    // Check if current user is already in the list
    const userExists = leaderboardData.some(creator => creator.username === user.username);
    
    if (!userExists) {
      // Add current user with their actual stats but adjusted for timeframe
      leaderboardData.push({
        id: user.id,
        username: user.username,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=100&h=100&fit=crop&crop=faces`,
        totalEarnings: user.totalEarnings || 2500,
        level: user.level || 15,
        streak: user.streak || 3,
        clipsCreated: Math.floor(Math.random() * 50 + 20),
        rank: 0, // Will be calculated after sorting
        status: 'Active' as const,
        earnings: userEarnings,
        submissions: Math.floor(Math.random() * 10 + 3) * (period === 'daily' ? 1 : period === 'weekly' ? 2 : 8),
        winRate: Math.floor(Math.random() * 25 + 35),
        rankChange: Math.floor(Math.random() * 5) - 2,
        avgViews: Math.floor(Math.random() * 300000 + 50000),
        isCurrentUser: true
      });
    } else {
      // Mark existing user as current user
      leaderboardData = leaderboardData.map(creator => ({
        ...creator,
        isCurrentUser: creator.username === user.username
      }));
    }

    // Add some additional mock users to create a more realistic leaderboard
    const additionalUsers = [
      'SpeedClipper', 'ContentCrusher', 'ViralVault', 'ClipGenius', 'FastCuts', 
      'ReelRush', 'QuickEdit', 'ContentCrafter', 'ViralMachine', 'ClipWizard',
      'EditMaster', 'ContentKiller', 'ViralHunter', 'ClipNinja', 'FastTracker',
      'ReelMaker', 'ContentForge', 'ViralSeeker', 'ClipForce', 'EditExpress',
      'ContentBolt', 'ViralStorm', 'ClipRocket', 'FastForward', 'ReelRapid'
    ];

    additionalUsers.forEach((username, index) => {
      if (leaderboardData.length < 30) { // Limit to reasonable size
        const earnings = Math.floor(Math.random() * userEarnings * 0.8 + userEarnings * 0.2);
        leaderboardData.push({
          id: `mock-${index}`,
          username,
          avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=100&h=100&fit=crop&crop=faces`,
          totalEarnings: Math.floor(earnings / multiplier),
          level: Math.floor(Math.random() * 25 + 10),
          streak: Math.floor(Math.random() * 15 + 1),
          clipsCreated: Math.floor(Math.random() * 80 + 15),
          rank: 0,
          status: ['Active', 'Hot Streak', 'Elite'][Math.floor(Math.random() * 3)] as const,
          earnings,
          submissions: Math.floor(Math.random() * 8 + 2) * (period === 'daily' ? 1 : period === 'weekly' ? 2 : 6),
          winRate: Math.floor(Math.random() * 30 + 25),
          rankChange: Math.floor(Math.random() * 5) - 2,
          avgViews: Math.floor(Math.random() * 250000 + 30000),
          isCurrentUser: false
        });
      }
    });

    // Sort by earnings and assign ranks
    const sortedData = leaderboardData.sort((a, b) => b.earnings - a.earnings);
    return sortedData.map((creator, index) => ({
      ...creator,
      rank: index + 1
    }));
  };

  const dailyLeaderboard = generateFullLeaderboardData('daily');
  const weeklyLeaderboard = generateFullLeaderboardData('weekly');
  const monthlyLeaderboard = generateFullLeaderboardData('monthly');

  const currentLeaderboard = 
    timeFrame === 'daily' ? dailyLeaderboard :
    timeFrame === 'weekly' ? weeklyLeaderboard :
    monthlyLeaderboard;

  // Find current user in leaderboard
  const currentUser = currentLeaderboard.find(creator => creator.isCurrentUser);
  const currentUserRank = currentUser?.rank || currentLeaderboard.length;
  const isUserInTop10 = currentUserRank <= 10;

  // Get leaderboard to display
  const displayLeaderboard = showFullLeaderboard ? currentLeaderboard : currentLeaderboard.slice(0, 10);

  // Mock top bounties data
  const topBounties = bounties
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(bounty => ({
      ...bounty,
      submissions: Math.floor(Math.random() * 25 + 5),
      avgViews: Math.floor(Math.random() * 1000000 + 200000)
    }));

  // Mock top creators by category
  const topCreatorsByCategory = [
    { name: 'Gaming', leader: topCreators[0], earnings: 4200, color: 'purple' },
    { name: 'Comedy', leader: topCreators[1], earnings: 3800, color: 'pink' },
    { name: 'Music', leader: topCreators[2], earnings: 3600, color: 'green' },
    { name: 'Tutorial', leader: topCreators[3], earnings: 3200, color: 'blue' },
    { name: 'Podcast', leader: topCreators[4], earnings: 2900, color: 'orange' }
  ];

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-status-approved" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-retro-display text-3xl mb-2">LEADERBOARDS</h1>
          <p className="text-muted-foreground">See how you stack up against the top performers</p>
        </div>
      </div>

      {/* User Position Highlight */}
      {currentUser && (
        <div className="window-card p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  #{currentUserRank}
                </div>
                <div>
                  <div className="text-retro-display text-lg text-primary">YOUR POSITION</div>
                  <div className="text-sm text-muted-foreground">
                    {currentUserRank}{getRankSuffix(currentUserRank)} out of {currentLeaderboard.length} clippers
                  </div>
                </div>
              </div>
              
              <img 
                src={currentUser.avatar} 
                alt={currentUser.username}
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
              
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-retro-display">{currentUser.username}</h4>
                  <Badge className="status-approved text-xs">YOU</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Level {currentUser.level} • {currentUser.streak} day streak
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-status-approved">
                ${currentUser.earnings.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentUser.submissions} submissions • {currentUser.winRate}% win rate
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg: {(currentUser.avgViews / 1000000).toFixed(1)}M views
              </div>
            </div>
          </div>
          
          {!isUserInTop10 && (
            <div className="mt-4 pt-4 border-t border-primary/20">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="w-4 h-4 text-status-approved" />
                  <span>Need ${((displayLeaderboard[9]?.earnings || 0) - currentUser.earnings).toLocaleString()} more to reach top 10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Time Frame Selector */}
      <div className="window-card p-6">
        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as 'daily' | 'weekly' | 'monthly')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="text-retro-nav">
              <Calendar className="w-4 h-4 mr-2" />
              DAILY
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-retro-nav">
              <Calendar className="w-4 h-4 mr-2" />
              WEEKLY
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-retro-nav">
              <Calendar className="w-4 h-4 mr-2" />
              MONTHLY
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeFrame} className="space-y-6">
            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentLeaderboard.slice(0, 3).map((creator, index) => (
                <Card key={creator.id} className={`window-card text-center p-6 relative overflow-hidden ${
                  creator.isCurrentUser ? 'bg-primary/10 border-primary/30 shadow-glow' : ''
                } ${
                  index === 0 ? 'bg-primary-cobalt text-white shadow-glow' : 
                  index === 1 ? 'bg-vibrant-purple/10 border-vibrant-purple/30' :
                  'bg-vibrant-orange/10 border-vibrant-orange/30'
                }`}>
                  <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    index === 0 ? 'bg-white text-vibrant-blue' :
                    index === 1 ? 'bg-vibrant-purple text-white' :
                    'bg-vibrant-orange text-white'
                  }`}>
                    {index + 1}
                  </div>

                  {creator.isCurrentUser && (
                    <div className="absolute -top-1 -left-1">
                      <Badge className="status-approved text-xs">YOU</Badge>
                    </div>
                  )}

                  <img 
                    src={creator.avatar} 
                    alt={creator.username}
                    className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-current/20"
                  />
                  
                  <Badge className={`mb-3 ${
                    creator.status === 'Legend' ? 'bg-vibrant-yellow/20 text-vibrant-yellow border-vibrant-yellow/30' :
                    creator.status === 'Elite' ? 'bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30' :
                    creator.status === 'Hot Streak' ? 'bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30' :
                    'bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30'
                  }`}>
                    {creator.status === 'Legend' && <Crown className="w-3 h-3 mr-1" />}
                    {creator.status === 'Hot Streak' && <Flame className="w-3 h-3 mr-1" />}
                    {creator.status === 'Elite' && <Star className="w-3 h-3 mr-1" />}
                    {creator.status}
                  </Badge>
                  
                  <h3 className="text-lg mb-3">{creator.username}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="text-2xl font-bold text-status-approved">
                      ${creator.earnings.toLocaleString()}
                    </div>
                    <div className={index === 0 ? 'text-white/80' : 'text-muted-foreground'}>
                      {creator.submissions} submissions • {creator.winRate}% win rate
                    </div>
                    <div className={index === 0 ? 'text-white/60' : 'text-muted-foreground'}>
                      Avg: {(creator.avgViews / 1000000).toFixed(1)}M views
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="window-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-retro-display text-lg">
                  {timeFrame.toUpperCase()} CLIPPER RANKINGS
                </h3>
                <div className="flex items-center space-x-4">
                  <Badge className="status-approved">
                    {currentLeaderboard.length} Active Clippers
                  </Badge>
                  {!showFullLeaderboard && currentLeaderboard.length > 10 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowFullLeaderboard(true)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      SHOW ALL {currentLeaderboard.length}
                    </Button>
                  )}
                  {showFullLeaderboard && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowFullLeaderboard(false)}
                      className="text-xs"
                    >
                      SHOW TOP 10
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {displayLeaderboard.map((creator, index) => (
                  <div key={creator.id} className={`window-card p-4 transition-all duration-200 ${
                    creator.isCurrentUser 
                      ? 'bg-primary/10 border-primary/30 shadow-glow transform scale-[1.02]' 
                      : 'bg-background hover:bg-background-secondary'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            creator.rank <= 3 ? 'bg-status-winner-1st text-foreground' : 
                            creator.isCurrentUser ? 'bg-primary text-primary-foreground' :
                            'bg-muted text-foreground'
                          }`}>
                            {creator.rank}
                          </div>
                          {getRankChangeIcon(creator.rankChange)}
                        </div>
                        
                        <img 
                          src={creator.avatar} 
                          alt={creator.username}
                          className={`w-12 h-12 rounded-full border-2 ${
                            creator.isCurrentUser ? 'border-primary' : 'border-foreground'
                          }`}
                        />
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-retro-display ${
                              creator.isCurrentUser ? 'text-primary' : ''
                            }`}>
                              {creator.username}
                            </h4>
                            {creator.isCurrentUser && (
                              <Badge className="status-approved text-xs">YOU</Badge>
                            )}
                            {creator.rank <= 3 && !creator.isCurrentUser && (
                              <Trophy className="w-4 h-4 text-status-winner-1st" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Level {creator.level} • {creator.streak} day streak
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-status-approved">
                          ${creator.earnings.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {creator.submissions} subs • {creator.winRate}% win
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(creator.avgViews / 1000000).toFixed(1)}M avg views
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show user position if not in current view */}
              {!showFullLeaderboard && !isUserInTop10 && currentUser && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-center text-sm text-muted-foreground mb-3">
                    <ArrowDown className="w-4 h-4 inline mr-1" />
                    {currentUserRank - 10} more positions to your rank
                  </div>
                  <div className="window-card p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {currentUserRank}
                          </div>
                          {getRankChangeIcon(currentUser.rankChange)}
                        </div>
                        
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.username}
                          className="w-12 h-12 rounded-full border-2 border-primary"
                        />
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-retro-display text-primary">{currentUser.username}</h4>
                            <Badge className="status-approved text-xs">YOU</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Level {currentUser.level} • {currentUser.streak} day streak
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-status-approved">
                          ${currentUser.earnings.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {currentUser.submissions} subs • {currentUser.winRate}% win
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(currentUser.avgViews / 1000000).toFixed(1)}M avg views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Additional Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Bounties */}
        <div className="window-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-retro-display text-lg">TOP BOUNTIES THIS WEEK</h3>
          </div>
          
          <div className="space-y-4">
            {topBounties.map((bounty, index) => (
              <div key={bounty.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border border-muted">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary text-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium line-clamp-1">{bounty.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      {bounty.submissions} submissions • Avg {(bounty.avgViews / 1000000).toFixed(1)}M views
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-status-approved">${bounty.amount}</div>
                  <div className="text-xs text-muted-foreground">
                    {bounty.campaignMode?.toUpperCase() || 'CAMPAIGN'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Leaders */}
        <div className="window-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-5 h-5 text-secondary" />
            <h3 className="text-retro-display text-lg">CATEGORY LEADERS</h3>
          </div>
          
          <div className="space-y-4">
            {topCreatorsByCategory.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border border-muted">
                <div className="flex items-center space-x-3">
                  <span className={`hashtag-${category.name.toLowerCase()} px-2 py-1 text-xs`}>
                    {category.name.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={category.leader.avatar} 
                      alt={category.leader.username}
                      className="w-8 h-8 rounded-full border border-foreground"
                    />
                    <div>
                      <h4 className="text-sm font-medium">{category.leader.username}</h4>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-status-approved">${category.earnings}</div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}