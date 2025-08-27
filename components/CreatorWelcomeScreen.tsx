'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatorWelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSwitchToClipper: () => void;
}

export function CreatorWelcomeScreen({ onGetStarted, onLogin, onSwitchToClipper }: CreatorWelcomeScreenProps) {
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
              <p className="text-retro-mono text-xs text-muted-foreground">CREATOR PORTAL</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onSwitchToClipper}
              className="btn-secondary-pink text-retro-nav px-6 py-2 border-2 border-foreground"
            >
              I'M A CLIPPER
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
                  <span className="text-retro-display text-sm">CREATOR PORTAL</span>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-retro-display text-5xl lg:text-6xl mb-6"
              >
                WELCOME,<br />
                <span className="text-gradient-primary">CREATOR!</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-md"
              >
                Post bounties, reward clippers, and scale your reach.
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
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">INSTANT AMPLIFICATION</h3>
                  <p className="text-sm text-muted-foreground">Turn long content into viral moments</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-vibrant-blue border-2 border-foreground flex items-center justify-center window-card">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">PROVEN RESULTS</h3>
                  <p className="text-sm text-muted-foreground">Average 340% increase in reach</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center window-card">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-retro-display text-lg">EXPERT NETWORK</h3>
                  <p className="text-sm text-muted-foreground">Access 10,000+ skilled clippers</p>
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
                  <h3 className="text-retro-display text-lg">CREATOR DASHBOARD</h3>
                  <p className="text-sm text-muted-foreground">Manage your bounties</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-status-approved font-bold">$3,420</div>
                  <div className="text-xs text-muted-foreground">TOTAL SPENT</div>
                </div>
              </div>

              {/* Mock Bounty Cards */}
              <div className="space-y-3">
                {[
                  { title: 'Gaming Rage Compilation', amount: '$750', status: 'ACTIVE', submissions: '12' },
                  { title: 'Cooking Disaster Moments', amount: '$450', status: 'REVIEW', submissions: '8' },
                  { title: 'Tech Review Fails', amount: '$600', status: 'COMPLETE', submissions: '15' }
                ].map((bounty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className="window-card p-4 bg-muted/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{bounty.title}</div>
                        <div className="text-xs text-muted-foreground">{bounty.submissions} submissions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-status-approved">{bounty.amount}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          bounty.status === 'ACTIVE' ? 'bg-status-approved text-foreground' :
                          bounty.status === 'REVIEW' ? 'bg-status-pending text-foreground' :
                          'bg-status-winner-1st text-foreground'
                        }`}>
                          {bounty.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

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
            <div className="text-2xl font-bold text-status-approved">10,000+</div>
            <div className="text-sm text-muted-foreground">ACTIVE CLIPPERS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-vibrant-blue">340%</div>
            <div className="text-sm text-muted-foreground">AVG. REACH INCREASE</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">24HR</div>
            <div className="text-sm text-muted-foreground">TURNAROUND TIME</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-status-winner-1st">$2.8M+</div>
            <div className="text-sm text-muted-foreground">PAID TO CLIPPERS</div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}