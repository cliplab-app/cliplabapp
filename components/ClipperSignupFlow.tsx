'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { ArrowLeft, Play, Check, X, Loader2, ExternalLink } from 'lucide-react';

interface ClipperSignupFlowProps {
  onBack: () => void;
  onSignup: (email: string, password: string, username: string, role: 'clipper', channelLink?: string) => void;
  onLogin: () => void;
}

export function ClipperSignupFlow({ onBack, onSignup, onLogin }: ClipperSignupFlowProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    channelLink: '',
    agreeToTerms: false
  });

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Mock username availability check
  useEffect(() => {
    if (formData.username.length >= 3) {
      setUsernameStatus('checking');
      const timer = setTimeout(() => {
        // Mock some taken usernames
        const takenUsernames = ['admin', 'clipper', 'test', 'user', 'clipmaster'];
        const isAvailable = !takenUsernames.includes(formData.username.toLowerCase());
        setUsernameStatus(isAvailable ? 'available' : 'taken');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus('idle');
    }
  }, [formData.username]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'Username is already taken';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms & Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always validate the form when submit is attempted
    const isValid = validateForm();
    
    // Only proceed with signup if form is valid
    if (isValid) {
      onSignup(
        formData.email, 
        formData.password, 
        formData.username, 
        'clipper',
        formData.channelLink || undefined
      );
    }
    // If invalid, the validateForm() call above will set the errors state
    // which will cause the error messages to display
  };

  const getUsernameIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
      case 'available':
        return <Check className="w-4 h-4 text-status-approved" />;
      case 'taken':
        return <X className="w-4 h-4 text-status-rejected" />;
      default:
        return null;
    }
  };

  const getUsernameStatus = () => {
    switch (usernameStatus) {
      case 'checking':
        return 'Checking availability...';
      case 'available':
        return 'Username available!';
      case 'taken':
        return 'Username taken';
      default:
        return '';
    }
  };

  const isFormValid = usernameStatus === 'available' && 
                    formData.email && 
                    formData.password.length >= 6 && 
                    formData.agreeToTerms;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg">
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
                BACK
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
                  <Play className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-retro-display text-lg">CLIPLAB</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-retro-nav text-sm">Already have an account?</span>
              <Button onClick={onLogin} className="btn-secondary-cyan">
                LOG IN
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-12">
        <Card className="window-card bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-retro-display text-2xl mb-2">JOIN CLIPLAB</h1>
            <p className="text-muted-foreground text-sm">Start earning from your video editing skills</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label className="text-retro-display text-xs mb-2 block">EMAIL</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`input-retro ${errors.email ? 'border-status-rejected' : ''}`}
              />
              {errors.email && (
                <p className="text-status-rejected text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="text-retro-display text-xs mb-2 block">PASSWORD</Label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`input-retro ${errors.password ? 'border-status-rejected' : ''}`}
              />
              {errors.password && (
                <p className="text-status-rejected text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <Label className="text-retro-display text-xs mb-2 block">USERNAME</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="clipmaster2025"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className={`input-retro pr-10 ${
                    errors.username ? 'border-status-rejected' : 
                    usernameStatus === 'available' ? 'border-status-approved' : ''
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getUsernameIcon()}
                </div>
              </div>
              {formData.username.length >= 3 && (
                <p className={`text-xs mt-1 ${
                  usernameStatus === 'available' ? 'text-status-approved' : 
                  usernameStatus === 'taken' ? 'text-status-rejected' : 
                  'text-muted-foreground'
                }`}>
                  {getUsernameStatus()}
                </p>
              )}
              {errors.username && (
                <p className="text-status-rejected text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Optional YouTube Channel */}
            <div>
              <Label className="text-retro-display text-xs mb-2 block">
                YOUTUBE CHANNEL <span className="text-muted-foreground">(OPTIONAL)</span>
              </Label>
              <Input
                type="url"
                placeholder="https://youtube.com/@yourhandle"
                value={formData.channelLink}
                onChange={(e) => setFormData(prev => ({ ...prev, channelLink: e.target.value }))}
                className="input-retro"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link your channel to showcase your editing style
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-xs leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-vibrant-blue hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-vibrant-blue hover:underline">
                    Privacy Policy
                  </a>
                  <ExternalLink className="w-3 h-3 inline ml-1" />
                </Label>
              </div>
              {errors.terms && (
                <p className="text-status-rejected text-xs">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button - Always enabled, always clickable */}
            <Button 
              type="submit" 
              className="w-full btn-primary py-3 text-lg"
            >
              {isFormValid ? 'CREATE ACCOUNT' : 'COMPLETE ALL FIELDS'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}