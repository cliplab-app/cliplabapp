'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle } from 'lucide-react';
import { CampaignTypeData } from '../constants/campaignSetupConstants';

interface CampaignTypeCardProps {
  campaign: CampaignTypeData;
  isSelected: boolean;
  onSelect: (type: 'reach') => void;
}

export function CampaignTypeCard({ campaign, isSelected, onSelect }: CampaignTypeCardProps) {
  const IconComponent = campaign.icon;
  
  const handleClick = () => {
    if (campaign.isActive && campaign.id === 'reach') {
      onSelect('reach');
    }
  };

  return (
    <Card 
      className={`window-card cursor-pointer transition-all duration-200 relative overflow-hidden ${
        !campaign.isActive ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        isSelected ? 'ring-4 ring-primary shadow-glow' : 'hover:shadow-glow'
      }`}
      onClick={handleClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${campaign.gradientFrom} to-${campaign.gradientTo} opacity-20`} />
      
      {/* Badges */}
      <div className="absolute top-4 right-4">
        {campaign.isRecommended && campaign.isActive ? (
          <Badge className="text-xs px-2 py-1 status-approved border-0">
            RECOMMENDED
          </Badge>
        ) : !campaign.isActive ? (
          <Badge className="text-xs px-2 py-1 bg-muted text-muted-foreground">
            COMING SOON
          </Badge>
        ) : null}
      </div>

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-8 h-8 bg-${campaign.iconBg} rounded-full flex items-center justify-center`}>
            <IconComponent className={`w-4 h-4 text-${campaign.iconColor}`} />
          </div>
          <h3 className={`text-retro-display text-xl ${!campaign.isActive ? 'text-muted-foreground' : ''}`}>
            {campaign.title}
          </h3>
        </div>
        
        <p className={`mb-4 ${!campaign.isActive ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
          {campaign.subtitle}
        </p>
        
        <div className="space-y-4 mb-6">
          <p className={`text-sm ${!campaign.isActive ? 'text-muted-foreground' : ''}`}>
            {campaign.description}
          </p>
        </div>

        {/* Key Benefit */}
        <div className={`rounded-lg p-3 mb-4 ${
          campaign.isActive ? 
            'bg-status-approved/10 border border-status-approved/20' : 
            'bg-muted/50'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-4 h-4 ${
              campaign.isActive ? 'text-status-approved' : 'text-muted-foreground'
            }`} />
            <span className={`text-retro-display text-xs ${
              !campaign.isActive ? 'text-muted-foreground' : ''
            }`}>
              KEY BENEFIT
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            !campaign.isActive ? 'text-muted-foreground' : ''
          }`}>
            {campaign.keyBenefit}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className={`text-retro-display text-sm mb-2 ${
              !campaign.isActive ? 'text-muted-foreground' : ''
            }`}>
              FEATURES
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {campaign.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    campaign.isActive ? 'bg-secondary' : 'bg-muted-foreground'
                  }`} />
                  <span className={!campaign.isActive ? 'text-muted-foreground' : ''}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className={`text-retro-display text-sm mb-2 ${
            !campaign.isActive ? 'text-muted-foreground' : ''
          }`}>
            BEST FOR
          </h4>
          <p className={`text-xs ${
            !campaign.isActive ? 'text-muted-foreground' : 'text-muted-foreground'
          }`}>
            {campaign.bestFor}
          </p>
        </div>

        {/* Selection Indicator */}
        {isSelected && campaign.isActive && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-foreground">
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}