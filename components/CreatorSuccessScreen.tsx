'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Play, Share, Copy, FileText, Plus, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatorSuccessScreenProps {
  bountyData: any;
  onViewSubmissions: () => void;
  onCreateAnother: () => void;
  onShare: (platform: 'copy' | 'twitter') => void;
}

export function CreatorSuccessScreen({ bountyData, onViewSubmissions, onCreateAnother, onShare }: CreatorSuccessScreenProps) {
  const bountyUrl = `https://cliplab.com/bounty/${bountyData.id || 'demo-123'}`;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex flex-col">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Play className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-retro-display text-sm">CLIPLAB CREATOR</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-24 h-24 bg-status-approved border-4 border-foreground rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-foreground" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-retro-display text-4xl mb-4">YOUR BOUNTY IS LIVE!</h1>
              <p className="text-xl text-muted-foreground">
                Clippers are already discovering your campaign
              </p>
            </motion.div>

            {/* Bounty Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card className="window-card p-6 bg-white text-left">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-retro-display text-lg mb-2">{bountyData.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{bountyData.description}</p>
                    
                    {bountyData.hashtags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bountyData.hashtags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} className={`hashtag-${tag.toLowerCase()} text-xs`}>
                            #{tag}
                          </Badge>
                        ))}
                        {bountyData.hashtags.length > 3 && (
                          <Badge className="bg-muted text-xs">
                            +{bountyData.hashtags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-status-approved">${bountyData.amount}</div>
                    <Badge className="status-approved text-xs">LIVE NOW</Badge>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 2 }}
                      className="text-lg font-bold text-vibrant-blue"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        3
                      </motion.span>
                    </motion.div>
                    <div className="text-xs text-muted-foreground">VIEWS</div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 2 }}
                      className="text-lg font-bold text-secondary"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                      >
                        1
                      </motion.span>
                    </motion.div>
                    <div className="text-xs text-muted-foreground">INTERESTED</div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 2 }}
                      className="text-lg font-bold text-status-approved"
                    >
                      0
                    </motion.div>
                    <div className="text-xs text-muted-foreground">SUBMISSIONS</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-retro-display text-lg mb-4">SPREAD THE WORD</h3>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => onShare('copy')}
                  className="btn-secondary-cyan flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>COPY LINK</span>
                </Button>
                <Button
                  onClick={() => onShare('twitter')}
                  className="btn-secondary-pink flex items-center space-x-2"
                >
                  <Share className="w-4 h-4" />
                  <span>TWEET</span>
                </Button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={onViewSubmissions}
                className="btn-primary flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>VIEW SUBMISSIONS</span>
              </Button>
              <Button
                onClick={onCreateAnother}
                variant="ghost"
                className="flex items-center space-x-2 hover:text-vibrant-blue"
              >
                <Plus className="w-4 h-4" />
                <span>CREATE ANOTHER BOUNTY</span>
              </Button>
            </motion.div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-12"
            >
              <Card className="window-card p-6 bg-primary/10 border-primary/30">
                <h4 className="text-retro-display text-sm mb-4">PRO TIPS FOR SUCCESS</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-bold">Promote Actively</div>
                      <div className="text-xs text-muted-foreground">Share on social media to reach more clippers</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-bold">Engage Quickly</div>
                      <div className="text-xs text-muted-foreground">Respond to submissions within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-bold">Set Clear Goals</div>
                      <div className="text-xs text-muted-foreground">Give detailed feedback to guide clippers</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Success Elements */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="fixed bottom-8 left-8 window-card p-3 bg-status-approved hidden lg:block"
            >
              <div className="text-xs font-bold">BOUNTY PUBLISHED!</div>
              <div className="text-xs">Ready for submissions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="fixed bottom-8 right-8 window-card p-3 bg-vibrant-blue hidden lg:block"
            >
              <div className="text-xs font-bold text-white">NOTIFICATIONS ON</div>
              <div className="text-xs text-white">You'll be notified of new clips</div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}