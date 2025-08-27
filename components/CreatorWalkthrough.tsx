import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { X, Plus, BarChart3, DollarSign, ChevronLeft, ChevronRight, Crown, TrendingUp, Users, Eye, Target, Activity, Rocket, Brain, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreatorWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

const mockCampaigns = [
  { title: "Gaming Stream Highlights", status: "ACTIVE", timeLeft: "3 days", submissions: 12, budget: 500 },
  { title: "Cooking Tutorial Clips", status: "ACTIVE", timeLeft: "5 days", submissions: 8, budget: 750 },
  { title: "Tech Review Shorts", status: "LIVE", timeLeft: "2 days", submissions: 15, budget: 1000 },
  { title: "Music Performance Cuts", status: "ACTIVE", timeLeft: "1 day", submissions: 23, budget: 800 },
];

const mockRecommendations = [
  { title: "Increase budget by 20% to boost submissions", impact: "+40% reach" },
  { title: "Add #trending hashtag for better discovery", impact: "+25% views" },
  { title: "Extend deadline by 2 days", impact: "+15% quality" },
];

const steps = [
  {
    title: "CREATE CAMPAIGNS",
    description: "Launch campaigns to get clips made from your content",
    detail: "Set budgets, deadlines, and watch clippers compete to create the best content for you.",
    color: "bg-primary-cobalt",
    icon: Crown
  },
  {
    title: "TRACK PERFORMANCE", 
    description: "Monitor analytics and optimize your campaigns",
    detail: "Get real-time insights, AI recommendations, and detailed performance metrics.",
    color: "bg-secondary",
    icon: BarChart3
  },
  {
    title: "MANAGE PAYOUTS",
    description: "Review submissions and distribute rewards",
    detail: "Smart escrow system handles payments automatically while you focus on selecting winners.",
    color: "bg-secondary-alt",
    icon: DollarSign
  }
];

export function CreatorWalkthrough({
  onComplete,
  onSkip
}: CreatorWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedCampaigns, setAnimatedCampaigns] = useState(0);
  const [animatedSubmissions, setAnimatedSubmissions] = useState(0);
  const [animatedSpent, setAnimatedSpent] = useState(0);
  const [animatedCPM, setAnimatedCPM] = useState(0);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  // Animated counters for step 2
  useEffect(() => {
    if (currentStep === 1) {
      const campaignTimer = setInterval(() => {
        setAnimatedCampaigns(prev => prev < 8 ? prev + 1 : prev);
      }, 150);
      
      const submissionTimer = setInterval(() => {
        setAnimatedSubmissions(prev => prev < 247 ? prev + 8 : prev);
      }, 50);
      
      const spentTimer = setInterval(() => {
        setAnimatedSpent(prev => prev < 12840 ? prev + 400 : prev);
      }, 30);
      
      const cpmTimer = setInterval(() => {
        setAnimatedCPM(prev => prev < 4.23 ? Math.min(prev + 0.13, 4.23) : prev);
      }, 80);

      return () => {
        clearInterval(campaignTimer);
        clearInterval(submissionTimer);
        clearInterval(spentTimer);
        clearInterval(cpmTimer);
      };
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

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
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
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking on modal
      >
        {/* Close button - Always visible and more prominent */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkip}
          className="absolute -top-12 sm:-top-14 right-0 w-10 h-10 sm:w-12 sm:h-12 text-white hover:bg-white/20 z-20 bg-black/50 rounded-full border-2 border-white/30"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </Button>

        <Card className="window-card bg-white overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Header - Responsive */}
              <div className={`${currentStepData.color} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b-2 border-foreground relative flex-shrink-0`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-retro-display text-lg sm:text-xl lg:text-2xl text-white truncate">
                        {currentStepData.title}
                      </h2>
                      <Badge className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 mt-1 sm:mt-2">
                        STEP {currentStep + 1} OF {steps.length}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Step indicator dots - Hidden on very small screens */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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

              {/* Content - Scrollable area with better mobile spacing */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 sm:p-6 lg:p-8 pb-2 sm:pb-4 space-y-4 sm:space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center">
                    <p className="walkthrough-body text-sm sm:text-base">
                      {currentStepData.description}
                    </p>
                    
                    <p className="walkthrough-body max-w-md text-xs sm:text-sm">
                      {currentStepData.detail}
                    </p>
                  </div>

                  {/* Enhanced Step-specific Content - Responsive */}
                  <div className="window-card p-3 sm:p-4 lg:p-6 bg-background-secondary min-h-[180px] sm:min-h-[200px]">
                    {/* Step 1: Campaign Creation Flow */}
                    {currentStep === 0 && (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-center mb-3 sm:mb-4">
                          <p className="walkthrough-body text-xs sm:text-sm">CAMPAIGN CREATION INTERFACE</p>
                        </div>
                        
                        {/* Simplified Campaign Builder */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="window-card p-3 sm:p-4 bg-white">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              <h3 className="walkthrough-body text-xs sm:text-sm font-medium">NEW CAMPAIGN</h3>
                            </div>
                            
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <label className="walkthrough-body text-xs">CAMPAIGN TITLE</label>
                                <Input
                                  value="Gaming Highlights Compilation"
                                  className="input-retro text-center text-xs sm:text-sm mt-1"
                                  readOnly
                                  style={{ fontFamily: 'var(--font-primary)', fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0.01em', color: 'var(--muted-foreground)' }}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="walkthrough-body text-xs">BUDGET</label>
                                  <Input
                                    value="$750 AUD"
                                    className="input-retro text-center text-xs sm:text-sm mt-1"
                                    readOnly
                                    style={{ fontFamily: 'var(--font-primary)', fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0.01em', color: 'var(--muted-foreground)' }}
                                  />
                                </div>
                                <div>
                                  <label className="walkthrough-body text-xs">DEADLINE</label>
                                  <Input
                                    value="7 days"
                                    className="input-retro text-center text-xs sm:text-sm mt-1"
                                    readOnly
                                    style={{ fontFamily: 'var(--font-primary)', fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0.01em', color: 'var(--muted-foreground)' }}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                                <Badge className="hashtag-gaming text-xs px-2 py-1">#gaming</Badge>
                                <Badge className="hashtag-reaction text-xs px-2 py-1">#reaction</Badge>
                                <Badge className="hashtag-livestream text-xs px-2 py-1">#highlights</Badge>
                              </div>
                              
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button className="w-full btn-primary text-xs sm:text-sm py-2 sm:py-3">
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  LAUNCH CAMPAIGN
                                </Button>
                              </motion.div>
                            </div>
                          </div>

                          {/* Live Campaigns Preview - Responsive scroll */}
                          <div className="overflow-hidden">
                            <motion.div
                              className="flex space-x-2 sm:space-x-3"
                              animate={{ x: [-10, -300] }}
                              transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              {[...mockCampaigns.slice(0, 4), ...mockCampaigns.slice(0, 4)].map((campaign, index) => (
                                <motion.div
                                  key={`${campaign.title}-${index}`}
                                  className="flex-shrink-0 w-48 sm:w-56 lg:w-64"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Card className="window-card p-2 sm:p-3 bg-white h-full">
                                    <div className="space-y-1 sm:space-y-2">
                                      <h4 className="walkthrough-body text-xs line-clamp-2 font-medium">{campaign.title}</h4>
                                      <div className="flex justify-between items-center">
                                        <Badge className="status-approved text-xs px-1 sm:px-2 py-1">{campaign.status}</Badge>
                                        <span className="walkthrough-body text-xs">{campaign.timeLeft}</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="walkthrough-body">{campaign.submissions} submissions</span>
                                        <span className="walkthrough-body text-status-approved">${campaign.budget}</span>
                                      </div>
                                    </div>
                                  </Card>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-3 sm:mt-4">
                          <p className="walkthrough-body text-xs sm:text-sm">
                            💡 <strong className="walkthrough-body">Pro Tip:</strong> Higher budgets attract more quality submissions from top clippers!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Analytics & Insights Dashboard */}
                    {currentStep === 1 && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="text-center mb-4 sm:mb-6">
                          <p className="walkthrough-body text-xs sm:text-sm">ANALYTICS DASHBOARD</p>
                        </div>
                        
                        {/* Animated Metrics Cards - Responsive grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                          <motion.div
                            className="window-card p-2 sm:p-3 text-center bg-primary/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-primary" />
                            <div className="walkthrough-body text-primary text-sm sm:text-base font-medium">{animatedCampaigns}</div>
                            <div className="walkthrough-body text-xs">Active</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-2 sm:p-3 text-center bg-secondary/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                          >
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-secondary" />
                            <div className="walkthrough-body text-secondary text-sm sm:text-base font-medium">{animatedSubmissions}</div>
                            <div className="walkthrough-body text-xs">Submissions</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-2 sm:p-3 text-center bg-status-approved/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                          >
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-status-approved" />
                            <div className="walkthrough-body text-status-approved text-sm sm:text-base font-medium">${formatNumber(animatedSpent)}</div>
                            <div className="walkthrough-body text-xs">Spent</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-2 sm:p-3 text-center bg-status-pending/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                          >
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-status-pending" />
                            <div className="walkthrough-body text-status-pending text-sm sm:text-base font-medium">${animatedCPM.toFixed(2)}</div>
                            <div className="walkthrough-body text-xs">CPM</div>
                          </motion.div>
                        </div>

                        {/* AI Recommendations Preview */}
                        <div className="window-card p-3 sm:p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                            <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            <h4 className="walkthrough-body text-xs sm:text-sm font-medium">AI RECOMMENDATIONS</h4>
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            {mockRecommendations.map((rec, index) => (
                              <motion.div
                                key={index}
                                className="p-2 bg-background-secondary rounded border border-primary/20"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.5 }}
                              >
                                <div className="flex items-center justify-between">
                                  <p className="walkthrough-body text-xs line-clamp-1 flex-1 pr-2">{rec.title}</p>
                                  <Badge className="text-xs px-1 sm:px-2 py-1 bg-primary/20 text-primary flex-shrink-0">
                                    {rec.impact}
                                  </Badge>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Campaign Performance Chart */}
                        <div className="window-card p-3 sm:p-4 bg-white">
                          <h4 className="walkthrough-body mb-2 sm:mb-3 text-xs sm:text-sm font-medium">CAMPAIGN PERFORMANCE</h4>
                          <div className="space-y-2">
                            {mockCampaigns.slice(0, 3).map((campaign, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                                <div className="flex-1 min-w-0">
                                  <p className="walkthrough-body text-xs truncate">{campaign.title}</p>
                                  <div className="w-full bg-muted rounded-full h-1.5 sm:h-2 mt-1">
                                    <motion.div
                                      className="bg-status-approved h-1.5 sm:h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(campaign.submissions / 35) * 100}%` }}
                                      transition={{ duration: 1, delay: index * 0.3 }}
                                    />
                                  </div>
                                </div>
                                <div className="text-right ml-2 sm:ml-3 flex-shrink-0">
                                  <div className="walkthrough-body text-xs font-medium">{campaign.submissions}</div>
                                  <div className="walkthrough-body text-xs text-muted-foreground">submissions</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="walkthrough-body text-xs sm:text-sm">
                            📊 <strong className="walkthrough-body">Pro Tip:</strong> Use AI recommendations to optimize campaign performance and increase submissions!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Payout Management */}
                    {currentStep === 2 && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="text-center mb-4 sm:mb-6">
                          <p className="walkthrough-body text-xs sm:text-sm">PAYOUT MANAGEMENT</p>
                        </div>
                        
                        {/* Escrow Status */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          <motion.div
                            className="window-card p-2 sm:p-4 text-center bg-status-pending/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="walkthrough-body text-status-pending text-sm sm:text-base font-medium">${formatNumber(2980)}</div>
                            <div className="walkthrough-body text-xs">Funds Held</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-2 sm:p-4 text-center bg-status-approved/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                          >
                            <div className="walkthrough-body text-status-approved text-sm sm:text-base font-medium">${formatNumber(1065)}</div>
                            <div className="walkthrough-body text-xs">Funds Released</div>
                          </motion.div>
                          
                          <motion.div
                            className="window-card p-2 sm:p-4 text-center bg-secondary/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                          >
                            <div className="walkthrough-body text-secondary text-sm sm:text-base font-medium">${formatNumber(205)}</div>
                            <div className="walkthrough-body text-xs">Pending</div>
                          </motion.div>
                        </div>

                        {/* Budget Pacing */}
                        <div className="window-card p-3 sm:p-4 bg-white">
                          <h4 className="walkthrough-body mb-2 sm:mb-3 text-xs sm:text-sm font-medium">BUDGET PACING</h4>
                          <div className="space-y-2 sm:space-y-3">
                            {['Gaming Highlights', 'Cooking Tutorial', 'Tech Reviews'].map((campaign, index) => {
                              const budgetUsed = [65, 45, 80][index];
                              const timeElapsed = [70, 60, 75][index];
                              const isOnTrack = Math.abs(budgetUsed - timeElapsed) < 15;
                              
                              return (
                                <div key={campaign} className="space-y-1 sm:space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="walkthrough-body text-xs font-medium truncate flex-1 pr-2">{campaign}</span>
                                    <Badge className={`text-xs px-1 sm:px-2 py-1 flex-shrink-0 ${
                                      isOnTrack ? 'status-approved' : 
                                      budgetUsed > timeElapsed ? 'status-pending' : 'status-rejected'
                                    }`}>
                                      {isOnTrack ? 'ON TRACK' : budgetUsed > timeElapsed ? 'FAST' : 'SLOW'}
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="walkthrough-body">Budget Used</span>
                                      <span className="walkthrough-body">{budgetUsed}%</span>
                                    </div>
                                    <Progress value={budgetUsed} className="h-1.5 sm:h-2" />
                                    
                                    <div className="flex justify-between text-xs">
                                      <span className="walkthrough-body">Time Elapsed</span>
                                      <span className="walkthrough-body">{timeElapsed}%</span>
                                    </div>
                                    <Progress value={timeElapsed} className="h-1.5 sm:h-2 opacity-60" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="window-card p-3 sm:p-4 bg-white">
                          <h4 className="walkthrough-body mb-2 sm:mb-3 text-xs sm:text-sm font-medium">QUICK ACTIONS</h4>
                          <div className="grid grid-cols-2 gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" className="text-xs py-2">
                              <Rocket className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Boost Budget</span>
                              <span className="sm:hidden">Boost</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs py-2">
                              <Target className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Extend Deadline</span>
                              <span className="sm:hidden">Extend</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs py-2">
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">View Analytics</span>
                              <span className="sm:hidden">Analytics</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs py-2">
                              <Bell className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Set Alerts</span>
                              <span className="sm:hidden">Alerts</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="walkthrough-body text-xs sm:text-sm">
                            💰 <strong className="walkthrough-body">Pro Tip:</strong> Smart escrow ensures fair payouts while protecting your budget from overspending!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Navigation - Always Visible with enhanced responsive design */}
              <div className="flex-shrink-0 bg-white border-t-2 border-foreground p-3 sm:p-4 lg:p-6">
                {/* Mobile layout - Stack buttons vertically on very small screens */}
                <div className="block sm:hidden space-y-2">
                  <div className="flex justify-between items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="btn-secondary-cyan flex items-center justify-center space-x-1 px-3 py-2 text-retro-display text-xs flex-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{currentStep > 0 ? 'BACK' : 'SKIP'}</span>
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      className="btn-primary flex items-center justify-center space-x-1 px-3 py-2 text-retro-display text-xs flex-1"
                    >
                      <span>
                        {currentStep < steps.length - 1 ? 'NEXT' : 'START'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Skip to Dashboard button - full width on mobile */}
                  <Button
                    variant="outline"
                    onClick={onSkip}
                    className="w-full border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center space-x-2 px-3 py-2 text-retro-display text-xs"
                  >
                    <X className="w-3 h-3" />
                    <span>SKIP TO DASHBOARD</span>
                  </Button>
                </div>

                {/* Desktop layout - Original horizontal layout */}
                <div className="hidden sm:flex justify-between items-center">
                  <div className="flex space-x-2 sm:space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="btn-secondary-cyan flex items-center space-x-2 px-4 sm:px-6 text-retro-display text-sm"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{currentStep > 0 ? 'BACK' : 'SKIP'}</span>
                    </Button>
                    
                    {/* Additional Skip to Dashboard button - always visible */}
                    <Button
                      variant="outline"
                      onClick={onSkip}
                      className="border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-2 px-3 sm:px-4 text-retro-display text-sm"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">SKIP TO DASHBOARD</span>
                      <span className="md:hidden">SKIP</span>
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    className="btn-primary flex items-center space-x-2 px-4 sm:px-6 text-retro-display text-sm"
                  >
                    <span>
                      {currentStep < steps.length - 1 ? 'NEXT' : 'START CREATING'}
                    </span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>

                {/* Step indicator for mobile - shown at bottom */}
                <div className="sm:hidden flex justify-center items-center space-x-2 mt-2 pt-2 border-t border-muted">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'bg-primary scale-125' 
                          : index < currentStep 
                          ? 'bg-primary/70' 
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}