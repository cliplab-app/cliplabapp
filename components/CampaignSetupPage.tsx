'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Target } from 'lucide-react';
import { CampaignSetupHeader } from './CampaignSetupPage/CampaignSetupHeader';
import { CampaignTypeCard } from './CampaignSetupPage/CampaignTypeCard';
import { CAMPAIGN_TYPES } from './constants/campaignSetupConstants';

interface CampaignSetupPageProps {
  onBack: () => void;
  onContinue: (campaignType: 'reach') => void;
  user: any;
}

export function CampaignSetupPage({ onBack, onContinue, user }: CampaignSetupPageProps) {
  const [selectedType, setSelectedType] = useState<'reach' | null>(null);

  const handleSelectType = (type: 'reach') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onContinue(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <CampaignSetupHeader onBack={onBack} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-retro-display text-3xl mb-4">
              CHOOSE YOUR
              <br />
              CAMPAIGN TYPE
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the campaign strategy that best fits your content goals and budget. Each type is 
              optimized for different outcomes and creator needs.
            </p>
          </div>

          {/* Campaign Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {CAMPAIGN_TYPES.map((campaign) => (
              <CampaignTypeCard
                key={campaign.id}
                campaign={campaign}
                isSelected={selectedType === campaign.id}
                onSelect={handleSelectType}
              />
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`px-8 py-4 text-lg ${
                selectedType ? 'btn-primary' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              SELECT A CAMPAIGN TYPE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}