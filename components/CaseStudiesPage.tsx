'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Crown,
  TrendingUp,
  Eye,
  DollarSign,
  Users,
  Target,
  Play,
  Award,
  Zap,
  Music,
  Youtube,
  Instagram,
  Twitter,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle,
  Star,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  Headphones,
  Volume2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

interface CaseStudiesPageProps {
  onBack: () => void;
}

export function CaseStudiesPage({ onBack }: CaseStudiesPageProps) {
  const [selectedMetric, setSelectedMetric] = useState('views');

  // Case study data for Example Music Group
  const caseStudyData = {
    client: "Example Music Group",
    campaign: "New Album Launch - 'Electric Nights'",
    duration: "30 days",
    budget: "$15,000 AUD",
    totalViews: 1247892,
    totalEngagement: 156789,
    cpm: 2.85,
    ctr: 4.7,
    conversionRate: 3.2,
    trackingStreams: 847293
  };

  // Views over time data
  const viewsData = [
    { day: 'Day 1', views: 15420, cliplab: 15420, youtube: 8200, tiktok: 6800, instagram: 5400 },
    { day: 'Day 5', views: 89540, cliplab: 89540, youtube: 42000, tiktok: 38500, instagram: 31200 },
    { day: 'Day 10', views: 287650, cliplab: 287650, youtube: 145000, tiktok: 128000, instagram: 98500 },
    { day: 'Day 15', views: 542780, cliplab: 542780, youtube: 285000, tiktok: 248000, instagram: 185000 },
    { day: 'Day 20', views: 798420, cliplab: 798420, youtube: 420000, tiktok: 365000, instagram: 275000 },
    { day: 'Day 25', views: 1087650, cliplab: 1087650, youtube: 580000, tiktok: 485000, instagram: 365000 },
    { day: 'Day 30', views: 1247892, cliplab: 1247892, youtube: 695000, tiktok: 587000, instagram: 425000 }
  ];

  // Platform comparison data
  const platformComparison = [
    {
      platform: 'ClipLab',
      views: 1247892,
      cpm: 2.85,
      ctr: 4.7,
      engagement: 8.4,
      cost: 15000,
      color: '#7FFF00'
    },
    {
      platform: 'YouTube Ads',
      views: 695000,
      cpm: 8.50,
      ctr: 2.1,
      engagement: 3.2,
      cost: 15000,
      color: '#FF0000'
    },
    {
      platform: 'TikTok Ads',
      views: 587000,
      cpm: 6.75,
      ctr: 3.8,
      engagement: 5.1,
      cost: 15000,
      color: '#000000'
    },
    {
      platform: 'Instagram Ads',
      views: 425000,
      cpm: 12.30,
      ctr: 1.9,
      engagement: 2.8,
      cost: 15000,
      color: '#E4405F'
    }
  ];

  // Engagement breakdown
  const engagementData = [
    { name: 'Likes', value: 89456, color: '#7FFF00' },
    { name: 'Comments', value: 34287, color: '#FF5C8D' },
    { name: 'Shares', value: 23890, color: '#00E5FF' },
    { name: 'Saves', value: 9156, color: '#FFEB3B' }
  ];

  // Performance timeline
  const timelineData = [
    { week: 'Week 1', reach: 285000, engagement: 24500, streams: 15240 },
    { week: 'Week 2', reach: 578000, engagement: 65890, streams: 89540 },
    { week: 'Week 3', reach: 896000, engagement: 125670, streams: 287650 },
    { week: 'Week 4', reach: 1247892, engagement: 156789, streams: 387293 }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="btn-secondary-cyan text-sm px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CLIPLAB</h1>
              <p className="text-xs">Case Studies</p>
            </div>
          </div>

          <Button className="btn-primary text-sm px-4 py-2">
            <Download className="w-4 h-4 mr-2" />
            GET REPORT
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="mb-8">
          <div className="window-card p-8 bg-gradient-primary text-primary-foreground mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Music className="w-8 h-8" />
              <Badge className="status-winner-1st">SUCCESS STORY</Badge>
            </div>
            <h1 className="text-retro-display text-3xl mb-4">
              EXAMPLE MUSIC GROUP: 1M+ VIEWS IN 30 DAYS
            </h1>
            <p className="text-lg mb-6">
              How ClipLab delivered 79% more views than traditional social media advertising 
              while achieving 3x lower CPM and 2.5x higher engagement rates for a major album launch.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-retro-display text-2xl">{formatNumber(caseStudyData.totalViews)}</div>
                <div className="text-sm opacity-80">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-retro-display text-2xl">${caseStudyData.cpm}</div>
                <div className="text-sm opacity-80">Cost Per Mille</div>
              </div>
              <div className="text-center">
                <div className="text-retro-display text-2xl">{caseStudyData.ctr}%</div>
                <div className="text-sm opacity-80">Click Through Rate</div>
              </div>
              <div className="text-center">
                <div className="text-retro-display text-2xl">{formatNumber(caseStudyData.trackingStreams)}</div>
                <div className="text-sm opacity-80">Generated Streams</div>
              </div>
            </div>
          </div>

          {/* Campaign Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="window-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h3 className="text-retro-display text-lg">CAMPAIGN DETAILS</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">CLIENT</p>
                  <p className="text-retro-display">{caseStudyData.client}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ALBUM</p>
                  <p className="text-sm">{caseStudyData.campaign}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DURATION</p>
                  <p className="text-sm">{caseStudyData.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">BUDGET</p>
                  <p className="text-retro-display text-primary">{caseStudyData.budget}</p>
                </div>
              </div>
            </Card>

            <Card className="window-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-status-winner-1st" />
                <h3 className="text-retro-display text-lg">KEY RESULTS</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">vs YouTube Ads</span>
                  <Badge className="status-approved">+79% Views</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPM Reduction</span>
                  <Badge className="status-approved">-66% Cost</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engagement Rate</span>
                  <Badge className="status-approved">+163% Higher</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ROI</span>
                  <Badge className="status-winner-1st">+284%</Badge>
                </div>
              </div>
            </Card>

            <Card className="window-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-secondary" />
                <h3 className="text-retro-display text-lg">IMPACT</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">ALBUM STREAMS</p>
                  <p className="text-retro-display text-secondary">{formatNumber(caseStudyData.trackingStreams)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">PLAYLIST ADDS</p>
                  <p className="text-sm">12,847 playlists</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">NEW FOLLOWERS</p>
                  <p className="text-sm">8,542 followers</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CHART POSITION</p>
                  <p className="text-retro-display text-status-winner-1st">#3 Alternative</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background-secondary border-2 border-foreground">
            <TabsTrigger value="performance" className="nav-tab">PERFORMANCE</TabsTrigger>
            <TabsTrigger value="comparison" className="nav-tab">COMPARISON</TabsTrigger>
            <TabsTrigger value="engagement" className="nav-tab">ENGAGEMENT</TabsTrigger>
            <TabsTrigger value="insights" className="nav-tab">INSIGHTS</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Views Growth Chart */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">CAMPAIGN GROWTH TRAJECTORY</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: 'var(--window-border)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#7FFF00" 
                      fill="#7FFF00" 
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Performance Metrics */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">WEEKLY PERFORMANCE BREAKDOWN</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: 'var(--window-border)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="reach" fill="#7FFF00" name="Reach" />
                    <Bar dataKey="engagement" fill="#FF5C8D" name="Engagement" />
                    <Bar dataKey="streams" fill="#00E5FF" name="Streams" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Platform Performance Breakdown */}
            <Card className="window-card p-6">
              <h3 className="text-retro-display text-lg mb-6">PLATFORM PERFORMANCE METRICS</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {platformComparison.map((platform, index) => (
                  <div key={platform.platform} className="p-4 bg-background-secondary rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: platform.color }}
                        ></div>
                        <span className="text-retro-display text-sm">{platform.platform}</span>
                      </div>
                      {index === 0 && <Badge className="status-winner-1st text-xs">WINNER</Badge>}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-retro-display text-sm">{formatNumber(platform.views)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CPM</p>
                        <p className="text-sm">${platform.cpm}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm">{platform.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <p className="text-sm">{platform.engagement}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Platform Views Comparison */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">VIEWS: CLIPLAB VS COMPETITORS</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: 'var(--window-border)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="cliplab" stroke="#7FFF00" strokeWidth={3} name="ClipLab" />
                    <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} name="YouTube Ads" />
                    <Line type="monotone" dataKey="tiktok" stroke="#000000" strokeWidth={2} name="TikTok Ads" />
                    <Line type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2} name="Instagram Ads" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* CPM Comparison */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">CPM COMPARISON</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformComparison} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis dataKey="platform" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: 'var(--window-border)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="cpm">
                      {platformComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Detailed Comparison Table */}
            <Card className="window-card p-6">
              <h3 className="text-retro-display text-lg mb-6">COMPREHENSIVE PLATFORM ANALYSIS</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground">
                      <th className="text-left p-3 text-retro-display">PLATFORM</th>
                      <th className="text-center p-3 text-retro-display">VIEWS</th>
                      <th className="text-center p-3 text-retro-display">CPM</th>
                      <th className="text-center p-3 text-retro-display">CTR</th>
                      <th className="text-center p-3 text-retro-display">ENGAGEMENT</th>
                      <th className="text-center p-3 text-retro-display">COST EFFICIENCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformComparison.map((platform, index) => (
                      <tr key={platform.platform} className="border-b border-muted">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: platform.color }}
                            ></div>
                            <span className="text-retro-display">{platform.platform}</span>
                            {index === 0 && <Badge className="status-winner-1st text-xs">BEST</Badge>}
                          </div>
                        </td>
                        <td className="text-center p-3">{formatNumber(platform.views)}</td>
                        <td className="text-center p-3">${platform.cpm}</td>
                        <td className="text-center p-3">{platform.ctr}%</td>
                        <td className="text-center p-3">{platform.engagement}%</td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center space-x-1">
                            {index === 0 ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-status-approved" />
                                <span className="text-status-approved">+198%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4 text-status-rejected" />
                                <span className="text-status-rejected">-{Math.floor(Math.random() * 50 + 30)}%</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Engagement Breakdown */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">ENGAGEMENT BREAKDOWN</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Engagement Rate Gauge */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">ENGAGEMENT RATE</h3>
                <div className="text-center">
                  <div className="text-6xl text-retro-display text-primary mb-2">8.4%</div>
                  <p className="text-muted-foreground mb-4">Industry Average: 3.2%</p>
                  <Badge className="status-approved">+163% Above Average</Badge>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Likes Rate</span>
                      <span className="text-primary">7.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Comment Rate</span>
                      <span className="text-secondary">2.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Share Rate</span>
                      <span className="text-secondary-alt">1.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Save Rate</span>
                      <span className="text-status-pending">0.7%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Performing Content */}
            <Card className="window-card p-6">
              <h3 className="text-retro-display text-lg mb-6">TOP PERFORMING CLIPS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Behind the Scenes Studio', views: 287650, engagement: 12.4 },
                  { title: 'Live Performance Highlight', views: 234890, engagement: 10.8 },
                  { title: 'Artist Interview Snippet', views: 189450, engagement: 9.2 }
                ].map((clip, index) => (
                  <div key={index} className="p-4 bg-background-secondary rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={index === 0 ? 'status-winner-1st' : index === 1 ? 'status-winner-2nd' : 'status-winner-3rd'}>
                        #{index + 1}
                      </Badge>
                      <Play className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-retro-display text-sm mb-2">{clip.title}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Views</span>
                        <span>{formatNumber(clip.views)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="text-primary">{clip.engagement}%</span>
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
                <h3 className="text-retro-display text-lg mb-6">KEY SUCCESS FACTORS</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-status-approved/10 rounded-lg border border-status-approved/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-status-approved" />
                      <span className="text-retro-display text-sm">Authentic Content Creation</span>
                    </div>
                    <p className="text-sm">ClipLab's creator network produced genuine, authentic content that resonated better than traditional advertising.</p>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-retro-display text-sm">Precise Audience Targeting</span>
                    </div>
                    <p className="text-sm">Advanced targeting algorithms reached music fans most likely to engage with the album genre.</p>
                  </div>
                  
                  <div className="p-4 bg-secondary-alt/10 rounded-lg border border-secondary-alt/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-secondary-alt" />
                      <span className="text-retro-display text-sm">Multi-Platform Distribution</span>
                    </div>
                    <p className="text-sm">Content was optimized and distributed across all major social platforms simultaneously.</p>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="window-card p-6">
                <h3 className="text-retro-display text-lg mb-6">WHAT MADE THIS SUCCESSFUL</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-background-secondary rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-retro-display text-sm">Creator Quality</span>
                    </div>
                    <p className="text-sm text-muted-foreground">High-quality creators with engaged audiences in the music vertical produced superior content.</p>
                  </div>
                  
                  <div className="p-4 bg-background-secondary rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-secondary" />
                      <span className="text-retro-display text-sm">Data-Driven Optimization</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Real-time performance monitoring allowed for rapid campaign optimization and budget reallocation.</p>
                  </div>
                  
                  <div className="p-4 bg-background-secondary rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Music className="w-4 h-4 text-status-pending" />
                      <span className="text-retro-display text-sm">Content Variety</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiple content formats (snippets, behind-scenes, live performances) maximized appeal.</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROI Breakdown */}
            <Card className="window-card p-6">
              <h3 className="text-retro-display text-lg mb-6">RETURN ON INVESTMENT ANALYSIS</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl text-retro-display text-status-approved mb-2">384%</div>
                  <p className="text-sm text-muted-foreground">Total ROI</p>
                </div>
                <div>
                  <div className="text-3xl text-retro-display text-primary mb-2">$2.85</div>
                  <p className="text-sm text-muted-foreground">Cost Per 1K Views</p>
                </div>
                <div>
                  <div className="text-3xl text-retro-display text-secondary mb-2">$0.47</div>
                  <p className="text-sm text-muted-foreground">Cost Per Stream</p>
                </div>
                <div>
                  <div className="text-3xl text-retro-display text-secondary-alt mb-2">$1.76</div>
                  <p className="text-sm text-muted-foreground">Cost Per Follower</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-status-winner-1st/10 rounded-lg border border-status-winner-1st/20">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5 text-status-winner-1st" />
                  <span className="text-retro-display">CAMPAIGN EXCEEDED ALL KPI TARGETS</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="window-card p-8 bg-primary/10 border-primary/20 mt-8">
          <div className="text-center">
            <h3 className="text-retro-display text-2xl mb-4">READY TO ACHIEVE SIMILAR RESULTS?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of brands and creators who have transformed their content amplification 
              strategy with ClipLab's innovative creator marketplace.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button className="btn-primary">
                <Zap className="w-4 h-4 mr-2" />
                START YOUR CAMPAIGN
              </Button>
              <Button variant="outline" className="btn-secondary-cyan">
                <ExternalLink className="w-4 h-4 mr-2" />
                VIEW MORE CASE STUDIES
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}