'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Zap, TrendingUp, Users, ArrowRight, DollarSign, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface ClipperWelcomeScreenNewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSwitchToCreator: () => void;
}

export function ClipperWelcomeScreenNew({ onGetStarted, onLogin, onSwitchToCreator }: ClipperWelcomeScreenNewProps) {
  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex flex-col">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
              <Play className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-retro-display text-lg">CLIPLAB</h1>
              <p className="text-retro-mono text-xs text-muted-foreground">CLIPPER HUB</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onSwitchToCreator}
              className="btn-secondary-pink text-retro-nav px-6 py-2 border-2 border-foreground"
            >
              I'M A CREATOR
            </Button>
            <Button 
              onClick={onLogin}
              className="btn-primary text-retro-nav px-6 py-2 border-2 border-foreground"
            >
              EXISTING USER? LOGIN
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <div className="bg-primary px-4 py-2 border-2 border-foreground window-card">
                  <span className="text-retro-display text-sm">CLIPPER HUB</span>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-retro-display text-5xl lg:text-6xl mb-6"
              >
                WELCOME,<br />
                <span className="text-gradient-primary">CLIPPER!</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-md"
              >
                Find campaigns, create clips, and earn serious money.
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-status-approved border-2 border-foreground flex items-center justify-center window-card">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">INSTANT PAYOUTS</h3>
                  <p className="text-sm text-muted-foreground">Get paid within hours of winning</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-vibrant-blue border-2 border-foreground flex items-center justify-center window-card">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">HIGH-VALUE CAMPAIGNS</h3>
                  <p className="text-sm text-muted-foreground">$250-$850+ payouts per winning clip</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center window-card">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">COMPETITIVE RANKINGS</h3>
                  <p className="text-sm text-muted-foreground">Climb leaderboards and unlock bonuses</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={onGetStarted}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Dashboard Preview Mock */}
            <Card className="window-card p-6 bg-white relative overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-retro-display text-lg">CLIPPER DASHBOARD</h3>
                  <p className="text-sm text-muted-foreground">Your earning center</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-status-approved font-bold">$2,180</div>
                  <div className="text-xs text-muted-foreground">TOTAL EARNED</div>
                </div>
              </div>

              {/* Mock Campaign Cards */}
              <div className="space-y-3">
                {[
                  { title: 'Gaming Rage Compilation', amount: '$750', status: 'HOT', difficulty: 'HARD' },
                  { title: 'Viral Dance Trends', amount: '$600', status: 'NEW', difficulty: 'MEDIUM' },
                  { title: 'Tech Review Fails', amount: '$520', status: 'ACTIVE', difficulty: 'HARD' }
                ].map((campaign, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className="window-card p-4 bg-muted/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{campaign.title}</div>
                        <div className="text-xs text-muted-foreground">{campaign.difficulty} DIFFICULTY</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-bold text-status-approved">{campaign.amount}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          campaign.status === 'HOT' ? 'bg-destructive text-white' :
                          campaign.status === 'NEW' ? 'bg-status-approved text-foreground' :
                          'bg-status-pending text-foreground'
                        }`}>
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-border"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-vibrant-blue">12</div>
                  <div className="text-xs text-muted-foreground">WINS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">8</div>
                  <div className="text-xs text-muted-foreground">STREAK</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-status-winner-1st">#6</div>
                  <div className="text-xs text-muted-foreground">RANK</div>
                </div>
              </motion.div>

              {/* Animated Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Bottom Stats */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}        
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white border-t-2 border-foreground p-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-status-approved">$2.8M+</div>
            <div className="text-sm text-muted-foreground">PAID TO CLIPPERS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-vibrant-blue">$535</div>
            <div className="text-sm text-muted-foreground">AVG. PAYOUT</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">2HR</div>
            <div className="text-sm text-muted-foreground">AVG. PAYOUT TIME</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-status-winner-1st">156</div>
            <div className="text-sm text-muted-foreground">ACTIVE CAMPAIGNS</div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}