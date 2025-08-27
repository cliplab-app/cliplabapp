'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft,
  Zap, 
  Eye, 
  Target, 
  Crown, 
  DollarSign, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Flame,
  TrendingUp,
  Users,
  Play,
  BarChart3,
  Rocket,
  Youtube,
  Twitter,
  Instagram,
  Video
} from 'lucide-react';
import { User } from '../App';

interface CampaignCreationPageProps {
  user: User;
  onBack: () => void;
  onCreateCampaign: (campaignData: any) => void;
}

type CampaignMode = 'velocity' | 'reach' | 'select' | null;

export function CampaignCreationPage({ user, onBack, onCreateCampaign }: CampaignCreationPageProps) {
  const [currentStep, setCurrentStep] = useState<'type' | 'details' | 'confirm'>('type');
  const [selectedMode, setSelectedMode] = useState<CampaignMode>(null);
  
  // Campaign details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('7');
  
  // Reach campaign specific settings
  const [customCpm, setCustomCpm] = useState('1.50');
  const [platformSettings, setPlatformSettings] = useState({
    youtubeShorts: { enabled: true, cpm: '1.50', allocation: 40 },
    tiktok: { enabled: true, cpm: '1.20', allocation: 30 },
    x: { enabled: false, cpm: '2.00', allocation: 15 },
    reels: { enabled: true, cpm: '1.80', allocation: 15 }
  });

  const campaignTypes = [
    {
      id: 'velocity' as CampaignMode,
      title: 'Velocity',
      icon: Zap,
      color: 'bg-secondary',
      gradient: 'from-secondary to-secondary-alt',
      description: 'Fast viral content with competition-based rewards',
      detailedDesc: 'Perfect for product launches, marketing bursts, or when you need instant viral momentum. Top performers compete for fixed prize pools.',
      benefit: 'Top 3 performers share fixed prize pool',
      features: ['Fixed competition timeline', 'Engagement-based scoring', 'Instant viral potential', 'Performance leaderboards'],
      useCase: 'Marketing bursts, product launches, trend capitalizing',
      price: 'From $500',
      recommended: false
    },
    {
      id: 'reach' as CampaignMode,
      title: 'Reach',
      icon: Eye,
      color: 'bg-status-pending',
      gradient: 'from-status-pending to-primary-alt',
      description: 'Pay per view with verified performance tracking',
      detailedDesc: 'Low-risk, performance-based model. Only pay for actual verified views delivered. Perfect for consistent, scalable content distribution.',
      benefit: 'Only pay for actual views delivered',
      features: ['Pay-per-view model', 'Verified view tracking', 'Budget control', 'Scalable reach'],
      useCase: 'Long-tail promotion, passive growth, budget optimization',
      price: 'From $1.50 CPM',
      recommended: true
    },
    {
      id: 'select' as CampaignMode,
      title: 'Select',
      icon: Target,
      color: 'bg-primary',
      gradient: 'from-primary to-status-approved',
      description: 'Hand-picked winners based on brand quality',
      detailedDesc: 'Complete creative control over content selection. Perfect for brand-safe content where quality and alignment matter more than pure viral metrics.',
      benefit: 'Complete creative control over selection',
      features: ['Manual content review', 'Brand safety focus', 'Quality over quantity', 'Creative alignment'],
      useCase: 'Brand-safe content, premium quality, specific messaging',
      price: 'From $300',
      recommended: false
    }
  ];

  const handleNext = () => {
    if (currentStep === 'type' && selectedMode) {
      setCurrentStep('details');
    } else if (currentStep === 'details' && isDetailsValid()) {
      setCurrentStep('confirm');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('type');
    } else if (currentStep === 'confirm') {
      setCurrentStep('details');
    }
  };

  const isDetailsValid = () => {
    return title.trim() && description.trim() && contentUrl.trim() && budget.trim();
  };

  const handlePlatformToggle = (platform: string) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        enabled: !prev[platform as keyof typeof prev].enabled
      }
    }));
  };

  const handlePlatformCpmChange = (platform: string, cpm: string) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        cpm
      }
    }));
  };

  const handlePlatformAllocationChange = (platform: string, allocation: number) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        allocation
      }
    }));
  };

  const getEnabledPlatforms = () => {
    return Object.entries(platformSettings).filter(([_, settings]) => settings.enabled);
  };

  const calculatePlatformSpend = (platform: string) => {
    const settings = platformSettings[platform as keyof typeof platformSettings];
    const totalBudget = parseInt(budget || '750');
    const platformBudget = (totalBudget * settings.allocation) / 100;
    const expectedViews = Math.floor(platformBudget / parseFloat(settings.cpm));
    return { platformBudget, expectedViews };
  };

  const handleLaunch = () => {
    if (!selectedMode || !isDetailsValid()) return;

    // Create campaign data based on selected mode
    const campaignData = {
      mode: selectedMode,
      bountyDetails: {
        title,
        description,
        hashtags: ['Campaign'], // Default hashtag
        difficulty: 'Medium',
        featured: false
      },
      data: {
        budget,
        duration,
        contentUrl,
        creatorNotes: description,
        // Mode-specific defaults
        ...(selectedMode === 'velocity' && {
          firstPlace: '50',
          secondPlace: '30', 
          thirdPlace: '20',
          viewsWeight: 50,
          likesWeight: 30,
          commentsWeight: 20
        }),
        ...(selectedMode === 'reach' && {
          cpmRate: customCpm,
          minViews: '10000',
          campaignDuration: duration,
          platformSettings: platformSettings
        }),
        ...(selectedMode === 'select' && {
          numWinners: '3',
          submissionDeadline: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          reviewPeriod: '3',
          selectionCriteria: ['originality', 'brand-safety']
        })
      }
    };

    onCreateCampaign(campaignData);
    
    // Reset form
    setCurrentStep('type');
    setSelectedMode(null);
    setTitle('');
    setDescription('');
    setContentUrl('');
    setBudget('');
    setDuration('7');
    setCustomCpm('1.50');
    setPlatformSettings({
      youtubeShorts: { enabled: true, cpm: '1.50', allocation: 40 },
      tiktok: { enabled: true, cpm: '1.20', allocation: 30 },
      x: { enabled: false, cpm: '2.00', allocation: 15 },
      reels: { enabled: true, cpm: '1.80', allocation: 15 }
    });
  };

  const getSelectedCampaign = () => campaignTypes.find(t => t.id === selectedMode);

  const getStepProgress = () => {
    switch (currentStep) {
      case 'type': return 33;
      case 'details': return 66;
      case 'confirm': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={currentStep === 'type' ? onBack : handleBack}
                className="btn-secondary-cyan px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-retro-display text-2xl">CLIPLAB</span>
                  <div className="text-xs text-muted-foreground">Campaign Creator</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-retro-display text-2xl">CLIPLAB</span>
                <div className="text-xs text-muted-foreground">Campaign Creator</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-retro-display text-lg">CAMPAIGN SETUP</span>
            <span className="text-retro-mono text-sm">
              STEP {currentStep === 'type' ? '1' : currentStep === 'details' ? '2' : '3'} OF 3
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 border-2 border-foreground">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-retro-mono">
            <span className={currentStep === 'type' ? 'text-primary' : 'text-muted-foreground'}>Campaign Type</span>
            <span className={currentStep === 'details' ? 'text-primary' : 'text-muted-foreground'}>Campaign Details</span>
            <span className={currentStep === 'confirm' ? 'text-primary' : 'text-muted-foreground'}>Launch Campaign</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Step 1: Campaign Type Selection */}
        {currentStep === 'type' && (
          <>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl text-retro-display mb-6">
                CHOOSE YOUR<br />
                <span className="color-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CAMPAIGN TYPE</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Select the campaign strategy that best fits your content goals and budget. Each type is optimized for different outcomes and creator needs.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {campaignTypes.map((type, index) => {
                const IconComponent = type.icon;
                const isSelected = selectedMode === type.id;
                
                return (
                  <Card 
                    key={type.id}
                    className={`window-card p-0 cursor-pointer transition-all duration-300 overflow-hidden relative ${
                      isSelected ? 'border-primary border-4 shadow-glow transform scale-105' : 'hover:shadow-lg hover:-translate-y-2'
                    }`}
                    onClick={() => setSelectedMode(type.id)}
                  >
                    {/* Recommended Badge */}
                    {type.recommended && (
                      <div className="absolute -top-3 -right-3 z-10">
                        <Badge className="status-winner-1st px-3 py-1 shadow-glow">
                          <Crown className="w-3 h-3 mr-1" />
                          RECOMMENDED
                        </Badge>
                      </div>
                    )}

                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${type.gradient} border-b-2 border-foreground px-8 py-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <IconComponent className="w-8 h-8 text-white" />
                          <h3 className="text-retro-display text-2xl text-white">{type.title}</h3>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <p className="text-white/90 mt-2 text-sm">{type.description}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {type.detailedDesc}
                      </p>
                      
                      {/* Key Benefit */}
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-retro-display text-sm mb-1">KEY BENEFIT</h4>
                            <p className="text-sm">{type.benefit}</p>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-retro-display text-sm mb-3">FEATURES</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {type.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-secondary rounded-full" />
                              <span className="text-xs">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Use Case */}
                      <div>
                        <h4 className="text-retro-display text-sm mb-2">BEST FOR</h4>
                        <p className="text-xs text-muted-foreground">{type.useCase}</p>
                      </div>


                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button 
                onClick={handleNext}
                disabled={!selectedMode}
                className={`px-16 py-4 text-lg transition-all duration-300 ${
                  selectedMode 
                    ? 'btn-primary shadow-glow' 
                    : 'bg-muted text-muted-foreground border-2 border-muted cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:transform-none hover:shadow-none'
                }`}
              >
                {selectedMode ? 'CONTINUE TO DETAILS' : 'SELECT A CAMPAIGN TYPE'}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>


          </>
        )}

        {/* Step 2: Campaign Details */}
        {currentStep === 'details' && selectedMode && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl text-retro-display mb-6">
                SETUP YOUR<br />
                <span className="color-block">{getSelectedCampaign()?.title.toUpperCase()} CAMPAIGN</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Configure your campaign details and budget to start amplifying your content.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Campaign Information */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="window-card p-8">
                  <h3 className="text-retro-display text-xl mb-6 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-primary" />
                    CAMPAIGN INFORMATION
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label className="text-retro-display mb-3 block">CAMPAIGN TITLE</Label>
                      <Input
                        placeholder="Epic Gaming Moments - Viral Compilation Campaign"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-retro text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Make it descriptive and appealing to attract quality clippers
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-retro-display mb-3 block">CAMPAIGN DESCRIPTION</Label>
                      <Textarea
                        placeholder="Looking for high-energy gaming clips with authentic reactions. Focus on competitive moments, clutch plays, and viral-worthy content that drives engagement..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-retro min-h-[120px] text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Explain what type of content you're looking for and any specific requirements
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-retro-display mb-3 block">CONTENT SOURCE URL</Label>
                      <Input
                        placeholder="https://youtube.com/channel/your-channel or https://twitch.tv/your-stream"
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        className="input-retro text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Link to the content that clippers should extract clips from
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="window-card p-8">
                  <h3 className="text-retro-display text-xl mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-3 text-primary" />
                    BUDGET & TIMELINE
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <Label className="text-retro-display mb-3 block">CAMPAIGN BUDGET (AUD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="750"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="input-retro pl-12 text-base"
                          min="100"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Minimum $100. Higher budgets attract more quality submissions.
                      </p>
                    </div>

                    <div>
                      <Label className="text-retro-display mb-3 block">CAMPAIGN DURATION</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 input-retro text-base"
                        >
                          <option value="3">3 Days - Quick Turnaround</option>
                          <option value="7">7 Days - Balanced Timeline</option>
                          <option value="14">14 Days - Extended Campaign</option>
                          <option value="30">30 Days - Maximum Reach</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Longer campaigns typically get more submissions
                      </p>
                    </div>
                  </div>

                  {/* Reach Campaign Platform Settings */}
                  {selectedMode === 'reach' && (
                    <div className="border-t pt-8">
                      <h4 className="text-retro-display text-lg mb-6 flex items-center">
                        <Video className="w-5 h-5 mr-3 text-secondary" />
                        PLATFORM DISTRIBUTION
                      </h4>

                      <div className="grid gap-6">
                        {/* Platform Selection */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { key: 'youtubeShorts', name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500' },
                            { key: 'tiktok', name: 'TikTok', icon: Video, color: 'text-pink-500' },
                            { key: 'x', name: 'X (Twitter)', icon: Twitter, color: 'text-blue-500' },
                            { key: 'reels', name: 'Instagram Reels', icon: Instagram, color: 'text-purple-500' }
                          ].map(platform => {
                            const IconComponent = platform.icon;
                            const settings = platformSettings[platform.key as keyof typeof platformSettings];
                            
                            return (
                              <Card 
                                key={platform.key}
                                className={`window-card p-4 cursor-pointer transition-all ${
                                  settings.enabled ? 'border-primary border-2 bg-primary/5' : 'opacity-60'
                                }`}
                                onClick={() => handlePlatformToggle(platform.key)}
                              >
                                <div className="text-center">
                                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${platform.color}`} />
                                  <h5 className="text-retro-display text-sm mb-2">{platform.name}</h5>
                                  <div className="text-xs text-muted-foreground mb-3">
                                    {settings.allocation}% allocation
                                  </div>
                                  {settings.enabled && (
                                    <Badge className="status-approved text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      ACTIVE
                                    </Badge>
                                  )}
                                </div>
                              </Card>
                            );
                          })}
                        </div>

                        {/* Platform-specific CPM Settings */}
                        <div className="space-y-4">
                          <h5 className="text-retro-display text-base">PLATFORM CPM RATES</h5>
                          {getEnabledPlatforms().map(([platformKey, settings]) => {
                            const platformInfo = {
                              youtubeShorts: { name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500' },
                              tiktok: { name: 'TikTok', icon: Video, color: 'text-pink-500' },
                              x: { name: 'X (Twitter)', icon: Twitter, color: 'text-blue-500' },
                              reels: { name: 'Instagram Reels', icon: Instagram, color: 'text-purple-500' }
                            }[platformKey as keyof typeof settings];

                            if (!platformInfo) return null;
                            const IconComponent = platformInfo.icon;
                            const { platformBudget, expectedViews } = calculatePlatformSpend(platformKey);
                            
                            return (
                              <div key={platformKey} className="window-card p-4 bg-background-secondary/30">
                                <div className="grid md:grid-cols-4 gap-4 items-center">
                                  <div className="flex items-center space-x-3">
                                    <IconComponent className={`w-5 h-5 ${platformInfo.color}`} />
                                    <span className="text-retro-display text-sm">{platformInfo.name}</span>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">CPM RATE</Label>
                                    <div className="relative">
                                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                      <Input
                                        type="number"
                                        step="0.10"
                                        value={settings.cpm}
                                        onChange={(e) => handlePlatformCpmChange(platformKey, e.target.value)}
                                        className="pl-6 input-retro text-sm"
                                        min="0.50"
                                        max="10.00"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">BUDGET</Label>
                                    <div className="text-retro-display text-sm text-primary">
                                      ${platformBudget.toFixed(0)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {settings.allocation}% of total
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">EXPECTED VIEWS</Label>
                                    <div className="text-retro-display text-sm text-secondary">
                                      {expectedViews.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      views
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Quick Preset CPM Rates */}
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h5 className="text-retro-display text-sm mb-3">QUICK PRESETS</h5>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Economy ($1.00-$1.50)', rates: { youtubeShorts: '1.20', tiktok: '1.00', x: '1.50', reels: '1.30' } },
                              { label: 'Standard ($1.50-$2.00)', rates: { youtubeShorts: '1.50', tiktok: '1.20', x: '2.00', reels: '1.80' } },
                              { label: 'Premium ($2.00-$3.00)', rates: { youtubeShorts: '2.00', tiktok: '1.80', x: '3.00', reels: '2.50' } }
                            ].map((preset, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setPlatformSettings(prev => ({
                                    youtubeShorts: { ...prev.youtubeShorts, cpm: preset.rates.youtubeShorts },
                                    tiktok: { ...prev.tiktok, cpm: preset.rates.tiktok },
                                    x: { ...prev.x, cpm: preset.rates.x },
                                    reels: { ...prev.reels, cpm: preset.rates.reels }
                                  }));
                                }}
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Campaign Preview & Settings */}
              <div className="space-y-6">
                <Card className="window-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <h3 className="text-retro-display text-lg mb-4 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-primary" />
                    {getSelectedCampaign()?.title.toUpperCase()} PREVIEW
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedMode === 'velocity' && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">🥇 1st Place:</span>
                          <span className="text-retro-display text-primary">${Math.floor(parseInt(budget || '750') * 0.5)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">🥈 2nd Place:</span>
                          <span className="text-retro-display text-secondary">${Math.floor(parseInt(budget || '750') * 0.3)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">🥉 3rd Place:</span>
                          <span className="text-retro-display text-secondary-alt">${Math.floor(parseInt(budget || '750') * 0.2)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3 p-3 bg-secondary/10 rounded">
                          Winners determined by engagement score (views + likes + comments)
                        </div>
                      </>
                    )}
                    {selectedMode === 'reach' && (
                      <>
                        <div className="space-y-3 mb-4">
                          <h4 className="text-retro-display text-sm">PLATFORM BREAKDOWN</h4>
                          {getEnabledPlatforms().map(([platformKey, settings]) => {
                            const platformInfo = {
                              youtubeShorts: { name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500' },
                              tiktok: { name: 'TikTok', icon: Video, color: 'text-pink-500' },
                              x: { name: 'X (Twitter)', icon: Twitter, color: 'text-blue-500' },
                              reels: { name: 'Instagram Reels', icon: Instagram, color: 'text-purple-500' }
                            }[platformKey as keyof typeof settings];

                            if (!platformInfo) return null;
                            const IconComponent = platformInfo.icon;
                            const { platformBudget, expectedViews } = calculatePlatformSpend(platformKey);
                            
                            return (
                              <div key={platformKey} className="flex justify-between items-center p-3 bg-card rounded border">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className={`w-4 h-4 ${platformInfo.color}`} />
                                  <span className="text-sm">{platformInfo.name}:</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-retro-display text-primary text-sm">{expectedViews.toLocaleString()} views</div>
                                  <div className="text-xs text-muted-foreground">${settings.cpm} CPM</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-primary/10 rounded border-2 border-primary/30">
                          <span className="text-sm text-retro-display">TOTAL REACH:</span>
                          <span className="text-retro-display text-primary">
                            {getEnabledPlatforms().reduce((total, [platformKey]) => {
                              const { expectedViews } = calculatePlatformSpend(platformKey);
                              return total + expectedViews;
                            }, 0).toLocaleString()} views
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-3 p-3 bg-secondary/10 rounded">
                          Only pay for verified views above 10K threshold per platform
                        </div>
                      </>
                    )}
                    {selectedMode === 'select' && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">Winners Selected:</span>
                          <span className="text-retro-display">3</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">Review Period:</span>
                          <span className="text-retro-display">3 days</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-card rounded border">
                          <span className="text-sm">Avg Payout:</span>
                          <span className="text-retro-display text-primary">${Math.floor(parseInt(budget || '750') / 3)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3 p-3 bg-status-approved/10 rounded">
                          Manual selection based on quality and brand alignment
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="window-card p-6">
                  <h3 className="text-retro-display text-base mb-4">CAMPAIGN STATS</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Expected Submissions:</span>
                      <span className="text-retro-display">{Math.floor(parseInt(budget || '750') / 50)}-{Math.floor(parseInt(budget || '750') / 25)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Campaign Duration:</span>
                      <span className="text-retro-display">{duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span className="text-status-approved">$0 (Beta)</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-retro-display">
                      <span>Total Investment:</span>
                      <span className="text-primary">${parseInt(budget || '0').toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline" className="btn-secondary-cyan px-8 py-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO TYPE
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!isDetailsValid()}
                className="btn-primary px-12 py-3 text-lg"
              >
                {isDetailsValid() ? 'REVIEW & LAUNCH' : 'COMPLETE ALL FIELDS'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Launch Confirmation */}
        {currentStep === 'confirm' && selectedMode && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl text-retro-display mb-6">
                <Rocket className="w-12 h-12 inline mr-4 text-primary" />
                READY TO LAUNCH
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your campaign is configured and ready to go live. Review the details below before launching.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Campaign Overview */}
              <Card className="window-card p-8 bg-gradient-to-br from-primary/10 to-secondary/5">
                <h3 className="text-retro-display text-2xl mb-6">{title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-card rounded border">
                    <span>Content Source:</span>
                    <span className="text-primary font-mono text-sm truncate max-w-48">{contentUrl}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded border">
                    <span>Campaign Type:</span>
                    <Badge className="status-approved">{getSelectedCampaign()?.title}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded border">
                    <span>Duration:</span>
                    <span className="text-retro-display">{duration} days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card rounded border">
                    <span>Expected Launch:</span>
                    <span className="text-retro-display">Immediate</span>
                  </div>
                </div>
              </Card>

              {/* Investment Summary */}
              <Card className="window-card p-8">
                <h3 className="text-retro-display text-2xl mb-6 text-center">INVESTMENT SUMMARY</h3>
                
                <div className="text-center mb-8">
                  <div className="text-5xl text-retro-display text-primary mb-3">
                    ${parseInt(budget).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Total Campaign Budget</div>
                </div>

                <div className="space-y-3 mb-8 text-sm border rounded-lg p-4">
                  <div className="flex justify-between">
                    <span>Campaign Budget:</span>
                    <span>${parseInt(budget).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="text-status-approved">$0 (Beta Period)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="text-status-approved">$0</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-retro-display text-lg">
                    <span>Total Cost:</span>
                    <span className="text-primary">${parseInt(budget).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-6 bg-status-approved/20 rounded-lg text-center mb-6">
                  <h4 className="text-retro-display text-lg mb-2">EXPECTED RESULTS</h4>
                  <div className="text-2xl text-retro-display mb-2">
                    {selectedMode === 'reach' 
                      ? `${getEnabledPlatforms().reduce((total, [platformKey]) => {
                          const { expectedViews } = calculatePlatformSpend(platformKey);
                          return total + expectedViews;
                        }, 0).toLocaleString()} views`
                      : selectedMode === 'velocity'
                      ? `High viral potential`
                      : `Premium quality clips`
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMode === 'reach' 
                      ? `Across ${getEnabledPlatforms().length} platform${getEnabledPlatforms().length !== 1 ? 's' : ''}`
                      : selectedMode === 'velocity'
                      ? 'Competitive engagement scoring'
                      : 'Curated content selection'
                    }
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center p-4 bg-muted/20 rounded">
                  🔒 Your campaign will go live immediately after launch. You can monitor progress and manage submissions from your dashboard.
                </div>
              </Card>
            </div>

            {/* Launch Actions */}
            <div className="flex justify-between items-center">
              <Button onClick={handleBack} variant="outline" className="btn-secondary-cyan px-8 py-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO EDIT
              </Button>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-3">
                  By launching, you agree to our campaign terms and conditions
                </div>
                <Button 
                  onClick={handleLaunch}
                  className="btn-primary px-16 py-4 text-xl shadow-glow hover-glitch"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  LAUNCH CAMPAIGN
                  <Flame className="w-6 h-6 ml-3" />
                </Button>
              </div>

              <div className="w-32" /> {/* Spacer for centering */}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary-cobalt py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-white/90 text-retro-mono">
            {currentStep === 'type' 
              ? 'Choose the campaign strategy that aligns with your content goals and budget preferences.'
              : currentStep === 'details'
              ? 'Configure your campaign to attract the right clippers and maximize your content reach.'
              : 'Your campaign is ready to launch. Start amplifying your content and reaching new audiences.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}