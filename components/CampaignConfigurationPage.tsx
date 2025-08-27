'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Crown, 
  BarChart3,
  Calendar,
  DollarSign,
  Target,
  Plus,
  Trash2,
  Link
} from 'lucide-react';

interface CampaignConfigurationPageProps {
  onBack: () => void;
  onContinue: (campaignData: any) => void;
  selectedCampaignType: 'reach';
  user: any;
}

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  allocation: number;
  cpmRate: number;
  expectedViews: number;
  budget: number;
}

interface ContentSource {
  id: string;
  url: string;
  label: string;
}

export function CampaignConfigurationPage({ 
  onBack, 
  onContinue, 
  selectedCampaignType, 
  user 
}: CampaignConfigurationPageProps) {
  const [campaignTitle, setCampaignTitle] = useState('Epic Gaming Moments - Viral Compilation Campaign');
  const [campaignDescription, setCampaignDescription] = useState('Looking for high-energy gaming clips with authentic reactions. Focus on competitive moments, clutch plays, and viral-worthy content that drives engagement...');
  
  // Changed to support multiple content sources
  const [contentSources, setContentSources] = useState<ContentSource[]>([
    {
      id: '1',
      url: 'https://youtube.com/channel/your-channel',
      label: 'Main YouTube Channel'
    },
    {
      id: '2', 
      url: 'https://twitch.tv/your-stream',
      label: 'Twitch Stream'
    }
  ]);
  
  const [totalBudget, setTotalBudget] = useState(750);
  const [campaignDuration, setCampaignDuration] = useState('7-days-balanced');

  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    {
      id: 'youtube-shorts',
      name: 'YOUTUBE SHORTS',
      icon: '▶',
      isActive: true,
      allocation: 40,
      cpmRate: 1.50,
      expectedViews: 200000, // Will be recalculated
      budget: 300
    },
    {
      id: 'tiktok',
      name: 'TIKTOK',
      icon: '🎵',
      isActive: true,
      allocation: 30,
      cpmRate: 1.20,
      expectedViews: 187500, // Will be recalculated
      budget: 225
    },
    {
      id: 'twitter',
      name: 'X (TWITTER)',
      icon: '🐦',
      isActive: false,
      allocation: 15,
      cpmRate: 2.00,
      expectedViews: 56250, // Will be recalculated
      budget: 112.5
    },
    {
      id: 'instagram-reels',
      name: 'INSTAGRAM REELS',
      icon: '📷',
      isActive: true,
      allocation: 15,
      cpmRate: 1.80,
      expectedViews: 62500, // Will be recalculated
      budget: 112.5
    }
  ]);

  // Helper function to calculate views from budget and CPM
  // CPM = Cost Per Mille (1000 views)
  // Formula: Views = (Budget ÷ CPM) × 1000
  const calculateViewsFromBudgetAndCPM = (budget: number, cpmRate: number): number => {
    return Math.round((budget / cpmRate) * 1000);
  };

  // Helper function to calculate budget from allocation
  const calculateBudgetFromAllocation = (allocation: number, totalBudget: number): number => {
    return (allocation / 100) * totalBudget;
  };

  // Calculate totals
  const activePlatforms = platforms.filter(p => p.isActive);
  const totalExpectedViews = activePlatforms.reduce((sum, p) => sum + p.expectedViews, 0);
  const totalActiveBudget = activePlatforms.reduce((sum, p) => sum + p.budget, 0);

  // Update platform calculations when budget changes
  useEffect(() => {
    const activePlatformCount = platforms.filter(p => p.isActive).length;
    if (activePlatformCount === 0) return;

    const updatedPlatforms = platforms.map(platform => {
      if (!platform.isActive) return platform;
      
      const budgetShare = calculateBudgetFromAllocation(platform.allocation, totalBudget);
      const expectedViews = calculateViewsFromBudgetAndCPM(budgetShare, platform.cpmRate);
      
      return {
        ...platform,
        budget: budgetShare,
        expectedViews
      };
    });

    setPlatforms(updatedPlatforms);
  }, [totalBudget]);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleCpmChange = (platformId: string, newCpm: number) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        const expectedViews = calculateViewsFromBudgetAndCPM(p.budget, newCpm);
        return { ...p, cpmRate: newCpm, expectedViews };
      }
      return p;
    }));
  };

  // Content source management functions
  const addContentSource = () => {
    const newSource: ContentSource = {
      id: Date.now().toString(),
      url: '',
      label: ''
    };
    setContentSources(prev => [...prev, newSource]);
  };

  const removeContentSource = (id: string) => {
    if (contentSources.length > 1) {
      setContentSources(prev => prev.filter(source => source.id !== id));
    }
  };

  const updateContentSource = (id: string, field: 'url' | 'label', value: string) => {
    setContentSources(prev => prev.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  // Format large numbers for display
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(0) + 'K';
    }
    return views.toString();
  };

  const handleContinue = () => {
    const campaignData = {
      mode: selectedCampaignType,
      data: {
        title: campaignTitle,
        description: campaignDescription,
        contentSources: contentSources.filter(source => source.url.trim() !== ''),
        budget: totalBudget,
        duration: campaignDuration,
        platforms: activePlatforms,
        totalExpectedViews,
        estimatedSubmissions: Math.round(totalExpectedViews * 0.00005) // 0.005% conversion estimate (more realistic)
      }
    };
    
    onContinue(campaignData);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="outline"
            className="btn-secondary-cyan text-sm px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>

          {/* Center Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CLIPLAB</h1>
              <p className="text-xs">Campaign Creator</p>
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary border-2 border-foreground flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-retro-display text-sm">CLIPLAB</h1>
              <p className="text-xs">Campaign Creator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white border-b-2 border-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-retro-display text-lg">CAMPAIGN SETUP</h2>
            <span className="text-retro-display text-sm text-muted-foreground">STEP 2 OF 3</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={66.66} className="h-3 border-2 border-foreground" />
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-sm">
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs text-muted-foreground">Campaign Type</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs">Campaign Details</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-retro-display text-xs text-muted-foreground">Escrow & Launch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-retro-display text-3xl mb-4">
              SETUP YOUR
              <br />
              REACH CAMPAIGN
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure your campaign details and budget to start amplifying your content.
            </p>
          </div>

          {/* Single Column Layout - Made Wider */}
          <div className="space-y-8">
            
            {/* Campaign Information Card */}
            <Card className="window-card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-retro-display text-lg">CAMPAIGN INFORMATION</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Campaign Title */}
                  <div>
                    <Label className="text-retro-display text-sm mb-2 block">CAMPAIGN TITLE</Label>
                    <Input
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      className="input-retro"
                      placeholder="Enter campaign title..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Make it descriptive and appealing to attract quality clippers
                    </p>
                  </div>

                  {/* Campaign Description */}
                  <div>
                    <Label className="text-retro-display text-sm mb-2 block">CAMPAIGN DESCRIPTION</Label>
                    <Textarea
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      className="input-retro min-h-[120px] resize-none"
                      placeholder="Describe what type of content you're looking for..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Explain what type of content you're looking for and any specific requirements
                    </p>
                  </div>
                </div>

                <div>
                  {/* Content Source URLs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-retro-display text-sm">CONTENT SOURCE URLs</Label>
                      <Button
                        type="button"
                        onClick={addContentSource}
                        variant="outline"
                        size="sm"
                        className="btn-secondary-cyan text-xs px-3 py-1"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        ADD SOURCE
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {contentSources.map((source, index) => (
                        <div key={source.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <Input
                              value={source.label}
                              onChange={(e) => updateContentSource(source.id, 'label', e.target.value)}
                              className="input-retro flex-1"
                              placeholder={`Source ${index + 1} Label (e.g., "Main YouTube Channel")`}
                            />
                            {contentSources.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeContentSource(source.id)}
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <Input
                            value={source.url}
                            onChange={(e) => updateContentSource(source.id, 'url', e.target.value)}
                            className="input-retro ml-6"
                            placeholder="https://youtube.com/channel/your-channel or https://twitch.tv/your-stream"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Add multiple content sources that clippers can extract clips from
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget & Timeline Card - Now Full Width */}
            <Card className="window-card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <DollarSign className="w-5 h-5" />
                <h3 className="text-retro-display text-lg">BUDGET & TIMELINE</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Budget Settings */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Campaign Budget */}
                    <div>
                      <Label className="text-retro-display text-sm mb-2 block">CAMPAIGN BUDGET (AUD)</Label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(Number(e.target.value))}
                          className="input-retro pl-10"
                          min="100"
                          step="50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum $100. Higher budgets attract more quality submissions.
                      </p>
                    </div>

                    {/* Campaign Duration */}
                    <div>
                      <Label className="text-retro-display text-sm mb-2 block">CAMPAIGN DURATION</Label>
                      <Select value={campaignDuration} onValueChange={setCampaignDuration}>
                        <SelectTrigger className="input-retro">
                          <Calendar className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-days-fast">3 Days - Fast Timeline</SelectItem>
                          <SelectItem value="7-days-balanced">7 Days - Balanced Timeline</SelectItem>
                          <SelectItem value="14-days-extended">14 Days - Extended Timeline</SelectItem>
                          <SelectItem value="30-days-long">30 Days - Long Timeline</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Longer campaigns typically get more submissions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Platform Distribution & CPM */}
                <div className="space-y-6">
                  {/* Platform Distribution */}
                  <div>
                    <h4 className="text-retro-display text-sm mb-4">📱 PLATFORM DISTRIBUTION</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {platforms.map((platform) => (
                        <Card
                          key={platform.id}
                          className={`p-4 cursor-pointer transition-all border-2 ${
                            platform.isActive 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted bg-muted/20 opacity-50'
                          }`}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{platform.icon}</span>
                              <span className="text-retro-display text-xs">{platform.name}</span>
                            </div>
                            {platform.isActive && (
                              <Badge className="status-approved text-xs px-2 py-1">
                                ACTIVE
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {platform.allocation}% allocation
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Platform CPM Rates */}
                  <div>
                    <h4 className="text-retro-display text-sm mb-4">PLATFORM CPM RATES</h4>
                    <div className="space-y-3">
                      {activePlatforms.map((platform) => (
                        <div key={platform.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{platform.icon}</span>
                            <span className="text-retro-display text-sm">{platform.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">CPM RATE</p>
                              <div className="relative">
                                <DollarSign className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type="number"
                                  value={platform.cpmRate}
                                  onChange={(e) => handleCpmChange(platform.id, Number(e.target.value))}
                                  className="w-20 text-xs pl-6 py-1"
                                  step="0.10"
                                  min="0.50"
                                />
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">BUDGET</p>
                              <p className="text-retro-display text-sm">${Math.round(platform.budget)}</p>
                              <p className="text-xs text-muted-foreground">{platform.allocation}% of total</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">EXPECTED VIEWS</p>
                              <p className="text-retro-display text-sm">{formatViews(platform.expectedViews)}</p>
                              <p className="text-xs text-muted-foreground">views</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center space-x-4 mt-12">
            <Button
              onClick={onBack}
              variant="outline"
              className="btn-secondary-cyan px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO TYPE
            </Button>
            
            <Button
              onClick={handleContinue}
              className="btn-primary px-8 py-3"
            >
              <Target className="w-4 h-4 mr-2" />
              CONTINUE TO ESCROW
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}