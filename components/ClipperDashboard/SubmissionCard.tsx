'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Play,
  Eye,
  Heart,
  Crown,
  Award,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { Submission, Bounty } from '../../App';
import { SUBMISSION_STATUS_STYLES } from '../constants/clipperConstants';

interface SubmissionCardProps {
  submission: Submission;
  bounty?: Bounty;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onViewCampaign?: () => void;
}

export function SubmissionCard({ 
  submission, 
  bounty, 
  isExpanded, 
  onToggleExpanded,
  onViewCampaign 
}: SubmissionCardProps) {
  const getStatusIcon = () => {
    switch (submission.status) {
      case 'winner-1st': return Crown;
      case 'winner-2nd': return Award;
      case 'winner-3rd': return Star;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="window-card p-0 overflow-hidden">
      {/* Essential Info - Always Visible */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center">
              <Play className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-retro-display mb-1">{bounty?.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{submission.submittedAt.toLocaleDateString()}</span>
                {submission.youtubeData && (
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{(submission.youtubeData.views / 1000000).toFixed(1)}M</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{(submission.youtubeData.likes / 1000).toFixed(0)}K</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-3">
            <Badge className={`px-3 py-2 ${SUBMISSION_STATUS_STYLES[submission.status] || 'status-pending'}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {submission.status.replace('-', ' ').toUpperCase()}
            </Badge>
            
            {bounty && (
              <Badge className="status-approved px-3 py-2">
                ${bounty.amount.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        {submission.youtubeData && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-background-secondary rounded-lg mb-4">
            <div className="text-center">
              <div className="text-sm text-retro-display text-primary">
                {(submission.youtubeData.views / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-retro-display text-secondary">
                {(submission.youtubeData.likes / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-retro-display text-secondary-alt">
                {(submission.youtubeData.comments / 100).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {bounty && onViewCampaign && (
            <Button 
              onClick={onViewCampaign}
              className="flex-1 btn-secondary-cyan"
            >
              <Activity className="w-4 h-4 mr-2" />
              VIEW CAMPAIGN
            </Button>
          )}
          <Button 
            onClick={onToggleExpanded}
            variant="outline"
            className="px-4"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-border bg-background-secondary/50 p-6 space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-retro-display text-sm mb-2">SUBMISSION DESCRIPTION</h4>
            <p className="text-sm text-muted-foreground">{submission.description}</p>
          </div>

          {/* YouTube Data */}
          {submission.youtubeData && (
            <div>
              <h4 className="text-retro-display text-sm mb-2">PERFORMANCE METRICS</h4>
              <div className="window-card p-4 bg-card">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Views</span>
                    <span className="text-retro-mono text-sm">{submission.youtubeData.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Likes</span>
                    <span className="text-retro-mono text-sm">{submission.youtubeData.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Comments</span>
                    <span className="text-retro-mono text-sm">{submission.youtubeData.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Engagement Rate</span>
                    <span className="text-retro-mono text-sm">
                      {((submission.youtubeData.likes + submission.youtubeData.comments) / submission.youtubeData.views * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <h5 className="text-xs text-retro-display mb-2">VIDEO TITLE</h5>
                  <p className="text-sm text-muted-foreground">{submission.youtubeData.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* YouTube URL */}
          <div>
            <h4 className="text-retro-display text-sm mb-2">YOUTUBE URL</h4>
            <div className="p-3 bg-card rounded-lg border border-border">
              <a 
                href={submission.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-retro-mono text-sm hover:underline break-all"
              >
                {submission.youtubeUrl}
              </a>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}