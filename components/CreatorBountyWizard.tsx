'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Play, Zap, Target, Clock, Calendar as CalendarIcon, Hash, Users, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import type { User } from '../App';

interface CreatorBountyWizardProps {
  onComplete: (bountyData: any) => void;
  onBack: () => void;
  user: User;
}

export function CreatorBountyWizard({ onComplete, onBack, user }: CreatorBountyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bountyType, setBountyType] = useState<'frenzy' | 'challenge' | 'daily' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  const totalSteps = 6;

  const bountyTypes = [
    {
      id: 'frenzy',
      name: 'FRENZY',
      budget: '$100k',
      description: 'Massive viral campaign with unlimited submissions',
      color: 'bg-status-winner-1st',
      icon: Flame,
      features: ['Unlimited clips', 'Viral optimization', 'Premium promotion']
    },
    {
      id: 'challenge',
      name: 'CHALLENGE',
      budget: '$10k',
      description: 'Targeted competition with specific goals',
      color: 'bg-secondary',
      icon: Target,
      features: ['Competition format', 'Leaderboard tracking', 'Winner rewards']
    },
    {
      id: 'daily',
      name: 'DAILY',
      budget: 'Daily budget',
      description: 'Ongoing content stream with daily payouts',
      color: 'bg-primary',
      icon: Clock,
      features: ['Continuous content', 'Daily winners', 'Steady growth']
    }
  ];

  const availableHashtags = [
    'Gaming', 'Comedy', 'Tutorial', 'Music', 'Podcast', 'Reaction', 
    'Livestream', 'Sports', 'Tech', 'Cooking', 'Entertainment'
  ];

  const availablePlatforms = [
    'YouTube Shorts', 'TikTok', 'Instagram Reels', 'Twitter/X', 'Snapchat'
  ];

  const availableRequirements = [
    'Family-friendly content', 'Original clips only', 'Include brand mention',
    'Minimum 60 seconds', 'Maximum 30 seconds', 'High-energy content',
    'Trending audio only', 'No copyrighted music'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = () => {
    const bountyData = {
      type: bountyType,
      title,
      description,
      amount: parseInt(amount),
      deadline,
      hashtags,
      platform,
      requirements,
      creatorId: user.id
    };
    onComplete(bountyData);
  };

  const toggleHashtag = (tag: string) => {
    setHashtags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const togglePlatform = (platformItem: string) => {
    setPlatform(prev => 
      prev.includes(platformItem) 
        ? prev.filter(p => p !== platformItem)
        : [...prev, platformItem]
    );
  };

  const toggleRequirement = (req: string) => {
    setRequirements(prev => 
      prev.includes(req) 
        ? prev.filter(r => r !== req)
        : [...prev, req]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return bountyType !== null;
      case 2: return title.trim().length > 0 && description.trim().length > 0;
      case 3: return amount && parseInt(amount) > 0;
      case 4: return deadline !== undefined;
      case 5: return hashtags.length > 0;
      case 6: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex flex-col">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Play className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-retro-display text-sm">CREATE BOUNTY</span>
          </div>
          
          <div className="text-center">
            <div className="text-retro-display text-sm">STEP {currentStep} OF {totalSteps}</div>
            <div className="w-48 h-2 bg-muted border border-foreground mt-1">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          <Button variant="ghost" onClick={onBack} className="text-retro-nav">
            CANCEL
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Bounty Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">CHOOSE BOUNTY TYPE</h1>
                    <p className="text-muted-foreground">Select the campaign format that fits your goals</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bountyTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`window-card p-6 cursor-pointer transition-all ${
                              bountyType === type.id 
                                ? 'ring-2 ring-primary shadow-glow' 
                                : 'hover:shadow-lg'
                            }`}
                            onClick={() => setBountyType(type.id as any)}
                          >
                            <div className="text-center space-y-4">
                              <motion.div
                                animate={bountyType === type.id ? { rotate: [0, 10, -10, 0] } : {}}
                                transition={{ duration: 0.5 }}
                                className={`w-16 h-16 ${type.color} border-2 border-foreground rounded-lg flex items-center justify-center mx-auto`}
                              >
                                <IconComponent className="w-8 h-8 text-white" />
                              </motion.div>
                              
                              <div>
                                <h3 className="text-retro-display text-lg mb-1">{type.name}</h3>
                                <Badge className="status-approved mb-2">{type.budget}</Badge>
                                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                              </div>
                              
                              <div className="space-y-2">
                                {type.features.map((feature, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span className="text-xs">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Title & Description */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">TITLE & DESCRIPTION</h1>
                    <p className="text-muted-foreground">Make it clear and compelling for clippers</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">BOUNTY TITLE</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-retro"
                        placeholder="Epic Gaming Rage Compilation - High Payout"
                        maxLength={100}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {title.length}/100 characters
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">DESCRIPTION</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-retro min-h-32"
                        placeholder="Looking for the most intense gaming rage moments from streamers. High-engagement content that drives significant viewership and monetization. Focus on authentic reactions and perfect timing."
                        maxLength={500}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {description.length}/500 characters
                      </div>
                    </div>

                    {/* Preview */}
                    {title && description && (
                      <div className="window-card p-4 bg-muted/10">
                        <div className="text-xs text-muted-foreground mb-2">PREVIEW:</div>
                        <div className="window-card p-4 bg-white">
                          <h3 className="font-bold text-sm mb-2">{title}</h3>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Bounty Amount */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">BOUNTY AMOUNT</h1>
                    <p className="text-muted-foreground">Set your total budget (AUD)</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <Label htmlFor="amount">TOTAL BUDGET (AUD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="input-retro pl-8 text-center text-2xl font-bold"
                          placeholder="750"
                          min="50"
                          max="100000"
                        />
                      </div>
                    </div>

                    {/* Suggested Amounts */}
                    <div>
                      <Label className="text-xs">POPULAR AMOUNTS:</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[250, 500, 750, 1000, 2500, 5000].map((suggestedAmount) => (
                          <Button
                            key={suggestedAmount}
                            variant={amount === suggestedAmount.toString() ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setAmount(suggestedAmount.toString())}
                            className={amount === suggestedAmount.toString() ? "btn-primary" : ""}
                          >
                            ${suggestedAmount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Breakdown Preview */}
                    {amount && parseInt(amount) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="window-card p-4 bg-primary/10 border-primary/30"
                      >
                        <div className="text-center space-y-2">
                          <TrendingUp className="w-6 h-6 text-primary mx-auto" />
                          <div className="text-sm font-bold">ESTIMATED RESULTS</div>
                          <div className="text-xs text-muted-foreground">
                            ~{Math.floor(parseInt(amount) / 50)} winning clips • 
                            {Math.floor(parseInt(amount) * 2000)} estimated views
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Deadline */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">SET DEADLINE</h1>
                    <p className="text-muted-foreground">When should submissions close?</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal input-retro"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={setDeadline}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Quick Options */}
                    <div>
                      <Label className="text-xs">QUICK OPTIONS:</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {[
                          { label: '1 WEEK', days: 7 },
                          { label: '2 WEEKS', days: 14 },
                          { label: '1 MONTH', days: 30 },
                          { label: '2 MONTHS', days: 60 }
                        ].map((option) => (
                          <Button
                            key={option.days}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const date = new Date();
                              date.setDate(date.getDate() + option.days);
                              setDeadline(date);
                            }}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Deadline Info */}
                    {deadline && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="window-card p-4 bg-info/10 border-info/30"
                      >
                        <div className="text-center">
                          <Clock className="w-6 h-6 text-vibrant-blue mx-auto mb-2" />
                          <div className="text-sm font-bold">
                            {Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to collect clips
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Gives clippers time to create quality content
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Requirements */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">REQUIREMENTS</h1>
                    <p className="text-muted-foreground">Set hashtags, platforms, and content rules</p>
                  </div>

                  <div className="space-y-8">
                    {/* Hashtags */}
                    <div>
                      <Label className="flex items-center space-x-2 mb-4">
                        <Hash className="w-4 h-4" />
                        <span>HASHTAGS (REQUIRED)</span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {availableHashtags.map((tag) => (
                          <Button
                            key={tag}
                            variant={hashtags.includes(tag) ? "default" : "ghost"}
                            size="sm"
                            onClick={() => toggleHashtag(tag)}
                            className={`${hashtags.includes(tag) ? `hashtag-${tag.toLowerCase()}` : ''} text-xs`}
                          >
                            #{tag}
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Selected: {hashtags.length} tags
                      </div>
                    </div>

                    {/* Platforms */}
                    <div>
                      <Label className="flex items-center space-x-2 mb-4">
                        <Users className="w-4 h-4" />
                        <span>PLATFORMS (OPTIONAL)</span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {availablePlatforms.map((platformItem) => (
                          <Button
                            key={platformItem}
                            variant={platform.includes(platformItem) ? "default" : "ghost"}
                            size="sm"
                            onClick={() => togglePlatform(platformItem)}
                            className={platform.includes(platformItem) ? "btn-primary" : ""}
                          >
                            {platformItem}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Content Requirements */}
                    <div>
                      <Label className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>CONTENT RULES (OPTIONAL)</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableRequirements.map((req) => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={req}
                              checked={requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setRequirements([...requirements, req]);
                                } else {
                                  setRequirements(requirements.filter(r => r !== req));
                                }
                              }}
                            />
                            <Label htmlFor={req} className="text-xs cursor-pointer">
                              {req}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 6: Review & Publish */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="window-card p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-retro-display text-2xl mb-2">REVIEW & PUBLISH</h1>
                    <p className="text-muted-foreground">Final check before your bounty goes live</p>
                  </div>

                  <div className="window-card p-6 bg-white space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-retro-display text-lg mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hashtags.map((tag) => (
                            <Badge key={tag} className={`hashtag-${tag.toLowerCase()} text-xs`}>
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Type:</div>
                            <div className="font-bold">{bountyType?.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Budget:</div>
                            <div className="font-bold text-status-approved">${amount} AUD</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Deadline:</div>
                            <div className="font-bold">{deadline ? format(deadline, "MMM dd, yyyy") : 'Not set'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Platforms:</div>
                            <div className="font-bold">{platform.length > 0 ? platform.join(', ') : 'Any'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>BACK</span>
            </Button>

            <Button
              onClick={currentStep === totalSteps ? handleComplete : handleNext}
              className="btn-primary flex items-center space-x-2"
              disabled={!canProceed()}
            >
              <span>{currentStep === totalSteps ? 'PUBLISH BOUNTY' : 'NEXT'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}