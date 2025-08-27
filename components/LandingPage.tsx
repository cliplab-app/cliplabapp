'use client';

import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Play, TrendingUp, Users, Zap, Eye, Heart, MessageCircle, Crown, Star, Flame, DollarSign, Shield, Clock, Smartphone } from 'lucide-react';
import { FeaturedClip, TopCreator } from '../App';

interface LandingPageProps {
  featuredClips: FeaturedClip[];
  topCreators: TopCreator[];
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ featuredClips, topCreators, onLogin, onSignup }: LandingPageProps) {
  const testimonials = [
    {
      id: '1',
      name: 'Alex Chen',
      username: '@ClipMaster_AI',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      earnings: '$2,400',
      period: 'last week',
      quote: 'ClipLab changed my life. I went from struggling to making $2K+ weekly just by identifying viral moments.',
      verified: true
    },
    {
      id: '2',
      name: 'Sarah Rodriguez',
      username: '@ViralClips_Pro',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b8d03d6e?w=100&h=100&fit=crop&crop=faces',
      earnings: '$1,850',
      period: 'last week',
      quote: 'The bounty system is incredible. High-paying creators post jobs daily and the competition keeps you sharp.',
      verified: true
    },
    {
      id: '3',
      name: 'Marcus Thompson',
      username: '@ContentKing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      earnings: '$3,200',
      period: 'last week',
      quote: 'As a creator, I get premium content faster than anywhere else. The clips drive millions of views.',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-vibrant-purple/10 rounded-full blur-xl floating"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-vibrant-cyan/10 rounded-full blur-xl floating-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-vibrant-pink/10 rounded-full blur-xl floating-slow"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-vibrant-green/10 rounded-full blur-xl floating"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-gradient-primary text-xl">ClipLab</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onLogin} className="hover:bg-vibrant-blue/10">
              Sign In
            </Button>
            <Button onClick={onSignup} className="gradient-primary text-white shadow-glow hover:shadow-purple-glow transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30 mb-6 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            Premium Clip Marketplace
          </Badge>
          
          <h1 className="text-6xl mb-6 text-gradient-primary">
            Turn Viral Content Into 
            <br />
            <span className="text-gradient-accent">Serious Income</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with top creators seeking viral clips. Earn <span className="text-vibrant-green">$500-2000/week</span> by 
            delivering content that drives millions of views and engagement.
          </p>

          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-2xl text-vibrant-green">$28,400</div>
              <div className="text-sm text-muted-foreground">Top earner this month</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl text-vibrant-cyan">156</div>
              <div className="text-sm text-muted-foreground">Active clippers</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl text-vibrant-orange">$2.4M</div>
              <div className="text-sm text-muted-foreground">Total paid out</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={onSignup} className="gradient-primary text-white shadow-glow hover:shadow-purple-glow transition-all duration-300 px-8 py-4">
              <DollarSign className="w-5 h-5 mr-2" />
              Start Earning Now
            </Button>
            <Button size="lg" variant="outline" onClick={onLogin} className="border-vibrant-blue text-vibrant-blue hover:bg-vibrant-blue/10 px-8 py-4">
              Browse Opportunities
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Clips - Vertical Video Focus */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2">Premium Vertical Content</h2>
              <p className="text-muted-foreground">Mobile-optimized clips driving maximum engagement and earnings.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-vibrant-blue" />
              <Badge className="bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30">
                <Flame className="w-4 h-4 mr-2" />
                Live Earnings
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredClips.slice(0, 6).map((clip) => (
              <Card key={clip.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 overflow-hidden group aspect-[9/16]">
                <div className="relative h-full">
                  <img 
                    src={clip.thumbnail} 
                    alt={clip.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                  
                  {/* Viral Badge */}
                  {clip.viral && (
                    <Badge className="absolute top-2 left-2 bg-vibrant-red/90 text-white text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      VIRAL
                    </Badge>
                  )}
                  
                  {/* Earnings Badge */}
                  <Badge className="absolute top-2 right-2 bg-vibrant-green/90 text-white text-xs">
                    ${clip.earnings}
                  </Badge>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" className="w-12 h-12 rounded-full gradient-primary shadow-glow">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>

                  {/* Content Info - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge variant="outline" className="border-white/50 text-white text-xs mb-2">
                      {clip.category}
                    </Badge>
                    <h3 className="text-sm mb-1 line-clamp-2">{clip.title}</h3>
                    <p className="text-xs text-white/80 mb-2">{clip.creator}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{(clip.views / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{(clip.likes / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="text-vibrant-green">+${clip.earnings}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-16 bg-card/30 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Success Stories</h2>
            <p className="text-muted-foreground">Real creators earning real money on ClipLab.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full ring-2 ring-vibrant-blue/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Badge className="bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30 text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.username}</p>
                  </div>
                </div>

                <blockquote className="text-sm mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <Badge className="bg-vibrant-green/20 text-vibrant-green border-vibrant-green/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {testimonial.earnings} {testimonial.period}
                  </Badge>
                  <div className="flex text-vibrant-yellow text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Payouts Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Secure & Trusted Payouts</h2>
            <p className="text-muted-foreground">Get paid fast with industry-leading payment processors.</p>
          </div>

          <Card className="card-3d backdrop-blur-glass border-vibrant-green/20 p-8">
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-vibrant-green" />
                <span className="text-sm">Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-vibrant-blue" />
                <span className="text-sm">24-hour payouts</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-vibrant-purple" />
                <span className="text-sm">Multiple currencies</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-12 opacity-70">
              {/* Stripe */}
              <div className="text-center">
                <div className="w-16 h-12 bg-vibrant-blue/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-vibrant-blue font-semibold">stripe</span>
                </div>
                <span className="text-xs text-muted-foreground">Stripe</span>
              </div>

              {/* PayPal */}
              <div className="text-center">
                <div className="w-16 h-12 bg-vibrant-blue/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-vibrant-blue font-semibold">PayPal</span>
                </div>
                <span className="text-xs text-muted-foreground">PayPal</span>
              </div>

              {/* Crypto */}
              <div className="text-center">
                <div className="w-16 h-12 bg-vibrant-orange/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-vibrant-orange font-semibold">₿</span>
                </div>
                <span className="text-xs text-muted-foreground">Bitcoin</span>
              </div>

              {/* Ethereum */}
              <div className="text-center">
                <div className="w-16 h-12 bg-vibrant-purple/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-vibrant-purple font-semibold">Ξ</span>
                </div>
                <span className="text-xs text-muted-foreground">Ethereum</span>
              </div>

              {/* USDC */}
              <div className="text-center">
                <div className="w-16 h-12 bg-vibrant-green/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-vibrant-green font-semibold">USDC</span>
                </div>
                <span className="text-xs text-muted-foreground">USD Coin</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="relative z-10 px-6 py-16 bg-card/50 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Top Performers This Month</h2>
            <p className="text-muted-foreground">Join the ranks of our highest earners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topCreators.slice(0, 5).map((creator, index) => (
              <Card key={creator.id} className={`card-3d text-center p-6 relative overflow-hidden ${
                index === 0 ? 'gradient-primary text-white shadow-glow' : 
                index === 1 ? 'bg-vibrant-purple/10 border-vibrant-purple/30' :
                index === 2 ? 'bg-vibrant-orange/10 border-vibrant-orange/30' :
                'backdrop-blur-glass border-vibrant-blue/20'
              }`}>
                {/* Rank Badge */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  index === 0 ? 'bg-white text-vibrant-blue' :
                  index === 1 ? 'bg-vibrant-purple text-white' :
                  index === 2 ? 'bg-vibrant-orange text-white' :
                  'bg-vibrant-blue text-white'
                }`}>
                  {index + 1}
                </div>

                <div className="relative">
                  <img 
                    src={creator.avatar} 
                    alt={creator.username}
                    className="w-16 h-16 rounded-full mx-auto mb-4 ring-4 ring-current/20"
                  />
                  
                  {/* Status Badge */}
                  <Badge className={`mb-2 ${
                    creator.status === 'Legend' ? 'bg-vibrant-yellow/20 text-vibrant-yellow border-vibrant-yellow/30' :
                    creator.status === 'Elite' ? 'bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30' :
                    creator.status === 'Hot Streak' ? 'bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30' :
                    'bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30'
                  }`}>
                    {creator.status === 'Legend' && <Crown className="w-3 h-3 mr-1" />}
                    {creator.status === 'Hot Streak' && <Flame className="w-3 h-3 mr-1" />}
                    {creator.status === 'Elite' && <Star className="w-3 h-3 mr-1" />}
                    {creator.status}
                  </Badge>
                  
                  <h3 className="mb-2">{creator.username}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={index === 0 ? 'text-white/80' : 'text-muted-foreground'}>Total Earned:</span>
                      <span className="text-vibrant-green">${creator.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={index === 0 ? 'text-white/80' : 'text-muted-foreground'}>Level:</span>
                      <span>{creator.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={index === 0 ? 'text-white/80' : 'text-muted-foreground'}>Streak:</span>
                      <span>{creator.streak} days</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators and clippers building sustainable income from viral content.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={onSignup} className="gradient-primary text-white shadow-glow hover:shadow-purple-glow transition-all duration-300 px-8 py-4">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={onLogin} className="border-vibrant-blue text-vibrant-blue hover:bg-vibrant-blue/10 px-8 py-4">
              View Opportunities
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}