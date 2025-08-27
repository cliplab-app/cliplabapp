'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { 
  Plus, 
  Crown, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Eye,
  Heart,
  MessageCircle,
  CheckCircle,
  XCircle,
  Trophy,
  Zap,
  Flame,
  Calendar,
  ChevronDown,
  ChevronUp,
  Play,
  BarChart3,
  Activity,
  Youtube,
  Video,
  Instagram,
  Twitter,
  Gauge,
  Target,
  ArrowUpRight,
  LogOut,
  Settings,
  FileText,
  PieChart,
  Wallet,
  MessageSquare,
  Download,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  MousePointer,
  PlayCircle,
  Award,
  Medal,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Copy,
  Share2,
  Edit3,
  Pause,
  MoreHorizontal,
  Info,
  Rocket,
  Sparkles,
  Brain,
  ShieldAlert,
  Bell,
  Wand2,
  Maximize2,
  ChevronRight,
  CheckSquare,
  AlertCircle,
  RefreshCcw,
  Send,
  UserPlus,
  FileCheck,
  TimerIcon,
  Timer,
  Inbox,
  TrendingUpIcon
} from 'lucide-react';
import { User, Bounty, FeaturedClip, TopCreator, Submission } from '../types';

interface CreatorDashboardProps {
  user: User;
  bounties: Bounty[];
  onCreateBounty: () => void;
  onLogout: () => void;
  onUpdateSubmissionStatus: (submissionId: string, status: Submission['status']) => void;
  createdBountyData?: any;
  onClearCreatedBounty?: () => void;
}

