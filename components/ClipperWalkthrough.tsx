'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { X, Search, Link, TrendingUp, ChevronLeft, ChevronRight, Play, DollarSign, Eye, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClipperWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ClipperWalkthrough({ onComplete, onSkip }: ClipperWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const [animatedViews, setAnimatedViews] = useState(0);
  const [animatedRank, setAnimatedRank] = useState(100);

  // Handle escape key to skip walkthrough
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSkip();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onSkip]);

  const steps = [
    {
      icon: Search,
      title: "BROWSE CAMPAIGNS",
      description: "Discover high-paying campaigns from top creators",
      detail: "Browse through dozens of active campaigns. Each one offers real money for viral clips. The higher the payout, the bigger the opportunity!",
      color: "bg-primary"
    },
    {
      icon: Link,
      title: "SUBMIT YOUR CLIP",
      description: "Paste your YouTube Shorts URL and submit instantly",
      detail: "Simply paste your YouTube Shorts link and describe your clip. Our system automatically tracks views, likes, and engagement to calculate your earnings.",
      color: "bg-secondary"
    },
    {
      icon: TrendingUp,
      title: "EARN REAL CASH",
      description: "Watch your earnings grow as your clips go viral",
      detail: "Track your performance in real-time. See your rank climb and earnings grow as more people watch your clips. The more viral it goes, the more you earn!",
      color: "bg-status-approved"
    }
  ];

  // Mock bounty data for scrolling animation
  const mockBounties = [
    { title: "Gaming Rage Compilation", amount: 750, hashtags: ["Gaming", "Livestream"], difficulty: "Hard" },
    { title: "Cooking Disaster Compilation", amount: 450, hashtags: ["Tutorial", "Comedy"], difficulty: "Medium" },
    { title: "Viral Dance Trends", amount: 600, hashtags: ["Comedy", "Music"], difficulty: "Medium" },
    { title: "Podcast Golden Moments", amount: 380, hashtags: ["Podcast", "Reaction"], difficulty: "Easy" },
    { title: "Tech Review Fails", amount: 520, hashtags: ["Tutorial", "Comedy"], difficulty: "Hard" },
    { title: "Sports Reaction Explosions", amount: 890, hashtags: ["Reaction", "Livestream"], difficulty: "Expert" },
    { title: "Celebrity Interview Moments", amount: 670, hashtags: ["Comedy", "Reaction"], difficulty: "Hard" },
    { title: "AI Tool Mishaps", amount: 425, hashtags: ["Tutorial", "Comedy"], difficulty: "Medium" }
  ];

  // Animate earnings counter for step 3
  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setAnimatedEarnings(prev => {
          const target = 2850;
          const increment = Math.ceil((target - prev) / 10);
          return prev + increment >= target ? target : prev + increment;
        });
        
        setAnimatedViews(prev => {
          const target = 2400000;
          const increment = Math.ceil((target - prev) / 15);
          return prev + increment >= target ? target : prev + increment;
        });
        
        setAnimatedRank(prev => {
          const target = 7;
          return prev > target ? prev - 2 : target;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setAnimatedEarnings(0);
      setAnimatedViews(0);
      setAnimatedRank(100);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onSkip();
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Allow clicking backdrop to skip walkthrough
        if (e.target === e.currentTarget) {
          onSkip();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking on modal
      >
        {/* Close button - Always visible and more prominent */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkip}
          className="absolute -top-14 right-0 w-12 h-12 text-white hover:bg-white/20 z-20 bg-black/50 rounded-full border-2 border-white/30"
        >
          <X className="w-8 h-8" />
        </Button>

        <Card className="window-card bg-white overflow-hidden flex flex-col max-h-[90vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className={`${currentStepData.color} px-8 py-6 border-b-2 border-foreground relative flex-shrink-0`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-retro-display text-2xl text-white">{currentStepData.title}</h2>
                      <Badge className="bg-white/20 text-white text-sm px-3 py-1 mt-2">
                        STEP {currentStep + 1} OF {steps.length}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Step indicator dots */}
                    <div className="flex space-x-2">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentStep 
                              ? 'bg-white scale-125' 
                              : index < currentStep 
                              ? 'bg-white/70' 
                              : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    

                  </div>
                </div>
              </div>

              {/* Content - Scrollable area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-8 pb-4 space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="walkthrough-body">
                      {currentStepData.description}
                    </p>
                    
                    <p className="walkthrough-body max-w-md">
                      {currentStepData.detail}
                    </p>
                    
                    {/* Quick exit reminder */}
                    <p className="walkthrough-body opacity-60 italic">
                      Press ESC or click "Skip to Dashboard" to exit anytime
                    </p>
                  </div>

                  {/* Enhanced Step-specific Content */}
                  <div className="window-card p-6 bg-background-secondary min-h-[200px]">
                    {/* Step 1: Scrolling Bounties */}
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <p className="walkthrough-body">LIVE CAMPAIGNS FEED</p>
                        </div>
                        
                        <div className="overflow-hidden">
                          <motion.div
                            className="flex space-x-4"
                            animate={{ x: [-20, -400] }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            {[...mockBounties, ...mockBounties].map((bounty, index) => (
                              <motion.div
                                key={`${bounty.title}-${index}`}
                                className="flex-shrink-0 w-72"
                                whileHover={{ scale: 1.02 }}
                              >
                                <Card className="window-card p-4 bg-white h-full">
                                  <div className="flex flex-col items-center text-center space-y-3">
                                    <h3 className="walkthrough-body line-clamp-2">{bounty.title}</h3>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                      {bounty.hashtags.slice(0, 2).map(tag => (
                                        <Badge key={tag} className={`hashtag-${tag.toLowerCase()} px-2 py-1`}>
                                          <span className="walkthrough-body">#{tag}</span>
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="walkthrough-body text-status-approved">${bounty.amount}</div>
                                    <Badge className={`status-${bounty.difficulty.toLowerCase() === 'easy' ? 'approved' : bounty.difficulty.toLowerCase() === 'medium' ? 'pending' : 'rejected'}`}>
                                      <span className="walkthrough-body">{bounty.difficulty}</span>
                                    </Badge>
                                  </div>
                                  <Button className="w-full btn-primary">
                                    <span className="walkthrough-body">ENTER CAMPAIGN</span>
                                  </Button>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                        
                        <div className="text-center mt-4">
                          <p className="walkthrough-body">
                            💡 <strong className="walkthrough-body">Pro Tip:</strong> Look for campaigns with high payouts and short deadlines for quick wins!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Simplified URL Input Snippet */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <p className="walkthrough-body">SUBMISSION INTERFACE</p>
                        </div>
                        
                        {/* Simplified Campaign Context */}
                        <div className="window-card p-3 bg-primary/10 border-primary/30 text-center">
                          <div className="walkthrough-body">Gaming Rage Compilation</div>
                          <div className="walkthrough-body text-status-approved">$750</div>
                        </div>

                        {/* Simple URL Input Demo */}
                        <div className="space-y-4">
                          <div className="flex flex-col items-center">
                            <label className="walkthrough-body mb-2">YOUTUBE SHORTS URL</label>
                            <div className="relative w-full max-w-md">
                              <Input
                                placeholder="https://youtube.com/shorts/your-video-id"
                                className="input-retro pr-12 text-center"
                                value="https://youtube.com/shorts/dQw4w9WgXcQ"
                                readOnly
                                style={{ fontFamily: 'var(--font-primary)', fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0.01em', color: 'var(--muted-foreground)' }}
                              />
                              <motion.div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Link className="w-5 h-5 text-status-approved" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Simple Submit Preview */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-center"
                          >
                            <Button 
                              className="btn-primary px-8 py-3 text-retro-display"
                              onClick={handleNext}
                            >
                              TRY SUBMITTING →
                            </Button>
                          </motion.div>

                          {/* Quick validation indicator */}
                          <div className="flex items-center justify-center space-x-2 text-status-approved">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              ✓
                            </motion.div>
                            <span className="walkthrough-body">URL validated automatically</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="walkthrough-body">
                            💡 <strong className="walkthrough-body">Pro Tip:</strong> Make sure your YouTube Shorts are public and shareable!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Simplified Animated Earnings */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <p className="walkthrough-body">LIVE EARNINGS DASHBOARD</p>
                        </div>
                        
                        {/* Simplified Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <motion.div
                            className="window-card p-4 text-center bg-status-approved/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <DollarSign className="w-6 h-6 mx-auto mb-2 text-status-approved" />
                            <div className="walkthrough-body text-status-approved">${animatedEarnings}</div>
                            <div className="walkthrough-body">EARNED</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-4 text-center bg-vibrant-blue/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                          >
                            <Eye className="w-6 h-6 mx-auto mb-2 text-vibrant-blue" />
                            <div className="walkthrough-body text-vibrant-blue">{formatNumber(animatedViews)}</div>
                            <div className="walkthrough-body">VIEWS</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-4 text-center bg-vibrant-purple/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                          >
                            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-vibrant-purple" />
                            <div className="walkthrough-body text-vibrant-purple">#{animatedRank}</div>
                            <div className="walkthrough-body">RANK</div>
                          </motion.div>
                        </div>

                        {/* Simplified Growth Bar */}
                        <div className="window-card p-4 bg-white">
                          <h4 className="walkthrough-body mb-4">EARNINGS GROWING</h4>
                          <div className="relative h-16 bg-muted rounded">
                            <motion.div
                              className="h-full bg-status-approved rounded"
                              initial={{ width: 0 }}
                              animate={{ width: `${(animatedEarnings / 2850) * 100}%` }}
                              transition={{ duration: 3, ease: "easeOut" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="walkthrough-body font-bold text-foreground">
                                ${animatedEarnings} / $2,850
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="walkthrough-body">
                            🚀 <strong className="walkthrough-body">Pro Tip:</strong> Share your clips on social media to boost views and climb the leaderboard faster!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Navigation - Always Visible with enhanced skip option */}
              <div className="flex-shrink-0 bg-white border-t-2 border-foreground p-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="btn-secondary-cyan flex items-center space-x-2 px-6 text-retro-display"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>{currentStep > 0 ? 'BACK' : 'SKIP'}</span>
                    </Button>
                    
                    {/* Additional Skip to Dashboard button - always visible */}
                    <Button
                      variant="outline"
                      onClick={onSkip}
                      className="border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-2 px-4 text-retro-display"
                    >
                      <X className="w-4 h-4" />
                      <span>SKIP TO DASHBOARD</span>
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    className="btn-primary flex items-center space-x-2 px-6 text-retro-display"
                  >
                    <span>
                      {currentStep < steps.length - 1 ? 'NEXT' : 'START EARNING'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}