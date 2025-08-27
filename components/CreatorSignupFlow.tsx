'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Play, User, Link, Upload, Check, X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatorSignupFlowProps {
  onBack: () => void;
  onSignup: (email: string, password: string, username: string, role: 'creator', channelLink?: string) => void;
  onLogin: () => void;
}

export function CreatorSignupFlow({ onBack, onSignup, onLogin }: CreatorSignupFlowProps) {
  const [currentStep, setCurrentStep] = useState<'auth' | 'profile'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Mock username availability check
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setIsCheckingUsername(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock logic: usernames with 'taken' are unavailable
      const available = !username.toLowerCase().includes('taken') && username.length >= 3;
      setUsernameAvailable(available);
      setIsCheckingUsername(false);
    }, 800);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameAvailable(null);
    
    if (value.length >= 3) {
      checkUsernameAvailability(value);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && password === confirmPassword && agreeToTerms) {
      setCurrentStep('profile');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && usernameAvailable) {
      onSignup(email, password, username, 'creator', channelLink || undefined);
    }
  };

  // Validation helpers
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password && password.length >= 6;
  const isPasswordConfirmed = confirmPassword && password === confirmPassword;
  const isAuthValid = isEmailValid && isPasswordValid && isPasswordConfirmed && agreeToTerms;
  const isProfileValid = username && usernameAvailable && !isCheckingUsername;

  // Validation state helpers
  const getEmailError = () => {
    if (!emailTouched) return null;
    if (!email) return "Email is required";
    if (!isEmailValid) return "Please enter a valid email address";
    return null;
  };

  const getPasswordError = () => {
    if (!passwordTouched) return null;
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const getConfirmPasswordError = () => {
    if (!confirmPasswordTouched) return null;
    if (!confirmPassword) return "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex flex-col">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-retro-nav hover:text-vibrant-blue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Play className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-retro-display text-sm">CLIPLAB CREATOR</span>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onLogin}
            className="text-retro-nav hover:text-vibrant-blue"
          >
            EXISTING USER? LOGIN
          </Button>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b-2 border-foreground p-4">
        <div className="max-w-md mx-auto flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === 'auth' ? 'text-primary' : 'text-status-approved'}`}>
            <div className={`w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center ${
              currentStep === 'auth' ? 'bg-primary' : 'bg-status-approved'
            }`}>
              {currentStep === 'profile' ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-retro-mono text-sm">ACCOUNT</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-border"></div>
          
          <div className={`flex items-center space-x-2 ${currentStep === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center ${
              currentStep === 'profile' ? 'bg-primary' : 'bg-muted'
            }`}>
              2
            </div>
            <span className="text-retro-mono text-sm">PROFILE</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto w-full">
          {/* Authentication Step */}
          {currentStep === 'auth' && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="window-card p-8">
                <div className="text-center mb-8">
                  <h1 className="text-retro-display text-2xl mb-2">CREATE ACCOUNT</h1>
                  <p className="text-sm text-muted-foreground">Start building your creator presence</p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">EMAIL ADDRESS</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      className={`input-retro ${getEmailError() ? 'border-destructive border-2' : isEmailValid ? 'border-status-approved border-2' : ''}`}
                      placeholder="creator@example.com"
                      required
                    />
                    {getEmailError() && (
                      <p className="text-xs text-destructive mt-1">{getEmailError()}</p>
                    )}
                    {emailTouched && isEmailValid && (
                      <p className="text-xs text-status-approved mt-1">✓ Valid email address</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">PASSWORD</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordTouched(true);
                        }}
                        onBlur={() => setPasswordTouched(true)}
                        className={`input-retro pr-10 ${getPasswordError() ? 'border-destructive border-2' : isPasswordValid ? 'border-status-approved border-2' : ''}`}
                        placeholder="Minimum 6 characters"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {getPasswordError() && (
                      <p className="text-xs text-destructive mt-1">{getPasswordError()}</p>
                    )}
                    {passwordTouched && isPasswordValid && (
                      <p className="text-xs text-status-approved mt-1">✓ Password strength: Good</p>
                    )}
                    {/* Password requirements */}
                    {passwordTouched && !isPasswordValid && (
                      <div className="mt-2 text-xs">
                        <p className="text-muted-foreground mb-1">Password requirements:</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-status-approved' : 'bg-muted'}`}></div>
                          <span className={password.length >= 6 ? 'text-status-approved' : 'text-muted-foreground'}>
                            At least 6 characters
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">CONFIRM PASSWORD</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordTouched(true);
                      }}
                      onBlur={() => setConfirmPasswordTouched(true)}
                      className={`input-retro ${getConfirmPasswordError() ? 'border-destructive border-2' : isPasswordConfirmed ? 'border-status-approved border-2' : ''}`}
                      placeholder="Confirm your password"
                      required
                    />
                    {getConfirmPasswordError() && (
                      <p className="text-xs text-destructive mt-1">{getConfirmPasswordError()}</p>
                    )}
                    {confirmPasswordTouched && isPasswordConfirmed && (
                      <p className="text-xs text-status-approved mt-1">✓ Passwords match</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  {(emailTouched || passwordTouched || confirmPasswordTouched) && !agreeToTerms && (
                    <p className="text-xs text-muted-foreground mt-1">Please agree to the terms to continue</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={!isAuthValid}
                  >
                    CONTINUE TO PROFILE
                  </Button>
                  
                  {/* Form validation summary when button is disabled */}
                  {(emailTouched || passwordTouched || confirmPasswordTouched) && !isAuthValid && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p className="mb-1">Complete the following to continue:</p>
                      <ul className="space-y-1">
                        {!isEmailValid && <li>• Valid email address</li>}
                        {!isPasswordValid && <li>• Password (minimum 6 characters)</li>}
                        {!isPasswordConfirmed && password && <li>• Matching password confirmation</li>}
                        {!agreeToTerms && <li>• Agree to terms and conditions</li>}
                      </ul>
                    </div>
                  )}
                </form>
              </Card>
            </motion.div>
          )}

          {/* Profile Setup Step */}
          {currentStep === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="window-card p-8">
                <div className="text-center mb-8">
                  <h1 className="text-retro-display text-2xl mb-2">SETUP PROFILE</h1>
                  <p className="text-sm text-muted-foreground">Complete your creator profile</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="username">USERNAME</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`input-retro pr-10 ${
                          username.length > 0 && username.length < 3 ? 'border-destructive border-2' :
                          usernameAvailable === false ? 'border-destructive border-2' :
                          usernameAvailable === true ? 'border-status-approved border-2' : ''
                        }`}
                        placeholder="your_creator_name"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isCheckingUsername && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                          />
                        )}
                        {!isCheckingUsername && usernameAvailable === true && (
                          <Check className="w-4 h-4 text-status-approved" />
                        )}
                        {!isCheckingUsername && usernameAvailable === false && (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </div>
                    {username.length > 0 && username.length < 3 && (
                      <p className="text-xs text-destructive mt-1">Username must be at least 3 characters</p>
                    )}
                    {usernameAvailable === false && (
                      <p className="text-xs text-destructive mt-1">This username is already taken</p>
                    )}
                    {usernameAvailable === true && (
                      <p className="text-xs text-status-approved mt-1">✓ Username is available!</p>
                    )}
                    {username.length >= 3 && isCheckingUsername && (
                      <p className="text-xs text-muted-foreground mt-1">Checking availability...</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="channelLink">CHANNEL LINK (OPTIONAL)</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="channelLink"
                        type="url"
                        value={channelLink}
                        onChange={(e) => setChannelLink(e.target.value)}
                        className="input-retro pl-10"
                        placeholder="https://youtube.com/@yourchannel"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Link to your YouTube or Instagram channel</p>
                  </div>

                  <div>
                    <Label>AVATAR (OPTIONAL)</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        CHOOSE FILE
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep('auth')}
                      className="flex-1"
                    >
                      BACK
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-primary"
                      disabled={!isProfileValid}
                    >
                      CONTINUE
                    </Button>
                  </div>
                  
                  {/* Profile validation summary */}
                  {username.length > 0 && !isProfileValid && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p className="mb-1">Complete the following to continue:</p>
                      <ul className="space-y-1">
                        {username.length < 3 && <li>• Username must be at least 3 characters</li>}
                        {username.length >= 3 && usernameAvailable === false && <li>• Choose an available username</li>}
                        {username.length >= 3 && isCheckingUsername && <li>• Checking username availability...</li>}
                      </ul>
                    </div>
                  )}
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}