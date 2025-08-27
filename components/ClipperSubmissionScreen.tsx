'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Check, X, ExternalLink, Play, DollarSign, Clock, AlertTriangle, Loader2, Users, Target, CheckCircle, Download, FileText, Music, Image, Video, Folder, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import type { Bounty, User } from '../App';

interface ClipperSubmissionScreenProps {
  campaign: Bounty;
  onBack: () => void;
  onSubmit: (submission: {
    bountyId: string;
    clipperId: string;
    clipperUsername: string;
    youtubeUrl: string;
    description: string;
    status: 'pending';
  }, navigateToSubmissions?: boolean) => void;
  user: User;
}

export function ClipperSubmissionScreen({ campaign, onBack, onSubmit, user }: ClipperSubmissionScreenProps) {
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    description: '',
    agreeToTerms: false
  });

  const [urlStatus, setUrlStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Mock URL validation - simplified to always succeed if basic format is correct
  useEffect(() => {
    if (formData.youtubeUrl.length > 0) {
      setUrlStatus('validating');
      const timer = setTimeout(() => {
        // Very basic URL validation - just check if it contains youtube
        const hasYouTube = formData.youtubeUrl.toLowerCase().includes('youtube') || formData.youtubeUrl.toLowerCase().includes('youtu.be');
        setUrlStatus(hasYouTube ? 'valid' : 'invalid');
      }, 500); // Faster validation
      return () => clearTimeout(timer);
    } else {
      setUrlStatus('idle');
    }
  }, [formData.youtubeUrl]);

  // Clear specific error when user starts typing/interacting
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Only basic validation needed
    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube URL is required';
    } else if (urlStatus !== 'valid') {
      newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
    }
    
    // Description is optional - no validation
    if (formData.description.trim().length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the submission terms to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit button clicked!'); // Debug log
    
    setIsSubmitting(true);
    
    // Simple validation check
    if (validateForm()) {
      try {
        console.log('Form validation passed, simulating submission...'); // Debug log
        
        // Always simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        console.log('Submission simulation complete, showing dialog...'); // Debug log
        
        // Show success dialog immediately - DON'T call onSubmit yet!
        setShowSuccessDialog(true);
        
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrors({ submit: 'Something went wrong. Please try again.' });
      }
    } else {
      console.log('Form validation failed:', errors); // Debug log
    }
    
    setIsSubmitting(false);
  };

  const handleViewSubmissions = () => {
    console.log('View submissions clicked - navigating to submissions tab'); // Debug log
    
    // Create the submission data and call onSubmit with navigation flag
    const submissionData = {
      bountyId: campaign.id,
      clipperId: user.id,
      clipperUsername: user.username,
      youtubeUrl: formData.youtubeUrl,
      description: formData.description,
      status: 'pending' as const
    };
    
    // Call onSubmit with flag to navigate to submissions tab
    onSubmit(submissionData, true); // true = navigate to submissions tab
    
    // Close the dialog
    setShowSuccessDialog(false);
  };

  const handleSubmitAnother = () => {
    console.log('Submit another clicked - clearing URL field only'); // Debug log
    
    // Close dialog first
    setShowSuccessDialog(false);
    
    // Only clear the URL field, keep description and terms agreement
    setFormData(prev => ({
      ...prev,
      youtubeUrl: '' // Only clear the URL
    }));
    
    // Reset URL validation status
    setUrlStatus('idle');
    
    // Clear any URL-related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.youtubeUrl;
      return newErrors;
    });
    
    // Stay on the current page - don't call onSubmit or navigate away
    console.log('Form reset - URL cleared, staying on submission page');
  };

  const getUrlIcon = () => {
    switch (urlStatus) {
      case 'validating':
        return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
      case 'valid':
        return <Check className="w-4 h-4 text-status-approved" />;
      case 'invalid':
        return <X className="w-4 h-4 text-status-rejected" />;
      default:
        return null;
    }
  };

  const getUrlStatus = () => {
    switch (urlStatus) {
      case 'validating':
        return 'Validating URL...';
      case 'valid':
        return 'Valid YouTube URL';
      case 'invalid':
        return 'Please enter a YouTube URL';
      default:
        return '';
    }
  };

  const isFormValid = urlStatus === 'valid' && 
                    formData.description.trim().length <= 300 &&
                    formData.agreeToTerms;

  const formatTimeLeft = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  console.log('Component state:', { isSubmitting, showSuccessDialog, formData, urlStatus, isFormValid }); // Debug log

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
      {/* Success Dialog - Perfectly centered with explicit positioning */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent 
          className="max-w-md bg-white border-2 border-foreground shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: '#ffffff',
            color: '#1A1A1F',
            zIndex: 9999,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '28rem',
            width: '90vw'
          }}
        >
          <DialogHeader style={{ color: '#1A1A1F' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-status-approved/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-status-approved" />
              </div>
            </div>
            <DialogTitle 
              className="text-retro-display text-center text-xl"
              style={{ color: '#1A1A1F' }}
            >
              CLIP SUBMITTED!
            </DialogTitle>
            <DialogDescription 
              className="text-center text-muted-foreground"
              style={{ color: '#6B6B76' }}
            >
              Your clip has been successfully submitted to the campaign. You can now track its approval status or submit additional clips.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <p 
              className="text-center text-muted-foreground"
              style={{ color: '#6B6B76' }}
            >
              Track Its Approval In The{' '}
              <span className="text-vibrant-blue font-bold" style={{ color: '#00E5FF' }}>My Submissions</span> Tab
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleViewSubmissions}
                className="w-full btn-primary py-3"
                style={{ 
                  backgroundColor: '#7FFF00',
                  color: '#1A1A1F',
                  border: '2px solid #1A1A1F',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                VIEW MY SUBMISSIONS
              </Button>
              
              <Button 
                onClick={handleSubmitAnother}
                variant="outline"
                className="w-full py-3 border-2 border-foreground hover:bg-muted"
                style={{
                  backgroundColor: 'transparent',
                  color: '#1A1A1F',
                  border: '2px solid #1A1A1F',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                SUBMIT ANOTHER CLIP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="btn-secondary-cyan px-3 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO CAMPAIGNS
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                  <Play className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-retro-display text-lg">CLIPLAB</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="status-approved px-3 py-2">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeLeft(campaign.deadline)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Campaign Info - Full Width at Top */}
        <Card className="window-card p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-retro-display text-xl mb-2">{campaign.title}</h2>
              <p className="text-muted-foreground">{campaign.description}</p>
            </div>
            
            {/* Creator Profile */}
            <div className="flex items-center space-x-3 ml-6">
              <div className="text-right">
                <div className="text-xs text-retro-mono text-muted-foreground">CREATED BY</div>
                <div className="text-sm font-bold">@{campaign.creatorUsername || 'Creator'}</div>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full border-2 border-foreground flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {(campaign.creatorUsername || 'C')[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Creator Notes */}
          {campaign.campaignData?.creatorNotes && (
            <div className="mt-4 p-3 bg-background-secondary rounded border-l-4 border-primary">
              <div className="text-xs text-retro-display mb-1">CREATOR NOTES:</div>
              <p className="text-sm text-muted-foreground">{campaign.campaignData.creatorNotes}</p>
            </div>
          )}

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {campaign.hashtags.map(tag => (
              <Badge key={tag} className={`hashtag-${tag.toLowerCase()} text-xs px-2 py-1`}>
                #{tag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Stats & Guidelines */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prize Pool Card */}
            <Card className="window-card p-6 bg-status-approved/10 border-status-approved/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-status-approved/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-status-approved" />
                </div>
                <div>
                  <div className="text-xs text-retro-mono text-muted-foreground">TOTAL PRIZE POOL</div>
                  <div className="text-2xl text-status-approved font-bold">${campaign.amount.toLocaleString()}</div>
                </div>
              </div>
            </Card>

            {/* Payout Checklist */}
            <Card className="window-card p-6 bg-status-approved/5">
              <h3 className="text-retro-display mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-status-approved" />
                PAYOUT CHECKLIST
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-status-approved" />
                  <span>Min. Views 100k</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-status-approved" />
                  <span> Must Tag ''@mrbeast'in caption </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-status-approved" />
                  <span>Content matches campaign theme</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-status-approved" />
                  <span>High engagement potential</span>
                </div>
              </div>
            </Card>

            {/* Submissions Card */}
            <Card className="window-card p-6 bg-vibrant-blue/10 border-vibrant-blue/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-vibrant-blue/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-vibrant-blue" />
                </div>
                <div>
                  <div className="text-xs text-retro-mono text-muted-foreground">CURRENT SUBMISSIONS</div>
                  <div className="text-2xl text-vibrant-blue font-bold">{campaign.submissions.length}</div>
                </div>
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="window-card p-4 bg-status-pending/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-status-pending mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-retro-display text-xs text-status-pending mb-1">IMPORTANT:</div>
                  <p className="text-muted-foreground text-xs">
                    Make sure your video is public and remains available throughout the campaign period. 
                    Private or deleted videos will be disqualified.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Submission Form & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Submission Form */}
            <Card className="window-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h1 className="text-retro-display text-2xl">SUBMIT YOUR CLIP</h1>
                  <p className="text-muted-foreground">Enter your YouTube URL and details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube URL */}
                <div>
                  <Label className="text-retro-display text-xs mb-2 block">YOUTUBE URL *</Label>
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="https://youtube.com/shorts/your-video-id or https://youtu.be/your-video-id"
                      value={formData.youtubeUrl}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }));
                        clearError('youtubeUrl');
                      }}
                      className={`input-retro pr-10 ${errors.youtubeUrl ? 'border-status-rejected border-2' : urlStatus === 'valid' ? 'border-status-approved border-2' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getUrlIcon()}
                    </div>
                  </div>
                  {formData.youtubeUrl.length > 0 && (
                    <p className={`text-xs mt-1 ${
                      urlStatus === 'valid' ? 'text-status-approved' : 
                      urlStatus === 'invalid' ? 'text-status-rejected' : 
                      'text-muted-foreground'
                    }`}>
                      {getUrlStatus()}
                    </p>
                  )}
                  {errors.youtubeUrl && (
                    <p className="text-status-rejected text-xs mt-1 font-bold">{errors.youtubeUrl}</p>
                  )}
                </div>

                {/* Description - Smaller and Optional */}
                <div>
                  <Label className="text-retro-display text-xs mb-2 block">
                    CLIP DESCRIPTION <span className="text-muted-foreground font-normal">(OPTIONAL)</span>
                  </Label>
                  <Textarea
                    placeholder="Brief description of your clip (optional)..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                      clearError('description');
                    }}
                    className={`input-retro min-h-[80px] resize-none ${errors.description ? 'border-status-rejected border-2' : ''}`}
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {errors.description && (
                        <p className="text-status-rejected text-xs font-bold">{errors.description}</p>
                      )}
                    </div>
                    <p className={`text-xs ${formData.description.length > 250 ? 'text-status-pending' : 'text-muted-foreground'}`}>
                      {formData.description.length}/300 characters
                    </p>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }));
                        clearError('terms');
                      }}
                      className={`mt-1 ${errors.terms ? 'border-status-rejected border-2' : ''}`}
                    />
                    <Label htmlFor="terms" className="text-xs leading-relaxed">
                      I confirm that my content is original, follows platform guidelines, and I agree to the{' '}
                      <a href="#" className="text-vibrant-blue hover:underline">
                        submission terms
                      </a>
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-status-rejected text-xs font-bold">{errors.terms}</p>
                  )}
                </div>



                {/* General submission error */}
                {errors.submit && (
                  <div className="p-4 bg-status-rejected/10 border border-status-rejected/30 rounded">
                    <div className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-status-rejected mt-0.5" />
                      <p className="text-status-rejected text-sm font-bold">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button - Always clickable, always succeeds */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className={`w-full py-4 text-lg transition-all duration-200 ${
                      isFormValid 
                        ? 'btn-primary' 
                        : 'bg-muted text-muted-foreground border-2 border-foreground hover:bg-status-rejected hover:text-white hover:shadow-lg'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        SUBMITTING CLIP...
                      </>
                    ) : isFormValid ? (
                      <>SUBMIT FOR ${campaign.amount.toLocaleString()}</>
                    ) : (
                      'SUBMIT CLIP'
                    )}
                  </Button>
                </motion.div>
              </form>
            </Card>

            {/* Content Dump Section */}
            <Card className="window-card p-8 mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-retro-display text-2xl">CONTENT DUMP</h2>
                  <p className="text-muted-foreground">Creator-provided assets and reference materials</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button className="btn-secondary-cyan px-8 py-4">
                  <ExternalLink className="w-5 h-5 mr-3" />
                  OPEN GOOGLE DRIVE
                </Button>
              </div>


            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}