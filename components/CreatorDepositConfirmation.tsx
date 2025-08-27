'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Play, CreditCard, DollarSign, Building, Shield, Info, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatorDepositConfirmationProps {
  onConfirm: (paymentMethod: string, amount: number) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function CreatorDepositConfirmation({ onConfirm, onSkip, onBack }: CreatorDepositConfirmationProps) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState('250');

  const handleAuthorize = async () => {
    const amount = parseInt(escrowAmount);
    if (amount < 50) {
      // In real app, show error message
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onConfirm(paymentMethod, amount);
    }, 2000);
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setEscrowAmount(numericValue);
  };

  const isValidAmount = parseInt(escrowAmount) >= 50 && parseInt(escrowAmount) <= 10000;

  return (
    <div className="min-h-screen bg-background-secondary grid-bg flex flex-col">
      {/* Header */}
      <header className="bg-nav-yellow border-b-2 border-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <Play className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-retro-display text-sm">CLIPLAB CREATOR</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="window-card p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-status-approved border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-retro-display text-2xl mb-2">SECURE YOUR BOUNTY</h1>
                <p className="text-sm text-muted-foreground">Set up escrow for your campaigns</p>
              </div>

              {/* Customizable Amount Input */}
              <div className="mb-6">
                <Label htmlFor="escrowAmount" className="text-sm mb-4 block">INITIAL ESCROW AMOUNT (AUD)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                  <Input
                    id="escrowAmount"
                    type="text"
                    value={escrowAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="input-retro pl-8 text-center text-2xl font-bold py-4"
                    placeholder="250"
                  />
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  {!isValidAmount && escrowAmount && (
                    <p className="text-destructive">Amount must be between $50 and $10,000 AUD</p>
                  )}
                  {isValidAmount && (
                    <p className="text-status-approved">✓ Valid amount for campaign funding</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="ghost"
                      size="sm"
                      onClick={() => setEscrowAmount(amount.toString())}
                      className={`text-xs ${escrowAmount === amount.toString() ? 'btn-primary' : ''}`}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Amount Display */}
              {isValidAmount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="window-card p-6 bg-primary/10 border-primary/30 mb-6"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">${escrowAmount} AUD</div>
                      <div className="text-sm text-muted-foreground">READY TO SECURE</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Explanation */}
              <div className="window-card p-4 bg-info/10 border-info/30 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-vibrant-blue mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">How escrow works:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• We hold your funds securely until clips are approved</li>
                      <li>• Money is only released when you're satisfied with results</li>
                      <li>• Unused funds return to your account automatically</li>
                      <li>• You can add more funds anytime in your dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              {isValidAmount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Label className="text-sm mb-4 block">SELECT PAYMENT METHOD</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="window-card p-4 bg-white">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-vibrant-blue" />
                          <div>
                            <div className="font-bold">CREDIT/DEBIT CARD</div>
                            <div className="text-xs text-muted-foreground">Powered by Stripe • Instant setup</div>
                          </div>
                        </Label>
                        <Badge className="status-approved text-xs">RECOMMENDED</Badge>
                      </div>
                    </div>

                    <div className="window-card p-4 bg-white">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer flex items-center space-x-3">
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          <div>
                            <div className="font-bold">PAYPAL</div>
                            <div className="text-xs text-muted-foreground">Use your PayPal balance or linked cards</div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="window-card p-4 bg-white">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center space-x-3">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-bold">BANK TRANSFER</div>
                            <div className="text-xs text-muted-foreground">Direct from your bank account • 1-2 days</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}

              {/* Security Notice */}
              {isValidAmount && (
                <div className="flex items-center space-x-2 mb-6 text-xs text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-status-approved" />
                  <span>256-bit SSL encryption • PCI DSS compliant • Funds held in escrow</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary Actions */}
                {isValidAmount && (
                  <div className="flex space-x-3">
                    <Button 
                      variant="ghost"
                      onClick={onBack}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      BACK
                    </Button>
                    <Button 
                      onClick={handleAuthorize}
                      className="flex-1 btn-primary"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          <span>PROCESSING...</span>
                        </div>
                      ) : (
                        `AUTHORIZE $${escrowAmount} AUD`
                      )}
                    </Button>
                  </div>
                )}

                {/* Skip Option */}
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">OR</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    onClick={handleSkip}
                    className="mt-4 text-xs hover:text-vibrant-blue flex items-center space-x-2"
                    disabled={isProcessing}
                  >
                    <span>SKIP FOR NOW</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can add funds later when creating your first campaign
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}