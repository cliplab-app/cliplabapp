'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Crown, 
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  Target,
  Star,
  Play,
  Download,
  Filter,
  RefreshCw,
  Youtube,
  Instagram,
  Twitter,
  Zap,
  MousePointer,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CreatorAnalyticsProps {
  user: any;
  onBack: () => void;
  embedded?: boolean;
}

export function CreatorAnalytics({ user, onBack, embedded = false }: CreatorAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const overviewStats = {
    totalViews: 15247892,
    totalRevenue: 8450.32,
    activeCampaigns: 12,
    avgCPM: 3.85,
    conversionRate: 4.7,
    qualityScore: 92
  };

  const platformPerformance = [
    {
      platform: 'YouTube Shorts',
      icon: Youtube,
      color: '#FF0000',
      views: 6273045,
      cpm: 4.50,
      revenue: 2822.70,
      qualityScore: 94,
      change: 15.2,
      campaigns: 4
    },
    {
      platform: 'TikTok', 
      icon: Play,
      color: '#000000',
      views: 4816159,
      cpm: 3.20,
      revenue: 1541.17,
      qualityScore: 89,
      change: -3.1,
      campaigns: 3
    },
    {
      platform: 'Instagram Reels',
      icon: Instagram,
      color: '#E4405F',
      views: 3546709,
      cpm: 5.10,
      revenue: 1808.82,
      qualityScore: 96,
      change: 8.7,
      campaigns: 3
    },
    {
      platform: 'X (Twitter)',
      icon: Twitter,
      color: '#1DA1F2',
      views: 611979,
      cpm: 6.80,
      revenue: 416.15,
      qualityScore: 87,
      change: 22.4,
      campaigns: 2
    }
  ];

  const viewsOverTime = [
    { date: 'Jan 1', youtube: 820000, tiktok: 650000, instagram: 480000, twitter: 95000 },
    { date: 'Jan 8', youtube: 890000, tiktok: 720000, instagram: 520000, twitter: 110000 },
    { date: 'Jan 15', youtube: 950000, tiktok: 680000, instagram: 580000, twitter: 125000 },
    { date: 'Jan 22', youtube: 1050000, tiktok: 750000, instagram: 610000, twitter: 140000 },
    { date: 'Jan 29', youtube: 1150000, tiktok: 820000, instagram: 680000, twitter: 165000 },
    { date: 'Feb 5', youtube: 1200000, tiktok: 890000, instagram: 720000, twitter: 180000 },
    { date: 'Feb 12', youtube: 1320000, tiktok: 960000, instagram: 780000, twitter: 195000 }
  ];

  const revenueBreakdown = [
    { name: 'YouTube Shorts', value: 2822.70, color: '#FF0000' },
    { name: 'Instagram Reels', value: 1808.82, color: '#E4405F' },
    { name: 'TikTok', value: 1541.17, color: '#000000' },
    { name: 'X (Twitter)', value: 416.15, color: '#1DA1F2' }
  ];

  const topCampaigns = [
    {
      id: '1',
      title: 'Gaming Rage Compilation - High Payout',
      platform: 'YouTube Shorts',
      views: 2140000,
      revenue: 1284.50,
      cpm: 6.00,
      submissions: 47,
      qualityScore: 96,
      status: 'active'
    },
    {
      id: '2',
      title: 'Cooking Disaster Compilation',
      platform: 'Instagram Reels',
      views: 1850000,
      revenue: 944.00,
      cpm: 5.10,
      submissions: 31,
      qualityScore: 94,
      status: 'active'
    },
    {
      id: '3',
      title: 'Viral Dance Trends - Trending Now',
      platform: 'TikTok',
      views: 1620000,
      revenue: 518.40,
      cpm: 3.20,
      submissions: 28,
      qualityScore: 91,
      status: 'active'
    },
    {
      id: '4',
      title: 'Podcast Golden Moments',
      platform: 'X (Twitter)',
      views: 450000,
      revenue: 306.00,
      cpm: 6.80,
      submissions: 19,
      qualityScore: 88,
      status: 'completed'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={embedded ? "h-full bg-background" : "min-h-screen bg-background grid-bg"}>
      {/* Header - only show when not embedded */}
      {!embedded && (
        <header className="bg-nav-yellow border-b-2 border-foreground">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Back Button */}
            <Button
              onClick={onBack}
              variant="outline"
              className="btn-secondary-cyan text-sm px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO DASHBOARD
            </Button>

            {/* Center Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary border-2 border-foreground flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-retro-display text-sm">CLIPLAB</h1>
                <p className="text-xs">Creator Analytics</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-28 input-retro text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="btn-secondary-cyan text-xs px-3"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                REFRESH
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-6 ${embedded ? 'h-full overflow-y-auto' : ''}`}>
        {/* Header controls for embedded mode */}
        {embedded && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-retro-display text-2xl mb-2">CREATOR ANALYTICS</h1>
              <p className="text-muted-foreground">
                Deep insights into your campaign performance and revenue optimization
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-28 input-retro text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="btn-secondary-cyan text-xs px-3"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                REFRESH
              </Button>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Page Title - only show when not embedded */}
          {!embedded && (
            <div>
              <h1 className="text-retro-display text-3xl mb-2">CREATOR ANALYTICS</h1>
              <p className="text-muted-foreground">
                Deep insights into your campaign performance and revenue optimization
              </p>
            </div>
          )}

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="window-card p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-retro-display text-lg">{formatNumber(overviewStats.totalViews)}</div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </Card>
            
            <Card className="window-card p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-status-approved" />
              <div className="text-retro-display text-lg">{formatCurrency(overviewStats.totalRevenue)}</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </Card>
            
            <Card className="window-card p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-retro-display text-lg">{overviewStats.activeCampaigns}</div>
              <div className="text-xs text-muted-foreground">Active Campaigns</div>
            </Card>
            
            <Card className="window-card p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-status-pending" />
              <div className="text-retro-display text-lg">${overviewStats.avgCPM}</div>
              <div className="text-xs text-muted-foreground">Avg CPM</div>
            </Card>
            
            <Card className="window-card p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary-alt" />
              <div className="text-retro-display text-lg">{overviewStats.conversionRate}%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </Card>
            
            <Card className="window-card p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-status-winner-1st" />
              <div className="text-retro-display text-lg">{overviewStats.qualityScore}</div>
              <div className="text-xs text-muted-foreground">Quality Score</div>
            </Card>
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-background-secondary border-2 border-foreground">
              <TabsTrigger value="performance" className="nav-tab">PERFORMANCE</TabsTrigger>
              <TabsTrigger value="revenue" className="nav-tab">REVENUE</TabsTrigger>
              <TabsTrigger value="campaigns" className="nav-tab">CAMPAIGNS</TabsTrigger>
              <TabsTrigger value="insights" className="nav-tab">INSIGHTS</TabsTrigger>
            </TabsList>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Platform Performance */}
                <Card className="window-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-retro-display text-lg">PLATFORM PERFORMANCE</h3>
                    <Badge className="status-approved">LAST 7 DAYS</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {platformPerformance.map((platform, index) => (
                      <div key={platform.platform} className="p-4 bg-background-secondary rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: platform.color }}>
                              <platform.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-retro-display text-sm">{platform.platform}</h4>
                              <p className="text-xs text-muted-foreground">{platform.campaigns} campaigns</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {platform.change > 0 ? (
                              <ArrowUpRight className="w-4 h-4 text-status-approved" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-status-rejected" />
                            )}
                            <span className={`text-xs ${platform.change > 0 ? 'text-status-approved' : 'text-status-rejected'}`}>
                              {platform.change > 0 ? '+' : ''}{platform.change}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-retro-display text-sm">{formatNumber(platform.views)}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-retro-display text-sm">${platform.cpm}</p>
                            <p className="text-xs text-muted-foreground">CPM</p>
                          </div>
                          <div>
                            <p className="text-retro-display text-sm">{platform.qualityScore}</p>
                            <p className="text-xs text-muted-foreground">Quality</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Views Over Time Chart */}
                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-lg mb-6">VIEWS OVER TIME</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          border: 'var(--window-border)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="youtube" stackId="1" stroke="#FF0000" fill="#FF0000" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="instagram" stackId="1" stroke="#E4405F" fill="#E4405F" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="tiktok" stackId="1" stroke="#000000" fill="#000000" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="twitter" stackId="1" stroke="#1DA1F2" fill="#1DA1F2" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Breakdown */}
                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-lg mb-6">REVENUE BREAKDOWN</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      >
                        {revenueBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Revenue Metrics */}
                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-lg mb-6">REVENUE METRICS</h3>
                  <div className="space-y-6">
                    {platformPerformance.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: platform.color }}></div>
                          <span className="text-sm">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-retro-display text-sm">{formatCurrency(platform.revenue)}</p>
                          <p className="text-xs text-muted-foreground">${platform.cpm} CPM</p>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-retro-display text-sm">TOTAL REVENUE</span>
                      <span className="text-retro-display text-lg">{formatCurrency(overviewStats.totalRevenue)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <Card className="window-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-retro-display text-lg">TOP PERFORMING CAMPAIGNS</h3>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="w-32 input-retro text-xs">
                        <Filter className="w-3 h-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {topCampaigns.map((campaign, index) => (
                    <div key={campaign.id} className="p-4 bg-background-secondary rounded-lg border hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-sm text-foreground">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="text-retro-display text-sm">{campaign.title}</h4>
                            <p className="text-xs text-muted-foreground">{campaign.platform}</p>
                          </div>
                        </div>
                        
                        <Badge className={campaign.status === 'active' ? 'status-approved' : 'status-pending'}>
                          {campaign.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-retro-display text-sm">{formatNumber(campaign.views)}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div>
                          <p className="text-retro-display text-sm">{formatCurrency(campaign.revenue)}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div>
                          <p className="text-retro-display text-sm">${campaign.cpm}</p>
                          <p className="text-xs text-muted-foreground">CPM</p>
                        </div>
                        <div>
                          <p className="text-retro-display text-sm">{campaign.submissions}</p>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                        <div>
                          <p className="text-retro-display text-sm">{campaign.qualityScore}</p>
                          <p className="text-xs text-muted-foreground">Quality</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Key Insights */}
                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-lg mb-6">KEY INSIGHTS</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-status-approved/10 rounded-lg border border-status-approved/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-status-approved" />
                        <span className="text-retro-display text-sm">Top Performer</span>
                      </div>
                      <p className="text-sm">YouTube Shorts campaigns show 15.2% growth with the highest quality scores (94 avg).</p>
                    </div>
                    
                    <div className="p-4 bg-status-pending/10 rounded-lg border border-status-pending/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-status-pending" />
                        <span className="text-retro-display text-sm">Optimization Opportunity</span>
                      </div>
                      <p className="text-sm">TikTok campaigns have room for improvement - consider adjusting content requirements.</p>
                    </div>
                    
                    <div className="p-4 bg-secondary-alt/10 rounded-lg border border-secondary-alt/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-secondary-alt" />
                        <span className="text-retro-display text-sm">Quality Focus</span>
                      </div>
                      <p className="text-sm">Your overall quality score of 92 is excellent - maintain high content standards.</p>
                    </div>
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-lg mb-6">RECOMMENDATIONS</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-background-secondary rounded-lg border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-retro-display text-sm">Scale YouTube Shorts</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Your YouTube campaigns are performing exceptionally well. Consider increasing budget allocation.</p>
                    </div>
                    
                    <div className="p-4 bg-background-secondary rounded-lg border">
                      <div className="flex items-center space-x-2 mb-2">
                        <MousePointer className="w-4 h-4 text-secondary" />
                        <span className="text-retro-display text-sm">Improve TikTok CPM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Adjust TikTok campaign requirements to boost quality scores and CPM rates.</p>
                    </div>
                    
                    <div className="p-4 bg-background-secondary rounded-lg border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-status-pending" />
                        <span className="text-retro-display text-sm">Optimal Timing</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Launch campaigns on Mondays for 12% higher engagement rates.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Export Actions */}
          <Card className="window-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-retro-display text-lg mb-1">EXPORT ANALYTICS</h3>
                <p className="text-sm text-muted-foreground">Download detailed reports for external analysis</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="btn-secondary-cyan">
                  <Download className="w-4 h-4 mr-2" />
                  EXPORT CSV
                </Button>
                <Button className="btn-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  GENERATE REPORT
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}