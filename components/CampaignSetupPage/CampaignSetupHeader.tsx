'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ArrowLeft, Crown } from 'lucide-react';
import { STEP_LABELS } from '../constants/campaignSetupConstants';

interface CampaignSetupHeaderProps {
  onBack: () => void;
}

export function CampaignSetupHeader({ onBack }: CampaignSetupHeaderProps) {
  return (
    <>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-retro-display text-lg">CAMPAIGN SETUP</h2>
            <span className="text-retro-display text-sm text-muted-foreground">STEP 1 OF 3</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={33.33} className="h-3 border-2 border-foreground" />
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-sm">
            {STEP_LABELS.map((label, index) => (
              <div key={index} className="text-center flex-1">
                <p className={`text-retro-display text-xs ${
                  index === 0 ? '' : 'text-muted-foreground'
                }`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}