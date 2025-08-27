'use client';

import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  Crown, 
  Trophy, 
  Settings, 
  LogOut, 
  User,
  TrendingUp,
  DollarSign,
  Play,
  FileText,
  BarChart3,
  Wallet,
  Users,
  Zap
} from 'lucide-react';
import { User as UserType } from '../App';

type Page = 'unified-landing' | 'creator-landing' | 'clipper-landing' | 'login' | 'signup' | 'creator-dashboard' | 'clipper-dashboard' | 'clipper-bounties' | 'clipper-submissions' | 'clipper-earnings' | 'clipper-leaderboards' | 'clipper-analytics' | 'admin' | 'bounty-creation' | 'campaign-constructor' | 'campaign-tracking' | 'campaign-creation' | 'campaigns';

interface NavigationProps {
  user: UserType;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Navigation({ user, currentPage, onNavigate, onLogout }: NavigationProps) {
  const navItems = [
    // Creator navigation
    ...(user.role === 'creator' ? [
      {
        id: 'creator-dashboard' as Page,
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null
      },

      {
        id: 'campaigns' as Page,
        label: 'Campaigns',
        icon: BarChart3,
        badge: null
      }
    ] : []),
    
    // Clipper navigation
    ...(user.role === 'clipper' ? [
      {
        id: 'clipper-bounties' as Page,
        label: 'Active Bounties',
        icon: Play,
        badge: null
      },
      {
        id: 'clipper-submissions' as Page,
        label: 'My Submissions',
        icon: FileText,
        badge: null
      },
      {
        id: 'clipper-leaderboards' as Page,
        label: 'Leaderboards',
        icon: Trophy,
        badge: null
      },
      {
        id: 'clipper-earnings' as Page,
        label: 'Earnings',
        icon: DollarSign,
        badge: null
      }
    ] : []),
    
    // Admin navigation
    ...(user.role === 'admin' ? [
      {
        id: 'admin' as Page,
        label: 'Admin Panel',
        icon: Settings,
        badge: null
      }
    ] : [])
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-nav-yellow border-r-2 border-foreground z-50">
      {/* Logo/Brand */}
      <div className="border-b-2 border-foreground">
        <Button
          onClick={() => onNavigate('unified-landing')}
          variant="ghost"
          className="w-full p-6 h-auto justify-start hover:bg-background-secondary/50 rounded-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
              <Trophy className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <div className="text-retro-display text-lg">CLIPLAB</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {user.role === 'creator' ? 'Creator Studio' : 
                 user.role === 'clipper' ? 'Clipper Hub' : 
                 'Admin Control'}
              </div>
            </div>
          </div>
        </Button>
      </div>



      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || 
              (item.id === 'clipper-bounties' && currentPage === 'clipper-dashboard');
            
            return (
              <Button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4 ${
                  isActive 
                    ? 'btn-primary shadow-none' 
                    : 'hover:bg-background-secondary border border-transparent hover:border-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-retro-nav">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto px-2 py-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Stats Section for Clippers */}
      {user.role === 'clipper' && (
        <div className="p-4 border-t-2 border-foreground bg-background-secondary/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">This Month</span>
              <span className="text-status-approved font-mono">
                ${Math.floor(Math.random() * 500 + 200)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Subs</span>
              <span className="text-status-pending font-mono">
                {Math.floor(Math.random() * 8 + 2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="text-primary font-mono">
                {Math.floor(Math.random() * 40 + 60)}%
              </span>
            </div>
          </div>
        </div>
      )}



      {/* User Profile Section - Moved to Bottom */}
      <div className="border-t-2 border-foreground bg-background-secondary">
        {user.role === 'clipper' ? (
          <Button
            onClick={() => onNavigate('clipper-analytics')}
            variant="ghost"
            className="w-full p-4 h-auto justify-start hover:bg-background/50 rounded-none"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border-2 border-foreground">
                <User className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-retro-display text-sm truncate">{user.username}</div>
                <div className="text-xs text-muted-foreground">
                  {user.totalEarnings && (
                    <span className="text-status-approved">
                      ${user.totalEarnings.toLocaleString()} earned
                    </span>
                  )}
                </div>
                <div className="text-xs text-secondary-alt font-semibold mt-1">
                  Click for Analytics →
                </div>
              </div>
            </div>
          </Button>
        ) : (
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border-2 border-foreground">
                <User className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-retro-display text-sm truncate">{user.username}</div>
                <div className="text-xs text-muted-foreground">
                  {user.role === 'creator' && (
                    <span className="text-primary">Level {user.level || 1}</span>
                  )}
                  {user.role === 'admin' && (
                    <span className="text-destructive">ADMIN</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {user.streak && user.streak > 0 && (
          <div className="pb-4 px-4">
            <div className="flex items-center justify-center">
              <Badge className="status-approved px-2 py-1 text-xs">
                🔥 {user.streak} DAY STREAK
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t-2 border-foreground">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start h-10 border-destructive text-destructive hover:bg-destructive hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-retro-nav">LOGOUT</span>
        </Button>
      </div>
    </div>
  );
}