export function CreatorDashboard({ 
  user, 
  bounties, 
  onCreateBounty,
  onLogout,
  onUpdateSubmissionStatus,
  createdBountyData,
  onClearCreatedBounty
}: CreatorDashboardProps) {
  console.log('CreatorDashboard - Rendering with props:', {
    user: user ? { id: user.id, username: user.username, role: user.role } : null,
    bountiesCount: bounties?.length || 0,
    createdBountyData: !!createdBountyData
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'campaigns' | 'analytics' | 'payouts' | 'community' | 'settings'>('dashboard');

  // Check if user has campaigns, if not show demo data for populated dashboard
  const hasUserCampaigns = bounties.length > 0;
  const displayBounties = hasUserCampaigns ? bounties : [];

  // Enhanced user stats with new metrics - show demo stats if no user campaigns
  const userStats = {
    activeCampaigns: hasUserCampaigns ? bounties.filter(b => b.status === 'active').length : 7,
    totalSubmissions: hasUserCampaigns ? bounties.reduce((acc, b) => acc + b.submissions.length, 0) : 23,
    totalSpent: hasUserCampaigns ? bounties.reduce((acc, b) => acc + b.amount, 0) : 4850,
    avgCPM: 2.45,
    budgetPacing: 'on-track', // 'on-track', 'fast', 'slow'
    views24h: hasUserCampaigns ? bounties.reduce((acc, b) => acc + Math.floor(Math.random() * 10000), 0) : 48750,
    forecastedSpend: hasUserCampaigns ? bounties.reduce((acc, b) => acc + b.amount * 1.2, 0) : 15420 // Projected spend to campaign end
  };

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const getTrendIndicator = (value: number, isPositive = true) => {
    const icon = isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
    const colorClass = isPositive ? 'text-status-approved' : 'text-status-rejected';
    return (
      <span className={`flex items-center space-x-1 text-xs ${colorClass}`}>
        {icon}
        <span>{Math.abs(value)}%</span>
      </span>
    );
  };

  console.log('CreatorDashboard - About to render JSX');

  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-nav-yellow border-r-2 border-foreground flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-foreground">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CREATOR STUDIO</h1>
              <p className="text-xs text-muted-foreground">{user.username}</p>
            </div>
          </div>
          
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-retro-display text-lg text-primary">{userStats.activeCampaigns}</div>
              <div className="text-xs text-muted-foreground">Live</div>
            </div>
            <div className="text-center">
              <div className="text-retro-display text-lg text-secondary">${formatNumber(userStats.totalSpent)}</div>
              <div className="text-xs text-muted-foreground">Invested</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
              { id: 'campaigns', label: 'CAMPAIGNS', icon: FileText },
              { id: 'analytics', label: 'ANALYTICS', icon: PieChart },
              { id: 'payouts', label: 'PAYOUTS', icon: Wallet },
              { id: 'community', label: 'COMMUNITY', icon: MessageSquare },
              { id: 'settings', label: 'SETTINGS', icon: Settings }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start text-retro-nav ${
                    currentPage === item.id ? 'btn-primary' : 'hover:bg-background/20'
                  }`}
                  onClick={() => setCurrentPage(item.id as any)}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Create Campaign Button */}
        <div className="p-4 border-t-2 border-foreground">
          <Button 
            onClick={onCreateBounty}
            className="w-full btn-primary mb-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREATE CAMPAIGN
          </Button>
          
          <Button 
            onClick={onLogout}
            variant="ghost"
            className="w-full text-retro-nav hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOG OUT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <div className="space-y-6">
              {/* Success Banner */}
              {createdBountyData && (
                <Card className="window-card p-4 bg-status-approved/10 border-status-approved">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-status-approved" />
                      <div>
                        <h3 className="text-retro-display text-sm">CAMPAIGN CREATED!</h3>
                        <p className="text-xs text-muted-foreground">Your bounty is now live and accepting submissions</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearCreatedBounty}
                      className="text-status-approved hover:bg-status-approved/20"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">CREATOR DASHBOARD</h1>
                  <p className="text-muted-foreground">Data-driven insights for your content amplification</p>
                </div>
                <Button onClick={onCreateBounty} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  NEW CAMPAIGN
                </Button>
              </div>

              {/* Enhanced Metrics Rail - 6 cards */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    {getTrendIndicator(12)}
                  </div>
                  <div className="text-retro-display text-lg">{userStats.activeCampaigns}</div>
                  <div className="text-xs text-muted-foreground">Active Campaigns</div>
                </Card>
                
                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary" />
                    </div>
                    {getTrendIndicator(23)}
                  </div>
                  <div className="text-retro-display text-lg">{userStats.totalSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Total Submissions</div>
                </Card>
                
                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-status-approved/10 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-status-approved" />
                    </div>
                    {getTrendIndicator(8)}
                  </div>
                  <div className="text-retro-display text-lg">${formatNumber(userStats.totalSpent)} AUD</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </Card>
                
                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-status-pending/10 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-status-pending" />
                    </div>
                    {getTrendIndicator(5)}
                  </div>
                  <div className="text-retro-display text-lg">${userStats.avgCPM}</div>
                  <div className="text-xs text-muted-foreground">Average CPM</div>
                </Card>

                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-status-approved/10 rounded-full flex items-center justify-center">
                      <Gauge className="w-4 h-4 text-status-approved" />
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${
                      userStats.budgetPacing === 'on-track' ? 'status-approved' :
                      userStats.budgetPacing === 'fast' ? 'status-pending' : 'status-rejected'
                    }`}>
                      {userStats.budgetPacing.toUpperCase().replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-retro-display text-lg">Budget Pacing</div>
                  <div className="text-xs text-muted-foreground">Campaign Health</div>
                </Card>

                <Card className="window-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-secondary-alt/10 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-secondary-alt" />
                    </div>
                    {getTrendIndicator(34)}
                  </div>
                  <div className="text-retro-display text-lg">{formatNumber(userStats.views24h)}</div>
                  <div className="text-xs text-muted-foreground">Views (24h)</div>
                </Card>
              </div>

              {/* Simple Welcome Message */}
              <Card className="window-card p-6">
                <div className="text-center">
                  <h2 className="text-retro-display text-xl mb-4">Welcome back, {user.username}!</h2>
                  <p className="text-muted-foreground mb-6">
                    Ready to amplify your content? Create your first campaign to get started.
                  </p>
                  <Button onClick={onCreateBounty} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    CREATE YOUR FIRST CAMPAIGN
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          {currentPage === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">CAMPAIGNS</h1>
                  <p className="text-muted-foreground">Manage your active campaigns</p>
                </div>
                <Button onClick={onCreateBounty} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  NEW CAMPAIGN
                </Button>
              </div>
              
              {bounties.length === 0 ? (
                <Card className="window-card p-6">
                  <div className="text-center">
                    <h3 className="text-retro-display text-lg mb-4">NO CAMPAIGNS YET</h3>
                    <p className="text-muted-foreground mb-6">Create your first campaign to start amplifying your content.</p>
                    <Button onClick={onCreateBounty} className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE CAMPAIGN
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bounties.map((bounty) => (
                    <Card key={bounty.id} className="window-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-retro-display text-lg mb-2">{bounty.title}</h3>
                          <p className="text-muted-foreground mb-2">{bounty.description}</p>
                          <div className="flex items-center space-x-4">
                            <Badge className="status-approved">{bounty.status.toUpperCase()}</Badge>
                            <span className="text-retro-display text-sm">${bounty.amount} AUD</span>
                            <span className="text-xs text-muted-foreground">{bounty.submissions.length} submissions</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {currentPage === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">ANALYTICS</h1>
                  <p className="text-muted-foreground">Performance insights and data</p>
                </div>
              </div>
              <Card className="window-card p-6">
                <p className="text-muted-foreground">Analytics coming soon...</p>
              </Card>
            </div>
          )}

          {currentPage === 'payouts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">PAYOUTS</h1>
                  <p className="text-muted-foreground">Manage your earnings and payouts</p>
                </div>
              </div>
              <Card className="window-card p-6">
                <p className="text-muted-foreground">Payouts coming soon...</p>
              </Card>
            </div>
          )}

          {currentPage === 'community' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">COMMUNITY</h1>
                  <p className="text-muted-foreground">Connect with clippers and creators</p>
                </div>
              </div>
              <Card className="window-card p-6">
                <p className="text-muted-foreground">Community features coming soon...</p>
              </Card>
            </div>
          )}
          
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-retro-display text-2xl mb-2">SETTINGS</h1>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
              </div>
              <Card className="window-card p-6">
                <p className="text-muted-foreground">Settings coming soon...</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}